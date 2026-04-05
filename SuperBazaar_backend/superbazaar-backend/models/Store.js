const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  // Owner
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Store Info
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  description: String,
  logo: {
    type: String,
    default: 'https://via.placeholder.com/200?text=Store+Logo'
  },
  
  // Location
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Pakistan'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Contact
  phone: String,
  email: String,
  whatsapp: String,
  
  // Business Info
  businessType: {
    type: String,
    enum: ['grocery', 'general_store', 'pharmacy', 'electronics', 'clothing', 'other']
  },
  taxId: String,
  registrationNumber: String,
  
  // Operating Hours
  operatingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    openTime: String,
    closeTime: String,
    isClosed: {
      type: Boolean,
      default: false
    }
  }],
  
  // Inventory Stats
  totalProducts: {
    type: Number,
    default: 0
  },
  lowStockProducts: {
    type: Number,
    default: 0
  },
  
  // Financial Stats
  monthlyRevenue: {
    type: Number,
    default: 0
  },
  monthlyExpenses: {
    type: Number,
    default: 0
  },
  
  // Ratings
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  
  // Social Media
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
