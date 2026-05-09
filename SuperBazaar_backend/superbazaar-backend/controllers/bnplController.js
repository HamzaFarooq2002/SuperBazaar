const CreditLine = require('../models/CreditLine');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const creditConfig = require('../config/creditConfig');
const { validateBnplApr, tierRatesWithinAprCap } = require('../utils/bnplApr');

const reasonResponse = (reason) => ({ eligible: false, reason });

const getTierAndRateCard = (score = 0) => {
  if (score >= 750) return { tier: 'Excellent', rates: creditConfig.BNPL.TIER_RATE_CARD.Excellent };
  if (score >= 700) return { tier: 'Good', rates: creditConfig.BNPL.TIER_RATE_CARD.Good };
  if (score >= 650) return { tier: 'Fair', rates: creditConfig.BNPL.TIER_RATE_CARD.Fair };
  return { tier: 'Poor', rates: creditConfig.BNPL.TIER_RATE_CARD.Poor };
};

const computeBnplStatus = (order) => {
  if (!order?.bnplDetails) return 'Paid';
  if (order.paymentStatus === 'paid' || (order.bnplDetails.outstandingPrincipal || 0) <= 0) return 'Paid';
  const now = new Date();
  const dueDate = new Date(order.bnplDetails.dueDate);
  const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < -3) return 'Active';
  if (diffDays <= 0) return 'Due Soon';
  if (diffDays < 3) return 'Overdue';
  if (diffDays < 7) return 'Overdue + late fee applied';
  if (diffDays < 30) return 'BNPL blocked';
  return 'Recovery';
};

