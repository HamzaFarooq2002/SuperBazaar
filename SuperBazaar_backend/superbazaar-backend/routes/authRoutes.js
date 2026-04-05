const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  signup,
  login,
  submitKYC,
  verifyKYC,
  getMe
} = require('../controllers/authController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/kyc', protect, submitKYC);
router.put('/kyc/verify/:userId', protect, verifyKYC); // In production, add admin middleware

module.exports = router;
