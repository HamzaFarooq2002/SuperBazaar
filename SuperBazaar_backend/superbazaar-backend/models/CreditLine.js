const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  installmentNumber: Number,
  amount: Number,
  amountDue: Number,
  principalAmount: Number,
  interestAmount: Number,
  markupAmount: Number,
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'waived'],
    default: 'pending'
  },
  paidDate: Date,
  paidAt: Date,
  paidAmount: Number,
  lateFee: { type: Number, default: 0 },
  lateFeeApplied: { type: Boolean, default: false },
  totalDueWithLateFee: { type: Number, default: 0 }
}, { _id: false });

const creditLineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  type: { type: String, enum: ['bnpl', 'nano'], required: true },
  productType: { type: String, enum: ['bnpl', 'nano'] },
  creditLimit: { type: Number, required: true },
  availableCredit: { type: Number, required: true },
  usedCredit: { type: Number, default: 0 },
  principalAmount: { type: Number, default: 0 },
  interestRate: { type: Number, default: 0 },
  markupRate: { type: Number, default: 0 },
  markupAmount: { type: Number, default: 0 },
  totalRepayable: { type: Number, default: 0 },
  tenureMonths: { type: Number, required: true },
  tenureDays: { type: Number, default: 0 },
  installmentCount: { type: Number, default: 0 },
  monthlyInstallment: { type: Number, default: 0 },
  disbursementType: {
    type: String,
    enum: ['merchant_invoice', 'wallet_credit'],
    default: 'merchant_invoice'
  },
  consentAcknowledged: { type: Boolean, default: false },
  consentTimestamp: Date,
  loanAgreementSnapshot: mongoose.Schema.Types.Mixed,
  scoreAtApproval: Number,
  kycLevelAtApproval: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'overdue', 'closed', 'defaulted', 'cancelled'],
    default: 'pending'
  },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creditScoreAtApplication: Number,
  installments: [installmentSchema],
  nextPaymentDate: Date,
  nextPaymentAmount: Number,
  autoRepayment: {
    enabled: { type: Boolean, default: false },
    bankAccount: String
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  repayments: [{ amount: Number, date: Date, method: String, transactionId: String }],
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  applicationDate: { type: Date, default: Date.now },
  closedAt: Date,
  closureReason: String
}, { timestamps: true });

creditLineSchema.index({ user: 1, status: 1 });

creditLineSchema.pre('save', function(next) {
  if (!this.productType && this.type) this.productType = this.type;
  this.availableCredit = this.creditLimit - this.usedCredit;
  this.installments = (this.installments || []).map((inst) => {
    const amountDue = Number(inst.amountDue ?? inst.amount ?? 0);
    const lateFee = Number(inst.lateFee || 0);
    return {
      ...inst.toObject?.() ? inst.toObject() : inst,
      amountDue,
      totalDueWithLateFee: amountDue + lateFee
    };
  });
  next();
});

creditLineSchema.methods.generateInstallments = function(options = {}) {
  const intervalDays = Number(options.intervalDays || 30);
  const explicitCount = Number(options.installmentCount || 0);
  const tenure = explicitCount > 0 ? explicitCount : Math.max(1, Number(this.tenureMonths || 1));
  const principal = Math.max(0, Number(this.principalAmount || 0));
  const rate = Math.max(0, Number(this.markupRate || this.interestRate || 0));
  const markupAmount = Math.round(principal * rate);
  const totalRepayable = principal + markupAmount;
  const baseInstallment = Math.floor(totalRepayable / tenure);
  const installmentRemainder = totalRepayable - (baseInstallment * tenure);
  const basePrincipalPart = Math.floor(principal / tenure);
  const principalRemainder = principal - (basePrincipalPart * tenure);
  const baseDate = this.approvedAt ? new Date(this.approvedAt) : new Date();
  const installments = [];

  for (let i = 1; i <= tenure; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + (intervalDays * i));
    const amountDue = baseInstallment + (i <= installmentRemainder ? 1 : 0);
    const principalAmount = basePrincipalPart + (i <= principalRemainder ? 1 : 0);
    const interestAmount = Math.max(0, amountDue - principalAmount);

    installments.push({
      installmentNumber: i,
      amount: amountDue,
      amountDue,
      principalAmount,
      interestAmount,
      markupAmount: interestAmount,
      dueDate,
      status: 'pending',
      lateFee: 0,
      lateFeeApplied: false,
      totalDueWithLateFee: amountDue
    });
  }

  this.markupRate = rate;
  this.markupAmount = markupAmount;
  this.totalRepayable = totalRepayable;
  this.installmentCount = tenure;
  this.monthlyInstallment = installments[0]?.amountDue || 0;
  this.tenureDays = tenure * intervalDays;
  this.installments = installments;
  this.nextPaymentDate = installments[0]?.dueDate;
  this.nextPaymentAmount = installments[0]?.amountDue || 0;
};

module.exports = mongoose.model('CreditLine', creditLineSchema);
