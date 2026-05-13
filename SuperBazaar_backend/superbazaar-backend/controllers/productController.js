const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, supplier, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (supplier) {
      query.supplier = supplier;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .populate('supplier', 'name businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplier', 'name businessName phone email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Suppliers and Merchants)
const createProduct = async (req, res) => {
  try {
    if (req.user.userType !== 'supplier' && req.user.userType !== 'merchant') {
      return res.status(403).json({
        success: false,
        message: 'Only suppliers and merchants can create products'
      });
    }
    
    const body = { ...req.body };
    delete body.isSupplierVerified;
    delete body.supplierVerifiedAt;
    delete body.supplier;
    delete body.supplierName;

    const verifiedOwner = req.user.kycStatus === 'verified';
    const productData = {
      ...body,
      supplier: req.user.id,
      supplierName: req.user.businessName || req.user.name,
      ...(verifiedOwner
        ? { isSupplierVerified: true, supplierVerifiedAt: new Date() }
        : { isSupplierVerified: false })
    };

    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Product owner only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership
    if (product.supplier.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    const body = { ...req.body };
    delete body.isSupplierVerified;
    delete body.supplierVerifiedAt;
    delete body.supplier;
    delete body.supplierName;

    if (req.user.kycStatus === 'verified') {
      body.isSupplierVerified = true;
      body.supplierVerifiedAt = product.supplierVerifiedAt || new Date();
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Product owner only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership
    if (product.supplier.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }
    
    // Soft delete
    product.isActive = false;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
