const mongoose = require('mongoose');
const CreditLine = require('../models/CreditLine');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const Store = require('../models/Store');
const creditConfig = require('../config/creditConfig');
const { scoreUser, calculateCreditLimit, assessRiskLevel, ScoringServiceUnavailableError } = require('../utils/creditScoring');

const MIN_BNPL_TXNS = Number(process.env.MIN_BNPL_TXNS || 3);
const MIN_NANO_TXNS = Number(process.env.MIN_NANO_TXNS || 3);

const toServiceCharge = (obj = {}) => {
  const mapped = { ...obj };
  if (Object.prototype.hasOwnProperty.call(mapped, 'markupRate')) {
    mapped.serviceChargeRate = mapped.markupRate;
    delete mapped.markupRate;
  }
  if (Object.prototype.hasOwnProperty.call(mapped, 'markupAmount')) {
    mapped.serviceChargeAmount = mapped.markupAmount;
    delete mapped.markupAmount;
  }
  return mapped;
};
// @desc    Get user's credit lines
// @route   GET /api/credit
// @access  Private
const getCreditLines = async (req, res) => {
  try {
    const creditLines = await CreditLine.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: { creditLines }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching credit lines',
      error: error.message
    });
  }
};

// @desc    Get credit score (reads persisted score from DB — use POST to re-score)
// @route   GET /api/credit/score
// @access  Private
const getCreditScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('creditScore userType walletBalance');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.creditScore || !user.creditScore.score) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No credit score yet. Please generate one first.'
      });
    }

    const monthlyIncome = user.creditScore.factors?.transactionVolume || 0;
    const suggestedLimit = calculateCreditLimit(user.creditScore.score, monthlyIncome);

    return res.status(200).json({
      success: true,
      data: {
        creditScore: {
          score:              user.creditScore.score,
          band:               user.creditScore.band,
          defaultProbability: user.creditScore.defaultProbability,
          lastCalculated:     user.creditScore.lastCalculated,
          factors:            user.creditScore.factors
        },
        suggestedCreditLimit: suggestedLimit
      }
    });
  } catch (error) {
    console.error('getCreditScore error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error fetching credit score',
      error: error.message
    });
  }
};

// @desc    Apply for BNPL (Buy Now Pay Later)
// @route   POST /api/credit/bnpl/apply
// @access  Private (Customers only)
const applyBNPL = async (req, res) => {
  try {
    if (req.user.userType !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'BNPL is only available for customers'
      });
    }

    const purchaseAmount = Number(req.body?.purchaseAmount ?? req.body?.amount);
    if (!purchaseAmount || purchaseAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid purchase amount'
      });
    }

    if (req.user.kycStatus === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'KYC is rejected. Please update your documents and try again.'
      });
    }

    if (req.user.kycStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'BNPL requires verified KYC.'
      });
    }

    const user = await User.findById(req.user.id);
    const [transactions, creditLines] = await Promise.all([
      Transaction.find({ user: req.user.id, status: 'completed' }),
      CreditLine.find({ user: req.user.id })
    ]);

    if (transactions.length < MIN_BNPL_TXNS) {
      return res.status(400).json({
        success: false,
        message: `BNPL requires at least ${MIN_BNPL_TXNS} completed transactions to establish history.`
      });
    }

    const scoreData = await scoreUser(user, transactions, creditLines, null);
    user.creditScore = {
      score: scoreData.score,
      band: scoreData.band,
      defaultProbability: scoreData.defaultProbability,
      lastCalculated: scoreData.lastCalculated,
      factors: scoreData.factors
    };
    await user.save();

    if (scoreData.score < creditConfig.BNPL.MIN_SCORE) {
      return res.status(400).json({
        success: false,
        message: `BNPL requires a minimum credit score of ${creditConfig.BNPL.MIN_SCORE}. Your score is ${scoreData.score}.`
      });
    }

    const maxLimitByRole = user.userType === 'merchant' ? 200000 : 50000;
    const suggestedLimit = calculateCreditLimit(scoreData.score, scoreData.factors?.transactionVolume || 0);
    const creditLimit = Math.min(maxLimitByRole, suggestedLimit);

    if (purchaseAmount > creditLimit) {
      return res.status(400).json({
        success: false,
        message: `Purchase amount exceeds BNPL limit of PKR ${creditLimit.toLocaleString()}`
      });
    }

    const bnpl = new CreditLine({
      user: req.user.id,
      userName: req.user.name,
      type: 'bnpl',
      creditLimit,
      availableCredit: creditLimit,
      usedCredit: 0,
      principalAmount: purchaseAmount,
      interestRate: parseFloat(process.env.BNPL_INTEREST_RATE) || 0,
      tenureMonths: parseInt(process.env.BNPL_TENURE_MONTHS) || 4,
      status: 'approved',
      approvedAt: Date.now(),
      riskLevel: assessRiskLevel(scoreData.band)
    });

    bnpl.generateInstallments();
    await bnpl.save();

    try {
      await Transaction.create({
        user: req.user.id,
        type: 'loan_disbursement',
        category: 'loan',
        amount: purchaseAmount,
        description: 'BNPL disbursement',
        relatedCreditLine: bnpl._id,
        paymentMethod: 'bnpl',
        status: 'completed'
      });
    } catch (txnErr) {
      console.error('BNPL disbursement transaction failed (non-blocking):', txnErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'BNPL approved successfully.',
      data: { creditLine: bnpl, disbursedAmount: purchaseAmount }
    });
  } catch (error) {
    console.error('Apply BNPL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing BNPL application',
      error: error.message
    });
  }
};

