const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Groceries', 'Beverages', 'Snacks', 'Personal Care', 'Household', 'Other']
  },
  
  // Supplier Info
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplierName: {
    type: String,
    required: true
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  unit: {
    type: String,
    default: 'per unit'
  },
  
  // Inventory
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  
  // Images
  images: [{
    url: String,
    alt: String
  }],
  mainImage: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=No+Image'
  },
  
  // Ratings
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Product Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  tags: [String],
  sku: String,
  barcode: String
}, {
  timestamps: true
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ supplier: 1 });

module.exports = mongoose.model('Product', productSchema);
