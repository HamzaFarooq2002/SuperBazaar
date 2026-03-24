const CreditLine = require('../models/CreditLine');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { scoreUser, calculateCreditLimit, assessRiskLevel } = require('../utils/creditScoring');
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
    
    // Check KYC status
    if (req.user.kycStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Please complete KYC verification first'
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
    
    // Create SNPL credit line
    const snpl = new CreditLine({
      user: req.user.id,
      userName: req.user.name,
      type: 'snpl',
      creditLimit: creditLimit,
      availableCredit: creditLimit,
      usedCredit: 0,
      principalAmount: requestedAmount,
      interestRate: parseFloat(process.env.SNPL_INTEREST_RATE) || 0.05,
      tenureMonths: parseInt(process.env.SNPL_TENURE_MONTHS) || 1,
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
  makePayment
};
