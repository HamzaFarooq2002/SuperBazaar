const CreditLine = require('../models/CreditLine');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { scoreUser, calculateCreditLimit, assessRiskLevel } = require('../utils/creditScoring');

const MIN_SNPL_SCORE = Number(process.env.MIN_SNPL_SCORE || 680);
const MIN_BNPL_SCORE = Number(process.env.MIN_BNPL_SCORE || 620);
const MIN_BNPL_TXNS = Number(process.env.MIN_BNPL_TXNS || 3);
const MIN_NANO_SCORE = Number(process.env.MIN_NANO_SCORE || 640);
const MIN_NANO_TXNS = Number(process.env.MIN_NANO_TXNS || 3);
const SNPL_INTEREST_RATE = Number(process.env.SNPL_INTEREST_RATE || 0.05);
const SNPL_TENURE_MONTHS = Number(process.env.SNPL_TENURE_MONTHS || 4);

const NANO_TIERS = [
  { tier: 'tier_1', minScore: 640, maxAmount: 25000, tenureMonths: 2, interestRate: 0.032 },
  { tier: 'tier_2', minScore: 660, maxAmount: 40000, tenureMonths: 2, interestRate: 0.031 },
  { tier: 'tier_3', minScore: 680, maxAmount: 50000, tenureMonths: 3, interestRate: 0.03 },
  { tier: 'tier_4', minScore: 700, maxAmount: 65000, tenureMonths: 3, interestRate: 0.029 },
  { tier: 'tier_5', minScore: 725, maxAmount: 80000, tenureMonths: 4, interestRate: 0.028 },
  { tier: 'tier_6', minScore: 755, maxAmount: 100000, tenureMonths: 4, interestRate: 0.027 },
  { tier: 'tier_7', minScore: 790, maxAmount: 130000, tenureMonths: 5, interestRate: 0.026 },
  { tier: 'tier_8', minScore: 830, maxAmount: 160000, tenureMonths: 6, interestRate: 0.025 }
];
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

// @desc    Apply for SNPL (Stock Now Pay Later)
// @route   POST /api/credit/snpl/apply
// @access  Private (Merchants only)
const applySNPL = async (req, res) => {
  try {
    if (req.user.userType !== 'merchant') {
      return res.status(403).json({
        success: false,
        message: 'SNPL is only available for merchants'
      });
    }
    
    const { requestedAmount } = req.body;
    
    if (!requestedAmount || requestedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid loan amount'
      });
    }
    
    // Hard-stop rejected KYC profiles; partially completed KYC is handled by score threshold.
    if (req.user.kycStatus === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'KYC is rejected. Please update your documents and try again.'
      });
    }
    
  // Always re-score via ML pipeline on application
const transactions = await Transaction.find({
  user: req.user.id,
  status: 'completed'
});
const creditLines = await CreditLine.find({ user: req.user.id });
const Store = require('../models/Store');
const store = await Store.findOne({ owner: req.user.id });

const scoreData = await scoreUser(req.user, transactions, creditLines, store);
const creditScore = scoreData.score;

if (creditScore < MIN_SNPL_SCORE) {
  return res.status(400).json({
    success: false,
    message: `SNPL requires a minimum credit score of ${MIN_SNPL_SCORE}. Your score is ${creditScore}.`
  });
}

req.user.creditScore = {
  score:              scoreData.score,
  band:               scoreData.band,
  defaultProbability: scoreData.defaultProbability,
  lastCalculated:     scoreData.lastCalculated,
  factors:            scoreData.factors
};
await req.user.save();

