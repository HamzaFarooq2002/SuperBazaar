// utils/creditScoring.js
//
// FEATURE-DERIVATION CONTRACT
// ---------------------------
// The deployed FastAPI model (xgb_m.pkl / xgb_c.pkl) only fixes the feature
// names, order, and preprocessing - it does NOT encode how each value should
// be computed from Mongo. The semantics below are a deliberate production
// choice and may differ from how training data was generated. If the training
// notebook is recovered, reconcile with this contract.
//
// Windows:        income/expense = last 30 days; orders = last 90 days;
//                 volatility = monthly net cashflow over last 6 months.
// Income source:  Transaction.type === 'income', status === 'completed'.
// Expense source: Transaction.type === 'expense', status === 'completed'.
// Order source:   Order collection (not Transaction.relatedOrder).
// Credit scope:   merchant features aggregate ALL credit lines (bnpl + nano).
// Timeliness:     repayment_timeliness_avg_days > 0 means late.
// Suppliers:      scored via the merchant model (no supplier model exists).
//
// Calls FastAPI ML pipeline at FASTAPI_URL for real credit scoring.

const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

class ScoringServiceUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScoringServiceUnavailableError';
  }
}

const MS_DAY = 1000 * 60 * 60 * 24;

/** JSON-safe number for Pydantic (no NaN/Infinity). */
const finiteNum = (v, fallback = 0) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Days since max(lastLogin, createdAt); 0 if dates invalid. */
const lastLoginDaysAgo = (user) => {
  const created = user.createdAt ? new Date(user.createdAt).getTime() : NaN;
  const login = user.lastLogin ? new Date(user.lastLogin).getTime() : NaN;
  const ref = Number.isFinite(login) && Number.isFinite(created)
    ? Math.max(login, created)
    : Number.isFinite(login)
      ? login
      : Number.isFinite(created)
        ? created
        : NaN;
  if (!Number.isFinite(ref)) return 0;
  const days = Math.floor((Date.now() - ref) / MS_DAY);
  return finiteNum(days, 0);
};

/**
 * Monthly net cashflow (income - expense) per calendar bucket for last 6 months.
 * Month 0 = current partial month through now; months 1–5 = prior full calendar months.
 */
const monthlyNetCashflowsSixMonths = (completedTxns) => {
  const nets = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const anchor = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const monthEnd = i === 0
      ? now
      : new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59, 59, 999);

    let income = 0;
    let expense = 0;
    for (const t of completedTxns) {
      const d = new Date(t.createdAt);
      if (d < monthStart || d > monthEnd) continue;
      if (t.type === 'income') income += finiteNum(t.amount, 0);
      else if (t.type === 'expense') expense += finiteNum(t.amount, 0);
    }
    nets.push(income - expense);
  }
  return nets;
};

