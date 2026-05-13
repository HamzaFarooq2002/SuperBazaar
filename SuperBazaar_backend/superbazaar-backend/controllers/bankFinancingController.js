const mongoose = require('mongoose');
const { createHash, randomUUID } = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Store = require('../models/Store');
const Transaction = require('../models/Transaction');
const BankFinancingApplication = require('../models/BankFinancingApplication');
const bankFinancingConfig = require('../config/bankFinancingConfig');
const { DELIVERY_FEE, TAX_RATE } = require('../config/pricing');
const { toRiskTier, approveApplication, generateRepaymentSchedule, disburseFunds } = require('../services/mockBankService');

const MONEY_TOLERANCE = 0.01;

const ACTIVE_APPLICATION_STATUSES = ['OFFER_PENDING', 'OFFER_ACCEPTED', 'DISBURSED', 'REPAYING'];

const maxConcurrentActiveApplications = () =>
  Math.max(1, Number(bankFinancingConfig.MAX_CONCURRENT_ACTIVE_APPLICATIONS || 2));

const clientIp = (req) => {
  const xf = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return xf || req.ip || '';
};

const clientUserAgent = (req) => String(req.get('user-agent') || '').slice(0, 2048);

const reasonMessages = {
  merchant_only: 'Only merchant accounts can apply for Stock Now Pay Later via Bank.',
  kyc_not_verified: 'Your KYC must be verified before applying.',
  credit_score_required: 'Generate your credit score before applying.',
  invalid_credit_score: 'Your credit score is invalid. Please refresh your credit score.',
  score_below_threshold: `Your credit score must be at least ${bankFinancingConfig.MIN_SCORE_TO_APPLY} to apply.`,
  invalid_order_amount: `Financing amount must be between PKR ${bankFinancingConfig.MIN_ORDER_AMOUNT.toLocaleString()} and PKR ${bankFinancingConfig.MAX_ORDER_AMOUNT.toLocaleString()}.`,
  products_required: 'Add verified supplier products to your cart before applying.',
  invalid_product_id: 'One or more cart products are invalid.',
  product_not_found: 'One or more cart products could not be found.',
  supplier_not_verified: 'One or more cart items are from unverified suppliers.',
  overdue_financing_exists: 'You have overdue bank financing. Clear overdue repayments before applying.',
  active_financing_exists:
    'You already have the maximum of two active Stock Now Pay Later via Bank applications (pending offer, accepted, disbursed, or repaying). Close or complete one before adding another.',
  duplicate_pending_application: 'You already have a pending bank offer for this cart.'
};

