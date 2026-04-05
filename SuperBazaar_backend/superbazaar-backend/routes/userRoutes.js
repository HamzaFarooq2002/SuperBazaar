const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const ALLOWED_PROFILE_FIELDS = ['userType', 'name', 'phone', 'businessName', 'businessAddress'];
const USER_TYPE_ENUM = ['merchant', 'supplier', 'customer'];

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updates = {};
    for (const field of ALLOWED_PROFILE_FIELDS) {
      if (req.body[field] !== undefined) {
        if (field === 'userType') {
          if (!USER_TYPE_ENUM.includes(req.body.userType)) {
            return res.status(400).json({
              success: false,
              message: `userType must be one of: ${USER_TYPE_ENUM.join(', ')}`
            });
          }
        }
        updates[field] = req.body[field];
      }
    }

    Object.assign(user, updates);
    await user.save();

    const userObj = user.toObject ? user.toObject() : user.toJSON();
    delete userObj.password;
    res.json({
      success: true,
      data: { user: userObj }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @desc    Enable/update open banking settings
// @route   PUT /api/users/open-banking
// @access  Private
router.put('/open-banking', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      shareBankData = true,
      shareTransactions = true,
      shareCreditScore = true,
      enabled = true
    } = req.body || {};

    user.openBanking = {
      ...(user.openBanking || {}),
      enabled: Boolean(enabled),
      connectedAt: enabled ? new Date() : user.openBanking?.connectedAt,
      lastSyncAt: enabled ? new Date() : user.openBanking?.lastSyncAt,
      consents: {
        shareBankData: Boolean(shareBankData),
        shareTransactions: Boolean(shareTransactions),
        shareCreditScore: Boolean(shareCreditScore)
      }
    };

    await user.save();

    res.json({
      success: true,
      message: enabled ? 'Open banking enabled successfully' : 'Open banking settings updated',
      data: { openBanking: user.openBanking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating open banking settings',
      error: error.message
    });
  }
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

// @desc    Get wallet balance and recent disbursements
// @route   GET /api/users/wallet
// @access  Private
router.get('/wallet', protect, async (req, res) => {
  const Transaction = require('../models/Transaction');

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const disbursements = await Transaction.find({
      user: req.user.id,
      type: 'loan_disbursement'
    }).sort({ transactionDate: -1 }).limit(10);

    res.json({
      success: true,
      data: {
        walletBalance: user.walletBalance || 0,
        recentDisbursements: disbursements
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wallet',
      error: error.message
    });
  }
});

// @desc    Get user rewards (synthetic from orders/transactions)
// @route   GET /api/users/rewards
// @access  Private
router.get('/rewards', protect, async (req, res) => {
  const Transaction = require('../models/Transaction');
  const Order = require('../models/Order');

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const orders = await Order.find({ merchant: req.user.id })
      .sort({ createdAt: -1 }).limit(50)
      .catch(() => []);

    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ transactionDate: -1 }).limit(50)
      .catch(() => []);

    const allOrders = orders;

    const completedOrders = allOrders.filter(o => o.status === 'delivered' || o.orderStatus === 'delivered');
    const totalSpent = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const loanDisbursements = transactions.filter(t => t.type === 'loan_disbursement');
    const pointsFromOrders = allOrders.length * 50;
    const pointsFromLoans = loanDisbursements.length * 100;
    const cashbackFromSpend = Math.round(totalSpent * 0.02);
    const bonusPoints = user.rewardPoints || 0;
    const totalPoints = pointsFromOrders + pointsFromLoans + bonusPoints;

    const tier = totalPoints >= 2000 ? 'Platinum' :
                 totalPoints >= 1000 ? 'Gold' :
                 totalPoints >= 500  ? 'Silver' : 'Bronze';

    const orderHistory = allOrders.slice(0, 3).map((o, i) => ({
      id: o._id || String(i),
      type: i % 2 === 0 ? 'Cashback' : 'Points',
      amount: i % 2 === 0 ? Math.round((o.totalAmount || 0) * 0.02) : 50,
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      description: `Order #${o.orderNumber || o._id?.toString().slice(-6) || 'N/A'}`
    }));
    const loanHistory = loanDisbursements.slice(0, 2).map((t, i) => ({
      id: t._id || `loan-${i}`,
      type: 'Bonus',
      amount: 100,
      date: t.transactionDate ? new Date(t.transactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      description: t.description || 'Nano loan bonus'
    }));
    const rewardHistory = [...orderHistory, ...loanHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalPoints,
        cashbackEarned: cashbackFromSpend,
        redeemedValue: 0,
        tier,
        totalOrders: allOrders.length,
        completedOrders: completedOrders.length,
        rewardHistory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rewards',
      error: error.message
    });
  }
});

module.exports = router;
