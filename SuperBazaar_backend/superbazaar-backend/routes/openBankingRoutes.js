const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { lookup, confirm } = require('../controllers/openBankingController');

router.post('/lookup', protect, lookup);
router.post('/confirm', protect, confirm);

module.exports = router;
