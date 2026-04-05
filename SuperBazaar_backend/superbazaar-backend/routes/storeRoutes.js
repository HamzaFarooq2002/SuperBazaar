const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const Store = require('../models/Store');

// @desc    Get user's store
// @route   GET /api/stores/my-store
// @access  Private (Merchants only)
router.get('/my-store', protect, restrictTo('merchant'), async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });
    
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }
    
    res.json({
      success: true,
      data: { store }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching store',
      error: error.message
    });
  }
});

// @desc    Update store
// @route   PUT /api/stores/my-store
// @access  Private (Merchants only)
router.put('/my-store', protect, restrictTo('merchant'), async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate(
      { owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: { store }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating store',
      error: error.message
    });
  }
});

module.exports = router;
