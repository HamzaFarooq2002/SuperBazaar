const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getSupplierOrders
} = require('../controllers/orderController');

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/supplier', getSupplierOrders);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
