const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Number
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },

  // Parties Involved (merchant = shop owner for standard orders; BNPL uses `customer`)
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function orderMerchantRequired() {
      return this.paymentMethod !== 'bnpl';
    }
  },
  /** Buyer for BNPL / Pay Later orders (distinct from marketplace `merchant`). */
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function orderCustomerRequired() {
      return this.paymentMethod === 'bnpl';
    }
  },
  orderType: {
    type: String,
    enum: ['merchant_purchase', 'customer_bnpl'],
    default: 'merchant_purchase'
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
    enum: ['cash', 'bank_transfer', 'bnpl', 'bank_financing'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'failed', 'refunded'],
    default: 'pending'
  },

  // Financing references
  creditLine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditLine'
  },
  financingApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BankFinancingApplication'
  },
  financingStatus: {
    type: String,
    enum: ['NOT_APPLICABLE', 'PENDING_BANK', 'BANK_APPROVED', 'BANK_DISBURSED', 'FINANCING_REJECTED'],
    default: 'NOT_APPLICABLE'
  },
  bnplDetails: {
    provider: String,
    tier: String,
    tenureDays: Number,
    principal: Number,
    markupRate: Number,
    markupAmount: Number,
    totalPayable: Number,
    outstandingPrincipal: Number,
    dueDate: Date,
    lateFee: { type: Number, default: 0 },
    paidPrincipal: { type: Number, default: 0 },
    blockedAt: Date,
    recoveryAt: Date
  },

  // Delivery
  shippingAddress: {
    recipientName: String,
    phone: String,
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
  if (this.paymentMethod === 'bnpl') {
    this.orderType = 'customer_bnpl';
    if (!this.customer && this.merchant) {
      this.customer = this.merchant;
    }
  } else if (!this.orderType) {
    this.orderType = 'merchant_purchase';
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

orderSchema.index({ customer: 1, paymentMethod: 1 });
orderSchema.index({ orderType: 1 });

module.exports = mongoose.model('Order', orderSchema);
