const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getCreditLines,
  getCreditScore,
  applySNPL,
  applyBNPL,
  applyNanoLoan,
  makePayment
} = require('../controllers/creditController');
const { scoreCreditML } = require('../controllers/creditScoreController');

// All credit routes require authentication
router.use(protect);

router.get('/',                                    getCreditLines);
router.get('/score',                               getCreditScore);
router.post('/score',                              scoreCreditML);
router.post('/snpl/apply', restrictTo('merchant'), applySNPL);
router.post('/bnpl/apply', restrictTo('customer'), applyBNPL);
router.post('/nano/apply', restrictTo('merchant'), applyNanoLoan);
router.post('/:creditLineId/payment',              makePayment);

module.exports = router;