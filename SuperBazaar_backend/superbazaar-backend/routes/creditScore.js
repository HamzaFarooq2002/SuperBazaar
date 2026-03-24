// routes/creditScore.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const CreditLine = require('../models/CreditLine');
const Store = require('../models/Store');
const { scoreUser, calculateCreditLimit } = require('../utils/creditScoring');

// @desc    Trigger ML credit scoring for the logged-in user
// @route   POST /api/credit/score
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch supporting data
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
          lastCalculated:     scoreData.lastCalculated
        },
        suggestedCreditLimit: suggestedLimit
      }
    });

  } catch (error) {
    console.error('Credit scoring error:', error.message);

    // If FastAPI is down, return a clear error instead of a 500
    if (error.message.includes('FastAPI scoring failed') || error.message.includes('fetch')) {
      return res.status(503).json({
        success: false,
        message: 'Credit scoring service is temporarily unavailable. Please try again shortly.',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error calculating credit score',
      error: error.message
    });
  }
});

module.exports = router;