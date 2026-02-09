const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getCreditLines,
  getCreditScore,
  applySNPL,
  applyBNPL,
  makePayment
} = require('../controllers/creditController');

// All credit routes require authentication
router.use(protect);

router.get('/', getCreditLines);
router.get('/score', getCreditScore);
router.post('/snpl/apply', restrictTo('merchant'), applySNPL);
router.post('/bnpl/apply', restrictTo('customer'), applyBNPL);
router.post('/:creditLineId/payment', makePayment);

module.exports = router;