const buildAppId = () => `BFA-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
const round = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
const formatReasons = (codes) => codes.map((code) => ({ code, message: reasonMessages[code] || code }));

const normalizeProductIds = (productIds = []) => {
  const rawIds = Array.isArray(productIds)
    ? productIds
    : String(productIds || '').split(',');
  return [...new Set(rawIds.map((id) => String(id || '').trim()).filter(Boolean))];
};

const normalizeItems = (items = []) => items.map((item) => ({
  productId: String(item.productId || item.product || '').trim(),
  quantity: Number(item.quantity || 0)
}));

const parseRequestedAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? round(amount) : NaN;
};

const buildCartHash = ({ merchantId, productIds, requestedAmount }) => createHash('sha256')
  .update(JSON.stringify({
    merchantId: String(merchantId),
    productIds: normalizeProductIds(productIds).sort(),
    requestedAmount: round(requestedAmount)
  }))
  .digest('hex');

const expirePendingOffers = async (merchantId) => {
  await BankFinancingApplication.updateMany(
    {
      merchant: merchantId,
      applicationStatus: 'OFFER_PENDING',
      offerExpiry: { $lt: new Date() }
    },
    { $set: { applicationStatus: 'OFFER_EXPIRED' } }
  );
};

const fetchProductsForIds = async (productIds, session) => {
  const ids = normalizeProductIds(productIds);
  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    return { ids, products: [], invalidIds, missingIds: [] };
  }

  const query = Product.find({ _id: { $in: ids } }).select(
    'name supplier supplierName price stockQuantity isSupplierVerified'
  );
  if (session) query.session(session);
  const products = await query;
  const foundIds = new Set(products.map((product) => String(product._id)));
  const missingIds = ids.filter((id) => !foundIds.has(String(id)));
  return { ids, products, invalidIds, missingIds };
};

const getUnverifiedSuppliers = async (products, session) => {
  const nameBySupplierId = {};
  for (const p of products) {
    const sid = String(p.supplier);
    if (!nameBySupplierId[sid]) nameBySupplierId[sid] = p.supplierName || 'Unknown supplier';
  }

  const needsCheck = products.filter((p) => !p.isSupplierVerified);
  const supplierIds = [...new Set(needsCheck.map((product) => String(product.supplier)).filter(Boolean))];
  if (supplierIds.length === 0) return { ids: [], names: [] };

  const query = Store.find({ owner: { $in: supplierIds }, isVerified: true }).select('owner');
  if (session) query.session(session);
  const verifiedStores = await query;
  const verifiedOwners = new Set(verifiedStores.map((store) => String(store.owner)));

  const unverifiedByStore = supplierIds.filter((sid) => !verifiedOwners.has(String(sid)));
  if (unverifiedByStore.length === 0) return { ids: [], names: [] };

  const userQuery = User.find({
    _id: { $in: unverifiedByStore },
    userType: { $in: ['supplier', 'merchant'] },
    kycStatus: 'verified'
  }).select('_id');
  if (session) userQuery.session(session);
  const kycVerifiedOwners = await userQuery;
  const kycVerifiedOwnerIds = new Set(kycVerifiedOwners.map((u) => String(u._id)));

  const unverifiedIds = unverifiedByStore.filter((sid) => !kycVerifiedOwnerIds.has(String(sid)));
  const names = [...new Set(unverifiedIds.map((id) => nameBySupplierId[id] || 'Unknown supplier'))];

  return { ids: unverifiedIds, names };
};

const evaluateEligibility = async ({ user, requestedAmount, productIds = [], requireProducts = true }) => {
  const reasonCodes = [];
  const amount = parseRequestedAmount(requestedAmount);

  if (user.userType !== 'merchant') reasonCodes.push('merchant_only');
  if (user.kycStatus !== 'verified') reasonCodes.push('kyc_not_verified');

  const rawScore = user?.creditScore?.score;
  const scoreNumber = Number(rawScore);
  const hasScore = rawScore !== undefined && rawScore !== null && Number.isFinite(scoreNumber);
  const score = hasScore ? Math.max(0, Math.min(850, scoreNumber)) : 0;
  if (!hasScore) {
    reasonCodes.push('credit_score_required');
  } else if (scoreNumber < 0 || scoreNumber > 850) {
    reasonCodes.push('invalid_credit_score');
  } else if (score < bankFinancingConfig.MIN_SCORE_TO_APPLY) {
    reasonCodes.push('score_below_threshold');
  }

  if (!Number.isFinite(amount) || amount < bankFinancingConfig.MIN_ORDER_AMOUNT || amount > bankFinancingConfig.MAX_ORDER_AMOUNT) {
    reasonCodes.push('invalid_order_amount');
  }

  await expirePendingOffers(user._id);
  const overdueApplication = await BankFinancingApplication.findOne({
    merchant: user._id,
    applicationStatus: { $in: ['DISBURSED', 'REPAYING'] },
    repaymentStatus: 'OVERDUE'
  }).select('_id');
  if (overdueApplication) reasonCodes.push('overdue_financing_exists');

  const maxActive = maxConcurrentActiveApplications();
  const activeCount = await BankFinancingApplication.countDocuments({
    merchant: user._id,
    applicationStatus: { $in: ACTIVE_APPLICATION_STATUSES }
  });
  const activeApplication =
    activeCount > 0
      ? await BankFinancingApplication.findOne({
          merchant: user._id,
          applicationStatus: { $in: ACTIVE_APPLICATION_STATUSES }
        })
          .select('_id applicationId applicationStatus repaymentStatus selectedBank approvedAmount totalRepayable offerExpiry')
          .sort({ createdAt: -1 })
      : null;
  if (activeCount >= maxActive) reasonCodes.push('active_financing_exists');

  const normalizedProductIds = normalizeProductIds(productIds);
  let unverifiedSupplierIds = [];
  let unverifiedSupplierNames = [];
  let missingProductIds = [];
  let invalidProductIds = [];

  if (requireProducts && normalizedProductIds.length === 0) {
    reasonCodes.push('products_required');
  }

  if (normalizedProductIds.length > 0) {
    const result = await fetchProductsForIds(normalizedProductIds);
    invalidProductIds = result.invalidIds;
    missingProductIds = result.missingIds;
    if (invalidProductIds.length > 0) reasonCodes.push('invalid_product_id');
    if (missingProductIds.length > 0) reasonCodes.push('product_not_found');
    if (invalidProductIds.length === 0 && missingProductIds.length === 0) {
      const uv = await getUnverifiedSuppliers(result.products);
      unverifiedSupplierIds = uv.ids;
      unverifiedSupplierNames = uv.names;
      if (uv.ids.length > 0) reasonCodes.push('supplier_not_verified');
    }
  }

  const tier = toRiskTier(score);

  return {
    eligible: reasonCodes.length === 0,
    reasonCodes,
    reasons: formatReasons(reasonCodes),
    score,
    tier,
    requestedAmount: amount,
    unverifiedSupplierIds,
    unverifiedSupplierNames,
    missingProductIds,
    invalidProductIds,
    activeApplication: activeApplication
      ? {
          id: String(activeApplication._id),
          applicationId: activeApplication.applicationId,
          applicationStatus: activeApplication.applicationStatus,
          repaymentStatus: activeApplication.repaymentStatus,
          selectedBank: activeApplication.selectedBank,
          approvedAmount: activeApplication.approvedAmount,
          totalRepayable: activeApplication.totalRepayable,
          offerExpiry: activeApplication.offerExpiry
        }
      : null
  };
};

const getEligibility = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const requestedAmount = parseRequestedAmount(req.query.requestedAmount);
    const productIds = normalizeProductIds(req.query.productIds);

    const eligibility = await evaluateEligibility({ user, requestedAmount, productIds });
    return res.status(200).json({
      success: true,
      data: {
        ...eligibility,
        banks: bankFinancingConfig.BANKS,
        kibor3mPercent: bankFinancingConfig.KIBOR_3M_PERCENT,
        tierPricing: bankFinancingConfig.TIER_PRICING,
        minOrderAmount: bankFinancingConfig.MIN_ORDER_AMOUNT,
        maxOrderAmount: bankFinancingConfig.MAX_ORDER_AMOUNT,
        flatMarkupDisclosure: bankFinancingConfig.FLAT_MARKUP_DISCLOSURE_TEXT,
        snplRepaymentGraceDays: bankFinancingConfig.SNPL_REPAYMENT_GRACE_DAYS,
        maxConcurrentActiveApplications: maxConcurrentActiveApplications()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error checking eligibility', error: error.message });
  }
};

const applyForFinancing = async (req, res) => {
  try {
    const { selectedBank, requestedAmount, productIds = [], consentGiven } = req.body;
    if (!selectedBank || !bankFinancingConfig.BANKS.includes(selectedBank)) {
      return res.status(400).json({ success: false, message: 'Please select a valid bank' });
    }
    if (!consentGiven) {
      return res.status(400).json({ success: false, message: 'Data-sharing consent is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const amount = parseRequestedAmount(requestedAmount);
    const normalizedProductIds = normalizeProductIds(productIds);

    await expirePendingOffers(user._id);
    const cartHash = buildCartHash({
      merchantId: user._id,
      productIds: normalizedProductIds,
      requestedAmount: amount
    });
    const existingPending = await BankFinancingApplication.findOne({
      merchant: user._id,
      cartHash,
      applicationStatus: 'OFFER_PENDING',
      offerExpiry: { $gt: new Date() }
    });
    if (existingPending) {
      return res.status(200).json({
        success: true,
        message: reasonMessages.duplicate_pending_application,
        data: { application: existingPending, reusedPendingApplication: true }
      });
    }

    const eligibility = await evaluateEligibility({
      user,
      requestedAmount: amount,
      productIds: normalizedProductIds
    });

    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: 'Not eligible to apply',
        data: eligibility
      });
    }

    const mockDecision = approveApplication({
      merchantRiskTier: eligibility.tier,
      requestedAmount: amount,
      selectedBank
    });

    const application = new BankFinancingApplication({
      applicationId: buildAppId(),
      merchant: user._id,
      merchantNameSnapshot: user.businessName || user.name,
      selectedBank,
      requestedAmount: amount,
      approvedAmount: Number(mockDecision.approvedAmount || 0),
      merchantRiskTier: eligibility.tier,
      applicationStatus: mockDecision.approved ? 'OFFER_PENDING' : 'REJECTED',
      bankApplicationId: mockDecision.bankApplicationId,
      consentGiven: true,
      consentTimestamp: new Date(),
      consentIp: clientIp(req),
      consentUserAgent: clientUserAgent(req),
      consentTextVersion: bankFinancingConfig.CONSENT_TEXT_VERSION,
      consentTextSnapshot: bankFinancingConfig.DATA_SHARING_CONSENT_TEXT,
      offerTextVersion: bankFinancingConfig.OFFER_TEXT_VERSION,
      offerTextSnapshot: bankFinancingConfig.OFFER_ACCEPTANCE_TEXT,
      kibor3mPercent: Number(mockDecision.kibor3mPercent || 0),
      spreadPercent: Number(mockDecision.spreadPercent || 0),
      annualMarkupRate: Number(mockDecision.annualMarkupRatePercent || 0),
      processingFeeRate: Number(mockDecision.processingFeeRate || bankFinancingConfig.PROCESSING_FEE_RATE),
      tenureOptionsDays: mockDecision.tenureOptionsDays || [],
      processingFee: Number(mockDecision.processingFee || 0),
      offerExpiry: mockDecision.offerExpiry,
      latePaymentPolicy: mockDecision.latePaymentPolicy || bankFinancingConfig.LATE_PAYMENT_POLICY_TEXT,
      rejectionReason: mockDecision.reason || null,
      creditScoreSnapshot: eligibility.score,
      cartHash,
      eligibilitySnapshot: eligibility
    });

    try {
      await application.save();
    } catch (saveError) {
      if (saveError && saveError.code === 11000) {
        const conflict = await BankFinancingApplication.findOne({
          merchant: user._id,
          applicationStatus: { $in: ACTIVE_APPLICATION_STATUSES }
        }).select('_id applicationId applicationStatus');
        return res.status(409).json({
          success: false,
          message: reasonMessages.active_financing_exists,
          data: {
            reasonCodes: ['active_financing_exists'],
            reasons: formatReasons(['active_financing_exists']),
            activeApplication: conflict
              ? {
                  id: String(conflict._id),
                  applicationId: conflict.applicationId,
                  applicationStatus: conflict.applicationStatus
                }
              : null
          }
        });
      }
      throw saveError;
    }

    return res.status(201).json({
      success: true,
      message: mockDecision.approved ? 'Eligible to apply' : 'Not eligible to apply',
      data: { application }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating financing application', error: error.message });
  }
};

const acceptOffer = async (req, res) => {
  try {
    const { selectedTenureDays, offerAccepted, items, shippingAddress } = req.body;
    const application = await BankFinancingApplication.findOne({ _id: req.params.id, merchant: req.user.id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (!offerAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Offer acceptance consent is required'
      });
    }

    if (application.applicationStatus !== 'OFFER_PENDING') {
      return res.status(400).json({ success: false, message: 'Offer is not pending' });
    }

    const maxActive = maxConcurrentActiveApplications();
    const siblingActiveCount = await BankFinancingApplication.countDocuments({
      merchant: req.user.id,
      _id: { $ne: application._id },
      applicationStatus: { $in: ACTIVE_APPLICATION_STATUSES }
    });
    if (siblingActiveCount >= maxActive) {
      const sample = await BankFinancingApplication.findOne({
        merchant: req.user.id,
        _id: { $ne: application._id },
        applicationStatus: { $in: ACTIVE_APPLICATION_STATUSES }
      })
        .select('_id applicationId applicationStatus')
        .sort({ createdAt: -1 });
      return res.status(409).json({
        success: false,
        message: reasonMessages.active_financing_exists,
        data: {
          reasonCodes: ['active_financing_exists'],
          reasons: formatReasons(['active_financing_exists']),
          activeApplication: sample
            ? {
                id: String(sample._id),
                applicationId: sample.applicationId,
                applicationStatus: sample.applicationStatus
              }
            : null
        }
      });
    }

    if (!application.tenureOptionsDays.includes(Number(selectedTenureDays))) {
      return res.status(400).json({ success: false, message: 'Invalid tenure selection' });
    }

    if (application.offerExpiry && new Date(application.offerExpiry) < new Date()) {
      application.applicationStatus = 'OFFER_EXPIRED';
      await application.save();
      return res.status(400).json({ success: false, message: 'Offer expired' });
    }

    const orderItemsInput = normalizeItems(items);
    if (orderItemsInput.length === 0 || orderItemsInput.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return res.status(400).json({ success: false, message: 'Please provide valid order items' });
    }

    const requiredAddressFields = ['recipientName', 'phone', 'street', 'city'];
    const missingAddressField = requiredAddressFields.find((field) => !String(shippingAddress?.[field] || '').trim());
    if (missingAddressField) {
      return res.status(400).json({ success: false, message: `Shipping address is missing ${missingAddressField}` });
    }

    const productIds = orderItemsInput.map((item) => item.productId);
    const productResult = await fetchProductsForIds(productIds);
    if (productResult.invalidIds.length > 0) {
      return res.status(400).json({ success: false, message: 'One or more product IDs are invalid', data: { invalidProductIds: productResult.invalidIds } });
    }
    if (productResult.missingIds.length > 0) {
      return res.status(404).json({ success: false, message: 'One or more products were not found', data: { missingProductIds: productResult.missingIds } });
    }

    const uv = await getUnverifiedSuppliers(productResult.products);
    if (uv.ids.length > 0) {
      return res.status(400).json({
        success: false,
        message: reasonMessages.supplier_not_verified,
        data: { unverifiedSupplierIds: uv.ids, unverifiedSupplierNames: uv.names }
      });
    }

    const productsById = new Map(productResult.products.map((product) => [String(product._id), product]));
    const orderItems = [];
    let subtotal = 0;
    for (const item of orderItemsInput) {
      const product = productsById.get(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      const itemTotal = round(Number(product.price) * Number(item.quantity));
      subtotal = round(subtotal + itemTotal);
      orderItems.push({
        product: product._id,
        productName: product.name,
        supplier: product.supplier,
        supplierName: product.supplierName,
        quantity: item.quantity,
        pricePerUnit: product.price,
        totalPrice: itemTotal
      });
    }

    const tax = round(subtotal * TAX_RATE);
    const shippingCost = DELIVERY_FEE;
    const totalAmount = round(subtotal + tax + shippingCost);
    if (Math.abs(totalAmount - Number(application.approvedAmount || 0)) > MONEY_TOLERANCE) {
      return res.status(400).json({
        success: false,
        message: 'Cart total no longer matches the approved bank financing amount',
        data: {
          approvedAmount: application.approvedAmount,
          cartTotal: totalAmount
        }
      });
    }

    const expectedCartHash = buildCartHash({
      merchantId: req.user.id,
      productIds,
      requestedAmount: totalAmount
    });
    if (application.cartHash && application.cartHash !== expectedCartHash) {
      return res.status(400).json({
        success: false,
        message: 'Cart contents changed after the bank offer was created. Please apply again.'
      });
    }

    const scheduleAnchor = new Date();
    const scheduleData = generateRepaymentSchedule({
      approvedAmount: application.approvedAmount,
      annualMarkupRatePercent: application.annualMarkupRate,
      tenureDays: Number(selectedTenureDays),
      processingFee: application.processingFee,
      baseDate: scheduleAnchor
    });

    const claimedApplication = await BankFinancingApplication.findOneAndUpdate(
      {
        _id: application._id,
        merchant: req.user.id,
        applicationStatus: 'OFFER_PENDING',
        offerExpiry: { $gt: new Date() }
      },
      {
        $set: {
          applicationStatus: 'OFFER_ACCEPTED',
          offerAcceptedAt: new Date(),
          selectedTenureDays: Number(selectedTenureDays),
          offerAcceptIp: clientIp(req),
          offerAcceptUserAgent: clientUserAgent(req)
        }
      },
      { new: true }
    );

    if (!claimedApplication) {
      return res.status(409).json({ success: false, message: 'Offer is no longer available' });
    }

    const order = new Order({
      merchant: req.user.id,
      merchantName: req.user.businessName || req.user.name,
      items: orderItems,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      paymentMethod: 'bank_financing',
      paymentStatus: 'paid',
      financingStatus: 'BANK_DISBURSED',
      shippingAddress,
      status: 'delivered',
      deliveredAt: new Date()
    });

    await order.save();

    for (const item of orderItems) {
      const stockUpdate = await Product.updateOne(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } }
      );
      if (stockUpdate.modifiedCount !== 1) {
        throw new Error(`Insufficient stock for ${item.productName}`);
      }
    }

    const revenueBySupplier = {};
    for (const item of orderItems) {
      const sid = item.supplier.toString();
      revenueBySupplier[sid] = (revenueBySupplier[sid] || 0) + item.totalPrice;
    }

    for (const [sellerId, sellerTotal] of Object.entries(revenueBySupplier)) {
      await Transaction.create({
        user: sellerId,
        type: 'income',
        category: 'sales_revenue',
        amount: Math.abs(sellerTotal),
        description: `Order #${order.orderNumber}`,
        relatedOrder: order._id,
        paymentMethod: 'bank_transfer',
        status: 'completed'
      });
    }

    await Transaction.create({
      user: req.user.id,
      type: 'expense',
      category: 'stock_purchase',
      amount: Math.abs(order.totalAmount),
      description: `Order #${order.orderNumber}`,
      relatedOrder: order._id,
      paymentMethod: 'bank_transfer',
      status: 'completed'
    });

    const disbursement = disburseFunds({ applicationId: application.bankApplicationId });

    claimedApplication.order = order._id;
    claimedApplication.applicationStatus = 'DISBURSED';
    claimedApplication.markupAmount = scheduleData.markupAmount;
    claimedApplication.totalRepayable = scheduleData.totalRepayable;
    claimedApplication.repaymentSchedule = scheduleData.schedule;
    claimedApplication.repaymentStatus = 'ACTIVE';
    claimedApplication.supplierSettlementStatus = 'SETTLED';
    claimedApplication.supplierSettledAt = new Date();
    claimedApplication.disbursedAt = disbursement.disbursedAt;
    await claimedApplication.save();

    order.financingApplication = claimedApplication._id;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Bank offer accepted and order finalized',
      data: { application: claimedApplication, order }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error accepting bank offer', error: error.message });
  }
};