// @desc    Apply for Nano Loan (Merchants only)
// @route   POST /api/credit/nano/apply
// @access  Private (Merchants only)
const applyNanoLoan = async (req, res) => {
  try {
    if (req.user.userType !== 'merchant') {
      return res.status(403).json({
        success: false,
        message: 'Nano loans are only available for merchants'
      });
    }

    const requestedAmount = Number(req.body?.requestedAmount || 0);
    if (!requestedAmount || requestedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid nano loan amount'
      });
    }

    const { tenureMonths, consent_acknowledged, consent_payload } = req.body;
    if (!consent_acknowledged || !consent_payload) return res.status(400).json({ success: false, message: 'Nano loan consent acknowledgement is required' });

    const user = await User.findById(req.user.id);
    const hasPhoneAndCnic = Boolean(user?.phone && user?.kycData?.cnic);
    const derivedKycLevel =
      user?.kycStatus === 'verified'
        ? 2
        : hasPhoneAndCnic
        ? 1
        : 0;
    const effectiveKycLevel = Math.max(Number(user?.kycLevel || 0), derivedKycLevel);

    if ((user?.kycLevel || 0) !== effectiveKycLevel) {
      user.kycLevel = effectiveKycLevel;
      await user.save({ validateBeforeSave: false });
    }

    if (effectiveKycLevel < creditConfig.NANO.MIN_KYC_LEVEL) {
      return res.status(400).json({ success: false, message: 'Nano loans require higher KYC level' });
    }
    const [transactions, creditLines] = await Promise.all([
      Transaction.find({ user: req.user.id, status: 'completed' }),
      CreditLine.find({ user: req.user.id })
    ]);

    if (transactions.length < MIN_NANO_TXNS) {
      return res.status(400).json({
        success: false,
        message: `Build transaction history first. Minimum ${MIN_NANO_TXNS} completed transactions required for nano loans.`
      });
    }

    const completedOrders = await Order.countDocuments({
      merchant: req.user.id,
      status: 'delivered'
    });
    if (completedOrders < creditConfig.NANO.MIN_COMPLETED_ORDERS) {
      return res.status(400).json({
        success: false,
        code: 'MIN_COMPLETED_ORDERS',
        message: `Nano loans require at least ${creditConfig.NANO.MIN_COMPLETED_ORDERS} delivered stock orders. You currently have ${completedOrders}.`
      });
    }

    const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
    const minAccountAgeMs = creditConfig.NANO.MIN_ACCOUNT_AGE_DAYS * 24 * 60 * 60 * 1000;
    if (accountAgeMs < minAccountAgeMs) {
      return res.status(400).json({
        success: false,
        code: 'MIN_ACCOUNT_AGE',
        message: `Nano loans require an account at least ${creditConfig.NANO.MIN_ACCOUNT_AGE_DAYS} days old.`
      });
    }

    const store = await Store.findOne({ owner: req.user.id });
    let scoreData;
    try {
      scoreData = await scoreUser(user, transactions, creditLines, store);
    } catch (err) {
      if (err instanceof ScoringServiceUnavailableError) {
        return res.status(503).json({
          success: false,
          code: 'SCORING_SERVICE_UNAVAILABLE',
          message: 'Credit scoring service unavailable'
        });
      }
      throw err;
    }
    user.creditScore = {
      score: scoreData.score,
      band: scoreData.band,
      defaultProbability: scoreData.defaultProbability,
      lastCalculated: scoreData.lastCalculated,
      factors: scoreData.factors
    };
    await user.save();

    if (scoreData.score < creditConfig.NANO.MIN_SCORE) {
      return res.status(400).json({
        success: false,
        message: `Nano loans require a minimum score of ${creditConfig.NANO.MIN_SCORE}. Your score is ${scoreData.score}.`
      });
    }

    const activeNanoLoans = await CreditLine.countDocuments({
      user: req.user.id,
      productType: 'nano',
      status: { $in: ['approved', 'active', 'overdue'] }
    });
    if (activeNanoLoans >= creditConfig.NANO.MAX_ACTIVE_LOANS) {
      return res.status(400).json({
        success: false,
        code: 'MAX_ACTIVE_NANO_LOANS',
        message: `You already have the maximum of ${creditConfig.NANO.MAX_ACTIVE_LOANS} active nano loan(s).`
      });
    }

    const eligibleTier = [...creditConfig.NANO.TIERS]
      .reverse()
      .find((tier) => scoreData.score >= tier.minScore);

    if (!eligibleTier) {
      return res.status(400).json({
        success: false,
        message: 'No nano-loan tier is available for your current score.'
      });
    }

    if (requestedAmount > eligibleTier.maxAmount) {
      return res.status(400).json({
        success: false,
        message: `Your current nano-loan tier allows up to PKR ${eligibleTier.maxAmount.toLocaleString()}.`
      });
    }

    const selectedTenure = creditConfig.NANO.TENURE_OPTIONS.find((t) => t.months === Number(tenureMonths)) || creditConfig.NANO.TENURE_OPTIONS[0];

    const session = await mongoose.startSession();
    let nanoLoan;
    await session.withTransaction(async () => {
      nanoLoan = await CreditLine.create([{
        user: req.user.id,
        userName: req.user.name,
        type: 'nano',
        productType: 'nano',
        disbursementType: 'wallet_credit',
        creditLimit: eligibleTier.maxAmount,
        availableCredit: eligibleTier.maxAmount,
        usedCredit: 0,
        principalAmount: requestedAmount,
        markupRate: eligibleTier.markupRate,
        tenureMonths: selectedTenure.months,
        installmentCount: selectedTenure.months,
        status: 'approved',
        approvedAt: Date.now(),
        creditScoreAtApplication: scoreData.score,
        scoreAtApproval: scoreData.score,
        kycLevelAtApproval: user.kycLevel || 0,
        riskLevel: assessRiskLevel(scoreData.band),
        consentAcknowledged: true,
        consentTimestamp: new Date(),
        loanAgreementSnapshot: consent_payload
      }], { session });
      nanoLoan = nanoLoan[0];
      nanoLoan.generateInstallments({ installmentCount: selectedTenure.months, intervalDays: 30 });
      await nanoLoan.save({ session });
      await User.findByIdAndUpdate(req.user.id, { $inc: { walletBalance: requestedAmount } }, { session });
      await Transaction.create([{
        user: req.user.id,
        type: 'loan_disbursement',
        category: 'loan',
        amount: requestedAmount,
        description: `Nano loan disbursement (${eligibleTier.tier})`,
        relatedCreditLine: nanoLoan._id,
        paymentMethod: 'wallet',
        status: 'completed'
      }], { session });
    });
    session.endSession();

    return res.status(201).json({
      success: true,
      message: 'Nano loan approved successfully.',
      data: {
        creditLine: nanoLoan,
        tier: toServiceCharge(eligibleTier),
        consent: toServiceCharge(consent_payload),
        disbursedAmount: requestedAmount
      }
    });
  } catch (error) {
    console.error('Apply Nano Loan error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing nano loan',
      error: error.message
    });
  }
};

