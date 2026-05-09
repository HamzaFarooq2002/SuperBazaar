const mongoose = require('mongoose');
const bankFinancingConfig = require('../config/bankFinancingConfig');

const repaymentInstallmentSchema = new mongoose.Schema({
  dueDate: Date,
  principalAmount: { type: Number, default: 0 },
  markupAmount: { type: Number, default: 0 },
  processingFeeAmount: { type: Number, default: 0 },
  totalDue: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  paidAt: Date,
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  }
}, { _id: false });

const bankFinancingApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  merchantNameSnapshot: String,
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  selectedBank: {
    type: String,
    enum: bankFinancingConfig.BANKS,
    required: true
  },
  requestedAmount: { type: Number, required: true },
  approvedAmount: { type: Number, default: 0 },
  merchantRiskTier: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    required: true
  },
  applicationStatus: {
    type: String,
    enum: [
      'SUBMITTED',
      'UNDER_REVIEW',
      'APPROVED',
      'REJECTED',
      'OFFER_PENDING',
      'OFFER_ACCEPTED',
      'OFFER_DECLINED',
      'OFFER_EXPIRED',
      'DISBURSED',
      'REPAYING',
      'CLOSED'
    ],
    default: 'SUBMITTED'
  },
  bankApplicationId: String,
  consentGiven: { type: Boolean, default: false },
  consentTimestamp: Date,
  consentIp: { type: String, default: '' },
  consentUserAgent: { type: String, default: '' },
  consentTextVersion: String,
  consentTextSnapshot: String,
  offerAcceptedAt: Date,
  offerAcceptIp: { type: String, default: '' },
  offerAcceptUserAgent: { type: String, default: '' },
  offerTextVersion: String,
  offerTextSnapshot: String,
  kibor3mPercent: { type: Number, default: 0 },
  spreadPercent: { type: Number, default: 0 },
  annualMarkupRate: { type: Number, default: 0 },
  processingFeeRate: { type: Number, default: 0 },
  selectedTenureDays: { type: Number, default: 0 },
  tenureOptionsDays: [{ type: Number }],
  processingFee: { type: Number, default: 0 },
  markupAmount: { type: Number, default: 0 },
  totalRepayable: { type: Number, default: 0 },
  offerExpiry: Date,
  repaymentSchedule: [repaymentInstallmentSchema],
  repaymentStatus: {
    type: String,
    enum: ['NOT_STARTED', 'ACTIVE', 'OVERDUE', 'COMPLETED'],
    default: 'NOT_STARTED'
  },
  latePaymentPolicy: {
    type: String,
    default: bankFinancingConfig.LATE_PAYMENT_POLICY_TEXT
  },
  rejectionReason: String,
  supplierSettlementStatus: {
    type: String,
    enum: ['PENDING', 'SETTLED'],
    default: 'PENDING'
  },
  supplierSettledAt: Date,
  disbursedAt: Date,
  creditScoreSnapshot: Number,
  cartHash: String,
  eligibilitySnapshot: mongoose.Schema.Types.Mixed
}, { timestamps: true });

bankFinancingApplicationSchema.index({ merchant: 1, applicationStatus: 1 });
bankFinancingApplicationSchema.index({ merchant: 1, cartHash: 1, applicationStatus: 1 });

module.exports = mongoose.model('BankFinancingApplication', bankFinancingApplicationSchema);