const declineOffer = async (req, res) => {
  try {
    const application = await BankFinancingApplication.findOne({ _id: req.params.id, merchant: req.user.id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.applicationStatus !== 'OFFER_PENDING') {
      return res.status(400).json({ success: false, message: 'Only pending offers can be declined' });
    }

    application.applicationStatus = 'OFFER_DECLINED';
    await application.save();
    return res.status(200).json({ success: true, message: 'Offer declined', data: { application } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error declining offer', error: error.message });
  }
};

const listApplications = async (req, res) => {
  try {
    await expirePendingOffers(req.user.id);
    const applications = await BankFinancingApplication.find({ merchant: req.user.id })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: { applications } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching applications', error: error.message });
  }
};

const getApplication = async (req, res) => {
  try {
    await expirePendingOffers(req.user.id);
    const application = await BankFinancingApplication.findOne({ _id: req.params.id, merchant: req.user.id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    return res.status(200).json({ success: true, data: { application } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching application', error: error.message });
  }
};

async function persistLoanRepayment(userId, app, idx, payAmount, paymentMethod) {
  const schedule = app.repaymentSchedule;
  const inst = schedule[idx];
  const installmentDue = Number(inst.totalDue || 0);
  const isPartial = payAmount < installmentDue;
  inst.paidAmount = (inst.paidAmount || 0) + payAmount;
  inst.paidAt = new Date();
  inst.status = isPartial ? 'PARTIAL' : 'PAID';

  let newInstIndex = null;
  if (isPartial) {
    const remainder = installmentDue - payAmount;
    newInstIndex = schedule.length;
    schedule.push({
      dueDate: inst.dueDate,
      principalAmount: 0,
      markupAmount: 0,
      processingFeeAmount: 0,
      totalDue: remainder,
      paidAmount: 0,
      status: 'PENDING',
      installmentType: 'PARTIAL_REMAINDER',
      parentInstallmentIndex: idx
    });
  }

  const allPaid = schedule.every((i) => i.status === 'PAID');
  app.repaymentStatus = allPaid ? 'COMPLETED' : 'ACTIVE';
  if (allPaid) app.applicationStatus = 'CLOSED';

  await app.save();

  const txn = await Transaction.create({
    user: userId,
    type: 'loan_repayment',
    category: 'repayment',
    amount: payAmount,
    description: isPartial ? `Partial payment on installment ${idx + 1} of ${app.applicationId}` : `Full installment ${idx + 1} of ${app.applicationId}`,
    paymentMethod: paymentMethod || 'wallet',
    status: 'completed',
    notes: isPartial ? `Partial: PKR ${payAmount} of PKR ${installmentDue}` : undefined
  });

  const remaining = schedule
    .filter((i) => i.status !== 'PAID')
    .reduce((sum, i) => sum + (i.totalDue - (i.paidAmount || 0)), 0);

  const nextPending = schedule.find((i) => i.status === 'PENDING' || i.status === 'OVERDUE' || i.status === 'PARTIAL');

  return {
    applicationId: app.applicationId,
    installmentIndex: idx,
    isPartial,
    amountPaid: payAmount,
    remainderCreated: isPartial ? { installmentIndex: newInstIndex, amount: installmentDue - payAmount, dueDate: inst.dueDate, installmentType: 'PARTIAL_REMAINDER' } : null,
    remainingDue: remaining,
    nextDueDate: nextPending?.dueDate || null,
    applicationStatus: app.applicationStatus,
    transactionId: txn.transactionId
  };
}

/** Called from PBB confirm while mock session is still AUTHED (before SUCCESS). */
async function applyLoanRepaymentFromAuthedPbb(pbbTxn, userId) {
  if (!pbbTxn || String(pbbTxn.user) !== String(userId)) {
    const err = new Error('Invalid session.');
    err.httpStatus = 403;
    throw err;
  }
  if (pbbTxn.status !== 'AUTHED') {
    const err = new Error('Session not authorized.');
    err.httpStatus = 400;
    err.code = 'INVALID_STATE';
    throw err;
  }
  if (pbbTxn.intent !== 'bank_financing_repay') {
    const err = new Error('Invalid intent.');
    err.httpStatus = 400;
    throw err;
  }

  const meta = pbbTxn.meta || {};
  const applicationMongoId = meta.applicationId;
  const idx = Number(meta.installmentIndex);
  const payAmount = Number(pbbTxn.amount || 0);

  if (!applicationMongoId) {
    const err = new Error('Missing application reference.');
    err.httpStatus = 400;
    throw err;
  }
  if (Number.isNaN(idx) || idx < 0) {
    const err = new Error('Invalid installment index.');
    err.httpStatus = 400;
    throw err;
  }
  if (payAmount <= 0) {
    const err = new Error('Invalid amount.');
    err.httpStatus = 400;
    throw err;
  }

  const app = await BankFinancingApplication.findOne({ _id: applicationMongoId, merchant: userId });
  if (!app) {
    const err = new Error('Application not found.');
    err.httpStatus = 404;
    err.code = 'APPLICATION_NOT_FOUND';
    throw err;
  }

  const schedule = app.repaymentSchedule;
  if (!schedule || idx >= schedule.length) {
    const err = new Error('Invalid installment index.');
    err.httpStatus = 400;
    throw err;
  }

  const inst = schedule[idx];
  if (inst.status === 'PAID') {
    const err = new Error('This installment is already paid.');
    err.httpStatus = 409;
    err.code = 'ALREADY_PAID';
    throw err;
  }

  const installmentDue = Number(inst.totalDue || 0);
  const minPayment = Math.ceil(installmentDue * 0.10);

  if (payAmount < minPayment) {
    const err = new Error(`Minimum payment is PKR ${minPayment}.`);
    err.httpStatus = 400;
    err.code = 'BELOW_MIN_PAYMENT';
    err.minPayment = minPayment;
    throw err;
  }
  if (payAmount > installmentDue) {
    const err = new Error(`Cannot exceed installment amount PKR ${installmentDue}.`);
    err.httpStatus = 400;
    err.code = 'EXCEEDS_INSTALLMENT';
    throw err;
  }

  return persistLoanRepayment(userId, app, idx, payAmount, 'pbb');
}

// POST /api/bank-financing/:id/repay
const repayInstallment = async (req, res) => {
  try {
    const { installmentIndex, amount, paymentMethod, mockPaymentRef } = req.body;
    const payAmount = Number(amount || 0);
    const idx = Number(installmentIndex);

    if (Number.isNaN(idx) || idx < 0) return res.status(400).json({ success: false, message: 'Invalid installmentIndex.' });
    if (payAmount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount.' });

    const app = await BankFinancingApplication.findOne({ _id: req.params.id, merchant: req.user.id });
    if (!app) return res.status(404).json({ success: false, code: 'APPLICATION_NOT_FOUND', message: 'Application not found.' });

    const schedule = app.repaymentSchedule;
    if (!schedule || idx >= schedule.length) return res.status(400).json({ success: false, message: 'Invalid installment index.' });

    const inst = schedule[idx];
    if (inst.status === 'PAID') return res.status(409).json({ success: false, code: 'ALREADY_PAID', message: 'This installment is already paid.' });

    const installmentDue = Number(inst.totalDue || 0);
    const minPayment = Math.ceil(installmentDue * 0.10);

    if (payAmount < minPayment) return res.status(400).json({ success: false, code: 'BELOW_MIN_PAYMENT', message: `Minimum payment is PKR ${minPayment}.`, minPayment });
    if (payAmount > installmentDue) return res.status(400).json({ success: false, code: 'EXCEEDS_INSTALLMENT', message: `Cannot exceed installment amount PKR ${installmentDue}.` });

    if (paymentMethod === 'wallet') {
      const user = await User.findById(req.user.id);
      if ((user.walletBalance || 0) < payAmount) {
        return res.status(400).json({ success: false, code: 'INSUFFICIENT_WALLET_BALANCE', message: 'Insufficient wallet balance.' });
      }
      await User.findByIdAndUpdate(req.user.id, { $inc: { walletBalance: -payAmount } });
    } else if (paymentMethod === 'pbb') {
      if (!mockPaymentRef) return res.status(400).json({ success: false, code: 'PBB_REF_NOT_FOUND', message: 'mockPaymentRef required for PBB payments.' });
      const MockPaymentTransaction = require('../models/MockPaymentTransaction');
      const pbbTxn = await MockPaymentTransaction.findOne({ pbbId: mockPaymentRef, status: 'SUCCESS', user: req.user.id });
      if (!pbbTxn) return res.status(400).json({ success: false, code: 'PBB_REF_NOT_FOUND', message: 'PBB transaction not found or not successful.' });
    } else {
      return res.status(400).json({ success: false, message: 'paymentMethod must be wallet or pbb.' });
    }

    const data = await persistLoanRepayment(req.user.id, app, idx, payAmount, paymentMethod);

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error('repayInstallment error:', err);
    return res.status(500).json({ success: false, message: 'Repayment error', error: err.message });
  }
};

// GET /api/bank-financing/:id/schedule
const getSchedule = async (req, res) => {
  try {
    const app = await BankFinancingApplication.findOne({ _id: req.params.id, merchant: req.user.id }).select('applicationId repaymentSchedule repaymentStatus applicationStatus');
    if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
    return res.json({ success: true, data: { applicationId: app.applicationId, repaymentSchedule: app.repaymentSchedule, repaymentStatus: app.repaymentStatus, applicationStatus: app.applicationStatus } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching schedule', error: err.message });
  }
};

module.exports = {
  getEligibility,
  applyForFinancing,
  acceptOffer,
  declineOffer,
  listApplications,
  getApplication,
  repayInstallment,
  getSchedule,
  applyLoanRepaymentFromAuthedPbb
};