const getEligibility = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('creditScore kycStatus');
    const purchaseAmount = Number(req.query.cartTotal || req.query.purchaseAmount || 0);
    const categories = String(req.query.categories || '').split(',').filter(Boolean);

    if (user?.kycStatus !== 'verified') return res.json({ success: true, data: reasonResponse('kyc_not_verified') });
    const overdueBlocked = await Order.exists({
      paymentMethod: 'bnpl',
      $or: [{ customer: req.user.id }, { merchant: req.user.id }],
      'bnplDetails.outstandingPrincipal': { $gt: 0 },
      'bnplDetails.blockedAt': { $ne: null }
    });
    if (overdueBlocked) return res.json({ success: true, data: reasonResponse('overdue_blocked') });

    const score = Number(user?.creditScore?.score || 0);
    const { tier, rates } = getTierAndRateCard(score);
    if (!rates?.eligible) return res.json({ success: true, data: reasonResponse('poor_credit_tier') });
    const aprCap = tierRatesWithinAprCap(rates);
    if (!aprCap.ok) return res.json({ success: true, data: reasonResponse('apr_cap_exceeded') });
    if (purchaseAmount && (purchaseAmount < creditConfig.BNPL.MIN_CART_VALUE || purchaseAmount > creditConfig.BNPL.MAX_CART_VALUE)) {
      return res.json({ success: true, data: reasonResponse('cart_out_of_range') });
    }
    const hasIneligibleCategory = categories.some((c) => creditConfig.BNPL.INELIGIBLE_CATEGORIES.includes(c));
    if (hasIneligibleCategory) return res.json({ success: true, data: reasonResponse('ineligible_category') });

    return res.json({
      success: true,
      data: {
        eligible: true,
        reason: null,
        tier,
        rates,
        minCartValue: creditConfig.BNPL.MIN_CART_VALUE,
        maxCartValue: creditConfig.BNPL.MAX_CART_VALUE,
        tenureOptionsDays: creditConfig.BNPL.TENURE_OPTIONS_DAYS,
        maxAprPercent: creditConfig.BNPL.MAX_APR_PERCENT
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error checking BNPL eligibility', error: error.message });
  }
};

const initiate = async (req, res) => {
  try {
    const { items = [], shippingAddress, selectedTenureDays, consentEligibility, termsAccepted } = req.body;
    if (!consentEligibility || !termsAccepted) return res.status(400).json({ success: false, message: 'Consent and terms are required.' });
    if (!creditConfig.BNPL.TENURE_OPTIONS_DAYS.includes(Number(selectedTenureDays))) {
      return res.status(400).json({ success: false, message: 'Invalid tenure selected.' });
    }
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ success: false, message: 'Order items are required.' });

    const user = await User.findById(req.user.id).select('creditScore kycStatus');
    const { tier, rates } = getTierAndRateCard(Number(user?.creditScore?.score || 0));
    if (user?.kycStatus !== 'verified' || !rates?.eligible) {
      return res.status(400).json({ success: false, message: 'Customer is not eligible for BNPL.' });
    }

    const products = await Promise.all(items.map((it) => Product.findById(it.productId)));
    if (products.some((p) => !p)) return res.status(404).json({ success: false, message: 'One or more products were not found.' });
    const ineligible = products.find((p) => creditConfig.BNPL.INELIGIBLE_CATEGORIES.includes(p.category));
    if (ineligible) return res.status(400).json({ success: false, message: 'Cart contains ineligible BNPL category.' });

    const principal = products.reduce((sum, p, idx) => sum + ((p.price || 0) * Number(items[idx].quantity || 1)), 0);
    if (principal < creditConfig.BNPL.MIN_CART_VALUE || principal > creditConfig.BNPL.MAX_CART_VALUE) {
      return res.status(400).json({ success: false, message: 'Cart total is out of BNPL range.' });
    }

    const markupRate = Number(selectedTenureDays) === 7 ? rates.day7 : rates.day14;
    const aprCheck = validateBnplApr({ markupRate, tenureDays: Number(selectedTenureDays) });
    if (!aprCheck.ok) {
      return res.status(400).json({
        success: false,
        message: `BNPL markup exceeds the maximum APR cap (${(aprCheck.maxApr * 100).toFixed(0)}% simple effective).`
      });
    }
    const markupAmount = principal * markupRate;
    const totalPayable = principal + markupAmount;
    const dueDate = new Date(Date.now() + (Number(selectedTenureDays) * 24 * 60 * 60 * 1000));

    const creditLine = new CreditLine({
      user: req.user.id,
      userName: req.user.name,
      type: 'bnpl',
      productType: 'bnpl',
      creditLimit: totalPayable,
      availableCredit: 0,
      usedCredit: totalPayable,
      principalAmount: principal,
      markupRate,
      markupAmount,
      totalRepayable: totalPayable,
      tenureDays: Number(selectedTenureDays),
      tenureMonths: 1,
      installmentCount: 1,
      monthlyInstallment: totalPayable,
      status: 'active',
      approvedAt: new Date(),
      scoreAtApproval: Number(user?.creditScore?.score || 0)
    });
    creditLine.generateInstallments({ installmentCount: 1, intervalDays: Number(selectedTenureDays) });
    await creditLine.save();

    const order = await Order.create({
      merchant: req.user.id,
      merchantName: req.user.name,
      items: products.map((p, idx) => ({
        product: p._id,
        productName: p.name,
        supplier: p.supplier,
        supplierName: p.supplierName,
        quantity: Number(items[idx].quantity || 1),
        pricePerUnit: p.price,
        totalPrice: p.price * Number(items[idx].quantity || 1)
      })),
      subtotal: principal,
      totalAmount: principal,
      paymentMethod: 'bnpl',
      paymentStatus: 'pending',
      creditLine: creditLine._id,
      shippingAddress,
      bnplDetails: {
        provider: 'SuperBazaar NBFC',
        tier,
        tenureDays: Number(selectedTenureDays),
        principal,
        markupRate,
        markupAmount,
        totalPayable,
        outstandingPrincipal: principal,
        dueDate,
        lateFee: 0,
        paidPrincipal: 0
      }
    });

    creditLine.orders.push(order._id);
    await creditLine.save();
    await Transaction.create({
      user: req.user.id,
      type: 'loan_disbursement',
      category: 'loan',
      amount: principal,
      description: `SuperBazaar Pay Later initiated for order ${order.orderNumber}`,
      relatedOrder: order._id,
      relatedCreditLine: creditLine._id,
      paymentMethod: 'bnpl',
      status: 'completed'
    });

    return res.status(201).json({
      success: true,
      data: {
        order,
        bnpl: {
          tier,
          tenureDays: Number(selectedTenureDays),
          markupRate,
          markupAmount,
          totalPayable,
          dueDate
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error initiating BNPL order', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      paymentMethod: 'bnpl',
      $or: [{ customer: req.user.id }, { merchant: req.user.id }]
    })
      .sort({ createdAt: -1 })
      .lean();
    const data = orders.map((order) => ({
      ...order,
      computedStatus: computeBnplStatus(order)
    }));
    return res.json({ success: true, data: { orders: data } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching BNPL orders', error: error.message });
  }
};

const repay = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const payAmount = Number(amount || 0);
    if (payAmount <= 0) return res.status(400).json({ success: false, message: 'Valid repayment amount is required.' });

    const order = await Order.findOne({
      _id: req.params.orderId,
      paymentMethod: 'bnpl',
      $or: [{ customer: req.user.id }, { merchant: req.user.id }]
    });
    if (!order) return res.status(404).json({ success: false, message: 'BNPL order not found.' });
    if (!order.bnplDetails) return res.status(400).json({ success: false, message: 'BNPL details missing for order.' });

    const principalOutstanding = Number(order.bnplDetails.outstandingPrincipal || 0);
    const applied = Math.min(payAmount, principalOutstanding);
    order.bnplDetails.outstandingPrincipal = Math.max(0, principalOutstanding - applied);
    order.bnplDetails.paidPrincipal = Number(order.bnplDetails.paidPrincipal || 0) + applied;
    if (order.bnplDetails.outstandingPrincipal <= 0) {
      order.paymentStatus = 'paid';
    } else {
      order.paymentStatus = 'partially_paid';
    }
    await order.save();

    const creditLine = await CreditLine.findById(order.creditLine);
    if (creditLine) {
      creditLine.usedCredit = Math.max(0, Number(creditLine.usedCredit || 0) - applied);
      if (creditLine.usedCredit <= 0) creditLine.status = 'closed';
      await creditLine.save();
    }

    await Transaction.create({
      user: req.user.id,
      type: 'loan_repayment',
      category: 'repayment',
      amount: applied,
      description: `BNPL repayment for order ${order.orderNumber}`,
      relatedOrder: order._id,
      relatedCreditLine: order.creditLine,
      paymentMethod: paymentMethod || 'bank_transfer',
      status: 'completed'
    });

    return res.json({ success: true, data: { order } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error processing BNPL repayment', error: error.message });
  }
};

module.exports = {
  getEligibility,
  initiate,
  getOrders,
  repay
};
