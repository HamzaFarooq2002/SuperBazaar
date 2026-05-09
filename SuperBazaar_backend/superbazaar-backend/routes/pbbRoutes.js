const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { initiate, auth, confirm, getSession } = require('../controllers/pbbController');

router.use(protect);

router.post('/initiate', initiate);
router.post('/:sessionId/auth', auth);
router.post('/:sessionId/confirm', confirm);
router.get('/:sessionId', getSession);

module.exports = router;
