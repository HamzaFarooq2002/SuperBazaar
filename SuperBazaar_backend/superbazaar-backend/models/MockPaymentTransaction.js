const mongoose = require('mongoose');

const mockPaymentTransactionSchema = new mongoose.Schema({
  pbbId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  bankFinancingApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'BankFinancingApplication', default: null },
  bankCode: { type: String, required: true },
  bankName: { type: String, required: true },
  amount: { type: Number, required: true },
  intent: { type: String, enum: ['order', 'bank_financing_repay'], required: true },
  orderDraft: { type: mongoose.Schema.Types.Mixed, default: null },
  status: { type: String, enum: ['INITIATED', 'AUTHED', 'SUCCESS', 'FAILED'], default: 'INITIATED' },
  failureReason: { type: String, default: null },
  pinAttempts: { type: Number, default: 0 },
  consentGiven: { type: Boolean, default: false },
  consentTextSnapshot: { type: String, default: '' },
  sessionId: { type: String, unique: true, required: true },
  authedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Generate pbbId: PBB-YYYYMMDD-NNNNN
mockPaymentTransactionSchema.pre('validate', async function (next) {
  if (!this.pbbId) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const count = await mongoose.model('MockPaymentTransaction').countDocuments({ createdAt: { $gte: startOfDay } });
    this.pbbId = `PBB-${dateStr}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

mockPaymentTransactionSchema.index({ user: 1, status: 1 });
mockPaymentTransactionSchema.index({ order: 1 });

module.exports = mongoose.model('MockPaymentTransaction', mockPaymentTransactionSchema);
