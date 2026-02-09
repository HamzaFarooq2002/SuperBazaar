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

// Protected routes (Suppliers only)
router.post('/', protect, restrictTo('supplier'), createProduct);
router.put('/:id', protect, restrictTo('supplier'), updateProduct);
router.delete('/:id', protect, restrictTo('supplier'), deleteProduct);

module.exports = router;
