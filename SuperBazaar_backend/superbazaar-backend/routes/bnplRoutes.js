const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getEligibility,
  initiate,
  getOrders,
  repay
} = require('../controllers/bnplController');

const router = express.Router();

router.use(protect);
router.use(restrictTo('customer'));

router.get('/eligibility', getEligibility);
router.post('/initiate', initiate);
router.get('/orders', getOrders);
router.post('/repay/:orderId', repay);

module.exports = router;