const stdDevSample = (values) => {
  if (!values.length) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

// ─── Feature builders ────────────────────────────────────────────────────────

/**
 * Build the 24 merchant features from MongoDB data.
 * @param {Object} user         - User document
 * @param {Array}  transactions - Completed Transaction documents (same user)
 * @param {Array}  creditLines  - CreditLine documents for this user
 * @param {Object} store        - Store document (or null)
 */
const buildMerchantFeatures = async (user, transactions = [], creditLines = [], store = null) => {
  const kyc = user.kycData || {};
  const userId = user._id;

  // ── KYC / identity flags ──────────────────────────────────────
  const fingerprint_verified = kyc.fingerprintVerified ? 1 : 0;
  const bank_iban_present = kyc.bankIBAN ? 1 : 0;
  const cnic_present = kyc.cnic ? 1 : 0;
  const ntn_present = kyc.ntn ? 1 : 0;
  const document_count = Math.max(0, Math.floor(finiteNum((kyc.documents || []).length, 0)));
  const is_phone_verified = user.isPhoneVerified ? 1 : 0;
  const store_verified = store?.isVerified ? 1 : 0;

  const last_login_days_ago = lastLoginDaysAgo(user);

  // ── Financial — completed transactions ────────────────────────
  const completed = transactions.filter((t) => t.status === 'completed');
  const thirtyDaysAgo = new Date(Date.now() - 30 * MS_DAY);
  const recent = completed.filter((t) => new Date(t.createdAt) >= thirtyDaysAgo);

  const monthly_income_pkr = recent
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + finiteNum(t.amount, 0), 0);

  const monthly_expenses_pkr = recent
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + finiteNum(t.amount, 0), 0);

  const net_profit_monthly_pkr = finiteNum(monthly_income_pkr - monthly_expenses_pkr, 0);
  const income_expense_ratio = monthly_expenses_pkr > 0
    ? finiteNum(monthly_income_pkr / monthly_expenses_pkr, 1.0)
    : 1.0;

  const monthlyNets = monthlyNetCashflowsSixMonths(completed);
  const cashflow_volatility_pkr = finiteNum(parseFloat(stdDevSample(monthlyNets).toFixed(2)), 0);

  // ── Order metrics — Order collection, last 90 days ────────────
  const ninetyDaysAgo = new Date(Date.now() - 90 * MS_DAY);
  const orderBase = { merchant: userId, createdAt: { $gte: ninetyDaysAgo } };

  const [totalOrders, cancelledOrders, creditPurchaseOrders, avgAgg] = await Promise.all([
    Order.countDocuments(orderBase),
    Order.countDocuments({ ...orderBase, status: 'cancelled' }),
    Order.countDocuments({
      ...orderBase,
      paymentMethod: { $in: ['bnpl', 'bank_financing', 'pbb'] }
    }),
    Order.aggregate([
      {
        $match: {
          merchant: userId,
          createdAt: { $gte: ninetyDaysAgo },
          status: { $in: ['delivered', 'shipped', 'confirmed'] }
        }
      },
      { $group: { _id: null, avgAmount: { $avg: '$totalAmount' } } }
    ])
  ]);

  const avgRaw = avgAgg[0]?.avgAmount;
  const avgNum = Number(avgRaw != null ? avgRaw : 0);
  const avg_order_value_pkr = finiteNum(parseFloat(finiteNum(avgNum, 0).toFixed(2)), 0);

  const cancel_rate = totalOrders > 0
    ? finiteNum(parseFloat((cancelledOrders / totalOrders).toFixed(4)), 0)
    : 0;

  const credit_purchase_share = totalOrders > 0
    ? finiteNum(parseFloat((creditPurchaseOrders / totalOrders).toFixed(4)), 0)
    : 0;

  const [failedTxns90d, completedFailedTxns90d] = await Promise.all([
    Transaction.countDocuments({
      user: userId,
      status: 'failed',
      createdAt: { $gte: ninetyDaysAgo }
    }),
    Transaction.countDocuments({
      user: userId,
      status: { $in: ['failed', 'completed'] },
      createdAt: { $gte: ninetyDaysAgo }
    })
  ]);

  const payment_failure_rate = completedFailedTxns90d > 0
    ? finiteNum(parseFloat((failedTxns90d / completedFailedTxns90d).toFixed(4)), 0)
    : 0;

  // ── Credit line metrics (all bnpl + nano, active limits) ──────
  const activeCreditLines = creditLines.filter((cl) => ['approved', 'active'].includes(cl.status));
  const totalLimit = activeCreditLines.reduce((s, cl) => s + finiteNum(cl.creditLimit, 0), 0);
  const totalUsed = activeCreditLines.reduce((s, cl) => s + finiteNum(cl.usedCredit, 0), 0);
  const credit_utilization = totalLimit > 0
    ? finiteNum(parseFloat((totalUsed / totalLimit).toFixed(4)), 0)
    : 0;
  const credit_limit_pkr = finiteNum(totalLimit, 0);
  const num_credit_lines_opened = Math.max(0, Math.floor(finiteNum(creditLines.length, 0)));

  const overdue_installments = creditLines.reduce((sum, cl) => {
    return sum + (cl.installments || []).filter((i) => i.status === 'overdue').length;
  }, 0);

  // Average repayment timeliness (positive = late, negative = early)
  const repaymentDays = [];
  for (const cl of creditLines) {
    for (const inst of cl.installments || []) {
      if (inst.status === 'paid' && inst.paidDate && inst.dueDate) {
        const daysLate = Math.floor(
          (new Date(inst.paidDate) - new Date(inst.dueDate)) / MS_DAY
        );
        repaymentDays.push(finiteNum(daysLate, 0));
      }
    }
  }
  const repayment_timeliness_avg_days = repaymentDays.length
    ? finiteNum(parseFloat((repaymentDays.reduce((s, d) => s + d, 0) / repaymentDays.length).toFixed(2)), 0)
    : 0;

  const low_stock_products = Math.max(0, Math.floor(finiteNum(store?.lowStockProducts, 0)));
  const wallet_balance_pkr = finiteNum(user.walletBalance, 0);

  return {
    fingerprint_verified,
    bank_iban_present,
    cnic_present,
    ntn_present,
    document_count,
    last_login_days_ago,
    monthly_income_pkr: finiteNum(monthly_income_pkr, 0),
    monthly_expenses_pkr: finiteNum(monthly_expenses_pkr, 0),
    net_profit_monthly_pkr,
    income_expense_ratio: finiteNum(parseFloat(income_expense_ratio.toFixed(4)), 1.0),
    cashflow_volatility_pkr,
    avg_order_value_pkr,
    cancel_rate,
    credit_purchase_share,
    payment_failure_rate,
    credit_utilization,
    credit_limit_pkr,
    num_credit_lines_opened,
    overdue_installments,
    repayment_timeliness_avg_days,
    store_verified,
    low_stock_products,
    wallet_balance_pkr,
    is_phone_verified
  };
};

