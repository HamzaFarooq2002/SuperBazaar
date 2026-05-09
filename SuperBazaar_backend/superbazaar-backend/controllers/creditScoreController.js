// controllers/creditScoreController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const CreditLine = require('../models/CreditLine');
const Store = require('../models/Store');
const { scoreUser, calculateCreditLimit, ScoringServiceUnavailableError } = require('../utils/creditScoring');

// @desc    Trigger ML credit scoring for the logged-in user
// @route   POST /api/credit/score
// @access  Private
const scoreCreditML = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch supporting data in parallel
    const [transactions, creditLines] = await Promise.all([
      Transaction.find({ user: req.user.id, status: 'completed' }),
      CreditLine.find({ user: req.user.id })
    ]);

    // Fetch store only for merchants/suppliers
    let store = null;
    if (user.userType === 'merchant' || user.userType === 'supplier') {
      store = await Store.findOne({ owner: req.user.id });
    }

    // Call FastAPI ML pipeline
    const scoreData = await scoreUser(user, transactions, creditLines, store);

    // Persist result to User document
    user.creditScore = {
      score:              scoreData.score,
      band:               scoreData.band,
      defaultProbability: scoreData.defaultProbability,
      lastCalculated:     scoreData.lastCalculated,
      factors:            scoreData.factors
    };
    await user.save();

    // Suggested credit limit based on ML score
    const monthlyIncome = scoreData.factors?.transactionVolume || 0;
    const suggestedLimit = calculateCreditLimit(scoreData.score, monthlyIncome);

    return res.status(200).json({
      success: true,
      data: {
        creditScore: {
          score:              scoreData.score,
          band:               scoreData.band,
          defaultProbability: scoreData.defaultProbability,
          lastCalculated:     scoreData.lastCalculated,
          factors:            scoreData.factors
        },
        suggestedCreditLimit: suggestedLimit
      }
    });

  } catch (error) {
    console.error('ML credit scoring error:', error.message);

    if (error instanceof ScoringServiceUnavailableError || error.message.includes('FastAPI') || error.message.includes('fetch')) {
      return res.status(503).json({
        success: false,
        code: 'SCORING_SERVICE_UNAVAILABLE',
        message: 'Credit scoring service temporarily unavailable. Ensure FastAPI is running on port 8000.',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error calculating credit score',
      error: error.message
    });
  }
};

module.exports = { scoreCreditML };