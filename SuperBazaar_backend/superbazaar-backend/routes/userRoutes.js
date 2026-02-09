const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  res.json({ message: 'Update profile endpoint - to be implemented' });
});

// @desc    Get user transactions
// @route   GET /api/users/transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  const Transaction = require('../models/Transaction');
  
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ transactionDate: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: { transactions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

module.exports = router;
