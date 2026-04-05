const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (Suppliers and Merchants)
router.post('/', protect, restrictTo('supplier', 'merchant'), createProduct);
router.put('/:id', protect, restrictTo('supplier', 'merchant'), updateProduct);
router.delete('/:id', protect, restrictTo('supplier', 'merchant'), deleteProduct);

module.exports = router;