// Calculate credit limit
const creditLimit = calculateCreditLimit(creditScore, scoreData.factors?.transactionVolume || 0);
    
    // Check if requested amount is within limit
    if (requestedAmount > creditLimit) {
      return res.status(400).json({
        success: false,
        message: `Requested amount exceeds your credit limit of PKR ${creditLimit.toLocaleString()}`
      });
    }
    
    const riskLevel = assessRiskLevel(scoreData.band);
    const requestedTenure = Number(req.body?.tenureMonths || SNPL_TENURE_MONTHS);
    const tenureMonths = Math.min(12, Math.max(2, requestedTenure || 4));
    
    // Create SNPL credit line
    const snpl = new CreditLine({
      user: req.user.id,
      userName: req.user.name,
      type: 'snpl',
      creditLimit: creditLimit,
      availableCredit: creditLimit,
      usedCredit: 0,
      principalAmount: requestedAmount,
      interestRate: SNPL_INTEREST_RATE,
      tenureMonths,
      status: 'approved', // Auto-approve for MVP
      approvedAt: Date.now(),
      creditScoreAtApplication: creditScore,
      riskLevel: riskLevel
    });
    
    // Generate installment schedule
    snpl.generateInstallments();
    
    await snpl.save();
    
    // Create loan disbursement transaction
    await Transaction.create({
      user: req.user.id,
      type: 'loan_disbursement',
      category: 'loan',
      amount: requestedAmount,
      description: 'SNPL loan disbursement',
      relatedCreditLine: snpl._id,
      paymentMethod: 'credit',
      status: 'completed'
    });
    
    res.status(201).json({
      success: true,
      message: 'SNPL application approved!',
      data: { creditLine: snpl }
    });
  } catch (error) {
    console.error('Apply SNPL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing SNPL application',
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

    if (scoreData.score < MIN_BNPL_SCORE) {
      return res.status(400).json({
        success: false,
        message: `BNPL requires a minimum credit score of ${MIN_BNPL_SCORE}. Your score is ${scoreData.score}.`
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

    if (req.user.kycStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Nano loans require verified KYC'
      });
    }

    const user = await User.findById(req.user.id);
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

    const Store = require('../models/Store');
    const store = await Store.findOne({ owner: req.user.id });
    const scoreData = await scoreUser(user, transactions, creditLines, store);
    user.creditScore = {
      score: scoreData.score,
      band: scoreData.band,
      defaultProbability: scoreData.defaultProbability,
      lastCalculated: scoreData.lastCalculated,
      factors: scoreData.factors
    };
    await user.save();

    if (scoreData.score < MIN_NANO_SCORE) {
      return res.status(400).json({
        success: false,
        message: `Nano loans require a minimum score of ${MIN_NANO_SCORE}. Your score is ${scoreData.score}.`
      });
    }

    const eligibleTier = [...NANO_TIERS]
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

    const nanoLoan = new CreditLine({
      user: req.user.id,
      userName: req.user.name,
      type: 'nano',
      creditLimit: eligibleTier.maxAmount,
      availableCredit: eligibleTier.maxAmount,
      usedCredit: 0,
      principalAmount: requestedAmount,
      interestRate: eligibleTier.interestRate,
      tenureMonths: eligibleTier.tenureMonths,
      status: 'approved',
      approvedAt: Date.now(),
      creditScoreAtApplication: scoreData.score,
      riskLevel: assessRiskLevel(scoreData.band)
    });

    nanoLoan.generateInstallments();
    await nanoLoan.save();

    await Transaction.create({
      user: req.user.id,
      type: 'loan_disbursement',
      category: 'loan',
      amount: requestedAmount,
      description: `Nano loan disbursement (${eligibleTier.tier})`,
      relatedCreditLine: nanoLoan._id,
      paymentMethod: 'credit',
      status: 'completed'
    });

    return res.status(201).json({
      success: true,
      message: 'Nano loan approved successfully.',
      data: {
        creditLine: nanoLoan,
        tier: eligibleTier,
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
    
    const creditLine = await CreditLine.findById(req.params.creditLineId);
    
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
    
    await creditLine.save();
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      type: 'loan_repayment',
      category: 'repayment',
      amount: amount,
      description: `${creditLine.type.toUpperCase()} repayment`,
      relatedCreditLine: creditLine._id,
      paymentMethod: paymentMethod || 'bank_transfer',
      status: 'completed'
    });
    
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

module.exports = {
  getCreditLines,
  getCreditScore,
  applySNPL,
  applyBNPL,
  applyNanoLoan,
  makePayment
};
