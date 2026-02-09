const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Number
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Parties Involved
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  merchantName: String,
  
  // Order Items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: String,
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    supplierName: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerUnit: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'snpl', 'bnpl'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'failed'],
    default: 'pending'
  },
  
  // SNPL/BNPL Reference (if applicable)
  creditLine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditLine'
  },
  
  // Delivery
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Pakistan'
    }
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Tracking
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  
  // Notes
  customerNotes: String,
  internalNotes: String,
  
  // Fulfillment
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fulfilledAt: Date
}, {
  timestamps: true
});

// Generate order number before validation (must run before validate, not save,
// because orderNumber is required and validation runs before save hooks)
orderSchema.pre('validate', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Calculate totals
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.totalAmount = this.subtotal + this.tax + this.shippingCost;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
