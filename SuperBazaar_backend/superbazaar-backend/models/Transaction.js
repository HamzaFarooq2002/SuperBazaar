const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction ID
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  
  // User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Transaction Type
  type: {
    type: String,
    enum: ['income', 'expense', 'loan_disbursement', 'loan_repayment'],
    required: true
  },
  
  // Category
  category: {
    type: String,
    enum: [
      'sales_revenue',
      'stock_purchase',
      'inventory',
      'payment_received',
      'payment_made',
      'loan',
      'repayment',
      'other'
    ],
    required: true
  },
  
  // Amount
  amount: {
    type: Number,
    required: true
  },
  
  // Description
  description: {
    type: String,
    required: true
  },
  
  // Related Documents
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  relatedCreditLine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditLine'
  },
  
  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_banking', 'credit', 'bank_financing', 'bnpl', 'wallet', 'easypaisa', 'jazzcash', 'card', 'other']
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  
  // Metadata
  notes: String,
  receiptUrl: String,
  
  // Timestamps
  transactionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate transaction ID before validation (must run before validate, not save,
// because transactionId is required and validation runs before save hooks)
transactionSchema.pre('validate', async function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
