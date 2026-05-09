const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getEligibility,
  applyForFinancing,
  acceptOffer,
  declineOffer,
  listApplications,
  getApplication
} = require('../controllers/bankFinancingController');

router.use(protect, restrictTo('merchant'));

router.get('/eligibility', getEligibility);
router.post('/apply', applyForFinancing);
router.post('/:id/accept', acceptOffer);
router.post('/:id/decline', declineOffer);
router.get('/', listApplications);
router.get('/:id', getApplication);

module.exports = router;