/**
 * Build the 14 customer features from MongoDB data.
 * @param {Object} user        - User document
 * @param {Array}  creditLines - CreditLine documents for this user
 */
const buildCustomerFeatures = (user, creditLines = []) => {
  const kyc = user.kycData || {};

  const fingerprint_verified = kyc.fingerprintVerified ? 1 : 0;
  const bank_iban_present = kyc.bankIBAN ? 1 : 0;
  const cnic_present = kyc.cnic ? 1 : 0;
  const is_phone_verified = user.isPhoneVerified ? 1 : 0;
  const is_email_verified = user.isEmailVerified ? 1 : 0;
  const document_count = Math.max(0, Math.floor(finiteNum((kyc.documents || []).length, 0)));

  const bnplLines = creditLines.filter((cl) => cl.type === 'bnpl');
  const activebnpl = bnplLines.filter((cl) => ['approved', 'active'].includes(cl.status));

  const totalBnplLimit = activebnpl.reduce((s, cl) => s + finiteNum(cl.creditLimit, 0), 0);
  const totalBnplUsed = activebnpl.reduce((s, cl) => s + finiteNum(cl.usedCredit, 0), 0);
  const bnpl_utilization = totalBnplLimit > 0
    ? finiteNum(parseFloat((totalBnplUsed / totalBnplLimit).toFixed(4)), 0)
    : 0;

  const num_bnpl_lines_opened = Math.max(0, Math.floor(finiteNum(bnplLines.length, 0)));
  const bnpl_lines_closed = bnplLines.filter((cl) => cl.status === 'closed').length;

  const overdue_installments = bnplLines.reduce((sum, cl) => {
    return sum + (cl.installments || []).filter((i) => i.status === 'overdue').length;
  }, 0);

  const repaymentDays = [];
  for (const cl of bnplLines) {
    for (const inst of cl.installments || []) {
      if (inst.status === 'paid' && inst.paidDate && inst.dueDate) {
        const daysLate = Math.floor(
          (new Date(inst.paidDate) - new Date(inst.dueDate)) / MS_DAY
        );
        repaymentDays.push(finiteNum(daysLate, 0));
      }
    }
  }
  const repayment_timeliness_avg_days = repaymentDays.length
    ? finiteNum(parseFloat((repaymentDays.reduce((s, d) => s + d, 0) / repaymentDays.length).toFixed(2)), 0)
    : 0;

  const allInstallments = bnplLines.flatMap((cl) => cl.installments || []);
  const paidInstallments = allInstallments.filter((i) => i.status === 'paid').length;
  const repayment_completion_rate = allInstallments.length
    ? finiteNum(parseFloat((paidInstallments / allInstallments.length).toFixed(4)), 1.0)
    : 1.0;

  const wallet_balance_pkr = finiteNum(user.walletBalance, 0);
  const reward_points = finiteNum(user.rewardPoints, 0);

  return {
    fingerprint_verified,
    bank_iban_present,
    cnic_present,
    is_phone_verified,
    is_email_verified,
    document_count,
    bnpl_utilization,
    num_bnpl_lines_opened,
    bnpl_lines_closed,
    overdue_installments,
    repayment_timeliness_avg_days,
    repayment_completion_rate,
    wallet_balance_pkr,
    reward_points
  };
};