// @desc    Make payment on credit line
// @route   POST /api/credit/:creditLineId/payment
// @access  Private
const makePayment = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    const session = await mongoose.startSession();
    const creditLine = await CreditLine.findById(req.params.creditLineId).session(session);
    
    if (!creditLine) {
      return res.status(404).json({
        success: false,
        message: 'Credit line not found'
      });
    }
    
    // Verify ownership
    if (creditLine.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Add to repayment history
    creditLine.repayments.push({
      amount,
      date: Date.now(),
      method: paymentMethod || 'bank_transfer',
      transactionId: `PAY-${Date.now()}`
    });
    
    // Update installments
    let remainingAmount = amount;
    for (let installment of creditLine.installments) {
      if (installment.status === 'pending' && remainingAmount > 0) {
        if (remainingAmount >= installment.amount) {
          installment.status = 'paid';
          installment.paidDate = Date.now();
          installment.paidAmount = installment.amount;
          remainingAmount -= installment.amount;
        } else {
          installment.paidAmount = (installment.paidAmount || 0) + remainingAmount;
          remainingAmount = 0;
        }
      }
    }
    
    // Update used credit
    creditLine.usedCredit = Math.max(0, creditLine.usedCredit - amount);
    
    // Update next payment info
    const nextPending = creditLine.installments.find(inst => inst.status === 'pending');
    if (nextPending) {
      creditLine.nextPaymentDate = nextPending.dueDate;
      creditLine.nextPaymentAmount = nextPending.amount;
    } else {
      // All installments paid
      creditLine.status = 'closed';
      creditLine.closedAt = Date.now();
      creditLine.closureReason = 'Fully repaid';
    }
    
    await session.withTransaction(async () => {
      if ((paymentMethod || 'bank_transfer') === 'wallet') {
        const currentUser = await User.findById(req.user.id).session(session);
        if (!currentUser || (currentUser.walletBalance || 0) < amount) {
          throw new Error('INSUFFICIENT_WALLET_BALANCE');
        }
        currentUser.walletBalance -= amount;
        await currentUser.save({ session });
      }

      await creditLine.save({ session });
      await Transaction.create([{
        user: req.user.id,
        type: 'loan_repayment',
        category: 'repayment',
        amount: amount,
        description: `${creditLine.type.toUpperCase()} repayment`,
        relatedCreditLine: creditLine._id,
        paymentMethod: paymentMethod || 'bank_transfer',
        status: 'completed'
      }], { session });
    });
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: { creditLine }
    });
  } catch (error) {
    console.error('Make payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

const getNanoTiers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('creditScore kycLevel createdAt');
    const score = user?.creditScore?.score || 0;
    const eligibleTier = [...creditConfig.NANO.TIERS].reverse().find((tier) => score >= tier.minScore)?.tier || null;
    return res.status(200).json({
      success: true,
      data: {
        currentScore: score,
        kycLevel: user?.kycLevel || 0,
        eligibleTier,
        tiers: creditConfig.NANO.TIERS.map((tier) => toServiceCharge(tier)),
        tenureOptions: creditConfig.NANO.TENURE_OPTIONS.map(({ months }) => ({ months })),
        disbursementWindowSeconds: 60,
        payoutTarget: 'wallet',
        requirements: {
          minScore: creditConfig.NANO.MIN_SCORE,
          minKycLevel: creditConfig.NANO.MIN_KYC_LEVEL,
          minCompletedTransactions: MIN_NANO_TXNS,
          minCompletedOrders: creditConfig.NANO.MIN_COMPLETED_ORDERS,
          minAccountAgeDays: creditConfig.NANO.MIN_ACCOUNT_AGE_DAYS,
          maxActiveLoans: creditConfig.NANO.MAX_ACTIVE_LOANS
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching nano tiers', error: error.message });
  }
};

module.exports = {
  getCreditLines,
  getCreditScore,
  getNanoTiers,
  applyBNPL,
  applyNanoLoan,
  makePayment
};

