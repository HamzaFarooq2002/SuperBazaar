const mongoose = require('mongoose');

const creditLineSchema = new mongoose.Schema({
  // User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  
  // Credit Type
  type: {
    type: String,
    enum: ['snpl', 'bnpl'],
    required: true
  },
  
  // Credit Limit
  creditLimit: {
    type: Number,
    required: true
  },
  availableCredit: {
    type: Number,
    required: true
  },
  usedCredit: {
    type: Number,
    default: 0
  },
  
  // Loan Details
  principalAmount: {
    type: Number,
    default: 0
  },
  interestRate: {
    type: Number,
    default: 0
  },
  tenureMonths: {
    type: Number,
    required: true
  },
  
  // Approval
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'closed', 'defaulted'],
    default: 'pending'
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Credit Score at Application
  creditScoreAtApplication: Number,
  
  // Installments
  installments: [{
    installmentNumber: Number,
    amount: Number,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    paidDate: Date,
    paidAmount: Number
  }],
  
  // Payment Schedule
  nextPaymentDate: Date,
  nextPaymentAmount: Number,
  
  // Auto Repayment
  autoRepayment: {
    enabled: {
      type: Boolean,
      default: false
    },
    bankAccount: String
  },
  
  // Orders linked to this credit line
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  
  // Repayment History
  repayments: [{
    amount: Number,
    date: Date,
    method: String,
    transactionId: String
  }],
  
  // Risk Assessment
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Metadata
  applicationDate: {
    type: Date,
    default: Date.now
  },
  closedAt: Date,
  closureReason: String
}, {
  timestamps: true
});

// Update available credit when used credit changes
creditLineSchema.pre('save', function(next) {
  this.availableCredit = this.creditLimit - this.usedCredit;
  next();
});

// Generate installment schedule
creditLineSchema.methods.generateInstallments = function() {
  const installmentAmount = this.principalAmount / this.tenureMonths;
  const installments = [];
  
  for (let i = 1; i <= this.tenureMonths; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);
    
    installments.push({
      installmentNumber: i,
      amount: Math.round(installmentAmount),
      dueDate: dueDate,
      status: 'pending'
    });
  }
  
  this.installments = installments;
  this.nextPaymentDate = installments[0].dueDate;
  this.nextPaymentAmount = installments[0].amount;
};

module.exports = mongoose.model('CreditLine', creditLineSchema);