// ─── Main scoring function ───────────────────────────────────────────────────

/**
 * Score a user by calling FastAPI.
 * Returns { score, band, defaultProbability, lastCalculated, factors }
 *
 * @param {Object} user         - User Mongoose document
 * @param {Array}  transactions - Completed Transaction documents
 * @param {Array}  creditLines  - CreditLine documents
 * @param {Object} store        - Store document (merchants only, or null)
 */
const scoreUser = async (user, transactions = [], creditLines = [], store = null) => {
  let endpoint;
  let features;

  if (user.userType === 'merchant' || user.userType === 'supplier') {
    endpoint = `${FASTAPI_URL}/score/merchant`;
    features = await buildMerchantFeatures(user, transactions, creditLines, store);
  } else if (user.userType === 'customer') {
    endpoint = `${FASTAPI_URL}/score/customer`;
    features = buildCustomerFeatures(user, creditLines);
  } else {
    throw new Error(`Unsupported userType for credit scoring: ${user.userType}`);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`FastAPI scoring failed [${response.status}]: ${err}`);
    }

    const result = await response.json();

    const monthlyIncome = features.monthly_income_pkr ?? 0;
    const walletBal = features.wallet_balance_pkr ?? 0;
    const transactionVolume = user.userType === 'customer'
      ? walletBal
      : monthlyIncome;

    return {
      score: result.score,
      band: result.band,
      defaultProbability: result.default_probability,
      lastCalculated: new Date(),
      factors: {
        paymentHistory: 0,
        creditUtilization: features.credit_utilization ?? features.bnpl_utilization ?? 0,
        accountAge: 0,
        transactionVolume
      }
    };
  } catch (error) {
    console.warn(`Credit scoring upstream error: ${error.message}`);
    throw new ScoringServiceUnavailableError(error.message);
  }
};

// ─── Credit limit helper (kept for use in approval flow) ─────────────────────

const calculateCreditLimit = (score, monthlyRevenue = 0) => {
  let limit = 0;
  if (score >= 750) limit = 500000;
  else if (score >= 700) limit = 350000;
  else if (score >= 650) limit = 200000;
  else if (score >= 600) limit = 100000;
  else limit = 50000;

  if (monthlyRevenue > 0) {
    limit = Math.max(limit, monthlyRevenue * 2);
  }
  return Math.min(limit, 500000);
};

// ─── Risk level helper (kept for CreditLine.riskLevel) ───────────────────────

const assessRiskLevel = (band) => {
  if (band === 'Excellent' || band === 'Good') return 'low';
  if (band === 'Fair') return 'medium';
  return 'high';
};

module.exports = {
  scoreUser,
  ScoringServiceUnavailableError,
  calculateCreditLimit,
  assessRiskLevel
};
