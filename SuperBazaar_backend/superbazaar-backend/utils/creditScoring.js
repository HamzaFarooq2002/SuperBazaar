// utils/creditScoring.js
// Calls FastAPI ML pipeline at localhost:8000 for real credit scoring.
// Replaces the old mock algorithm entirely.

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
const ALLOW_SCORING_FALLBACK = process.env.ALLOW_SCORING_FALLBACK !== 'false';
class ScoringServiceUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScoringServiceUnavailableError';
  }
}

// ─── Feature builders ────────────────────────────────────────────────────────

/**
 * Build the 24 merchant features from MongoDB data.
 * @param {Object} user         - User document
 * @param {Array}  transactions - Completed Transaction documents
 * @param {Array}  creditLines  - CreditLine documents for this user
 * @param {Object} store        - Store document (or null)
 */
const buildMerchantFeatures = (user, transactions = [], creditLines = [], store = null) => {
  const kyc = user.kycData || {};

  // ── KYC / identity flags ──────────────────────────────────────
  const fingerprint_verified   = kyc.fingerprintVerified ? 1 : 0;
  const bank_iban_present      = kyc.bankIBAN ? 1 : 0;
  const cnic_present           = kyc.cnic ? 1 : 0;
  const ntn_present            = kyc.ntn ? 1 : 0;
  const document_count         = (kyc.documents || []).length;
  const is_phone_verified      = user.isPhoneVerified ? 1 : 0;
  const store_verified         = store?.isVerified ? 1 : 0;

  // ── Activity ──────────────────────────────────────────────────
  const lastLogin              = user.lastLogin ? new Date(user.lastLogin) : new Date(user.createdAt);
  const last_login_days_ago    = Math.floor((Date.now() - lastLogin) / (1000 * 60 * 60 * 24));

  // ── Financial — derived from completed transactions ───────────
  const completed = transactions.filter(t => t.status === 'completed');

  // Sum income (sales) vs expenses (purchases/repayments) over last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent = completed.filter(t => new Date(t.createdAt) >= thirtyDaysAgo);

  const monthly_income_pkr     = recent
    .filter(t => ['sale', 'loan_disbursement'].includes(t.type))
    .reduce((s, t) => s + (t.amount || 0), 0);

  const monthly_expenses_pkr   = recent
    .filter(t => ['purchase', 'loan_repayment'].includes(t.type))
    .reduce((s, t) => s + (t.amount || 0), 0);

  const net_profit_monthly_pkr = monthly_income_pkr - monthly_expenses_pkr;
  const income_expense_ratio   = monthly_expenses_pkr > 0
    ? parseFloat((monthly_income_pkr / monthly_expenses_pkr).toFixed(4))
    : 1.0;

  // Cashflow volatility — std dev of monthly transaction amounts
  const amounts = completed.map(t => t.amount || 0);
  const mean    = amounts.length ? amounts.reduce((s, v) => s + v, 0) / amounts.length : 0;
  const variance = amounts.length
    ? amounts.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / amounts.length
    : 0;
  const cashflow_volatility_pkr = parseFloat(Math.sqrt(variance).toFixed(2));

  // ── Order metrics (from transactions tagged as orders) ────────
  const orderTxns              = completed.filter(t => t.type === 'order' || t.category === 'order');
  const totalOrders            = orderTxns.length || 1; // avoid div/0
  const avg_order_value_pkr    = orderTxns.length
    ? parseFloat((orderTxns.reduce((s, t) => s + (t.amount || 0), 0) / orderTxns.length).toFixed(2))
    : 0;

  const cancelledOrders        = transactions.filter(t => t.status === 'cancelled').length;
  const cancel_rate            = parseFloat((cancelledOrders / totalOrders).toFixed(4));

  const creditOrderTxns        = orderTxns.filter(t => t.paymentMethod === 'credit').length;
  const credit_purchase_share  = parseFloat((creditOrderTxns / totalOrders).toFixed(4));

  const failedPayments         = transactions.filter(t => t.status === 'failed').length;
  const payment_failure_rate   = parseFloat((failedPayments / (totalOrders)).toFixed(4));

  // ── Credit line metrics ───────────────────────────────────────
  const activeCreditLines      = creditLines.filter(cl => ['approved', 'active'].includes(cl.status));
  const totalLimit             = activeCreditLines.reduce((s, cl) => s + (cl.creditLimit || 0), 0);
  const totalUsed              = activeCreditLines.reduce((s, cl) => s + (cl.usedCredit || 0), 0);
  const credit_utilization     = totalLimit > 0
    ? parseFloat((totalUsed / totalLimit).toFixed(4))
    : 0;
  const credit_limit_pkr       = totalLimit;
  const num_credit_lines_opened = creditLines.length;

  // Overdue installments across all credit lines
  const overdue_installments   = creditLines.reduce((sum, cl) => {
    return sum + (cl.installments || []).filter(i => i.status === 'overdue').length;
  }, 0);

  // Average repayment timeliness (days late — negative = early)
  const repaymentDays = [];
  for (const cl of creditLines) {
    for (const inst of (cl.installments || [])) {
      if (inst.status === 'paid' && inst.paidDate && inst.dueDate) {
        const daysLate = Math.floor(
          (new Date(inst.paidDate) - new Date(inst.dueDate)) / (1000 * 60 * 60 * 24)
        );
        repaymentDays.push(daysLate);
      }
    }
  }
  const repayment_timeliness_avg_days = repaymentDays.length
    ? parseFloat((repaymentDays.reduce((s, d) => s + d, 0) / repaymentDays.length).toFixed(2))
    : 0;

  // ── Store metrics ─────────────────────────────────────────────
  const low_stock_products     = store?.products
    ? store.products.filter(p => (p.stock || 0) < 5).length
    : 0;

  const wallet_balance_pkr     = user.walletBalance || 0;

  return {
    fingerprint_verified,
    bank_iban_present,
    cnic_present,
    ntn_present,
    document_count,
    last_login_days_ago,
    monthly_income_pkr,
    monthly_expenses_pkr,
    net_profit_monthly_pkr,
    income_expense_ratio,
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

  // ── KYC / identity flags ──────────────────────────────────────
  const fingerprint_verified        = kyc.fingerprintVerified ? 1 : 0;
  const bank_iban_present           = kyc.bankIBAN ? 1 : 0;
  const cnic_present                = kyc.cnic ? 1 : 0;
  const is_phone_verified           = user.isPhoneVerified ? 1 : 0;
  const is_email_verified           = user.isEmailVerified ? 1 : 0;
  const document_count              = (kyc.documents || []).length;

  // ── BNPL credit line metrics ──────────────────────────────────
  const bnplLines                   = creditLines.filter(cl => cl.type === 'bnpl');
  const activebnpl                  = bnplLines.filter(cl => ['approved', 'active'].includes(cl.status));

  const totalBnplLimit              = activebnpl.reduce((s, cl) => s + (cl.creditLimit || 0), 0);
  const totalBnplUsed               = activebnpl.reduce((s, cl) => s + (cl.usedCredit || 0), 0);
  const bnpl_utilization            = totalBnplLimit > 0
    ? parseFloat((totalBnplUsed / totalBnplLimit).toFixed(4))
    : 0;

  const num_bnpl_lines_opened       = bnplLines.length;
  const bnpl_lines_closed           = bnplLines.filter(cl => cl.status === 'closed').length;

  // Overdue installments
  const overdue_installments        = bnplLines.reduce((sum, cl) => {
    return sum + (cl.installments || []).filter(i => i.status === 'overdue').length;
  }, 0);

  // Average repayment timeliness
  const repaymentDays = [];
  for (const cl of bnplLines) {
    for (const inst of (cl.installments || [])) {
      if (inst.status === 'paid' && inst.paidDate && inst.dueDate) {
        const daysLate = Math.floor(
          (new Date(inst.paidDate) - new Date(inst.dueDate)) / (1000 * 60 * 60 * 24)
        );
        repaymentDays.push(daysLate);
      }
    }
  }
  const repayment_timeliness_avg_days = repaymentDays.length
    ? parseFloat((repaymentDays.reduce((s, d) => s + d, 0) / repaymentDays.length).toFixed(2))
    : 0;

  // Repayment completion rate — paid installments / total installments
  const allInstallments             = bnplLines.flatMap(cl => cl.installments || []);
  const paidInstallments            = allInstallments.filter(i => i.status === 'paid').length;
  const repayment_completion_rate   = allInstallments.length
    ? parseFloat((paidInstallments / allInstallments.length).toFixed(4))
    : 1.0; // no history = assume clean

  // ── Wallet & rewards ──────────────────────────────────────────
  const wallet_balance_pkr          = user.walletBalance || 0;
  const reward_points               = user.rewardPoints || 0;

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

const scoreBandFromScore = (score) => {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  return 'Poor';
};

const fallbackScoreUser = (features, user = null) => {
  let score = 600;

  const docSignals = [
    features.fingerprint_verified,
    features.bank_iban_present,
    features.cnic_present,
    features.ntn_present,
    features.is_phone_verified,
    features.is_email_verified,
    features.store_verified
  ].filter((v) => v === 1).length;

  score += docSignals * 18;

  if (typeof features.overdue_installments === 'number') {
    score -= Math.min(features.overdue_installments * 22, 120);
  }

  if (typeof features.payment_failure_rate === 'number') {
    score -= Math.round(features.payment_failure_rate * 180);
  }

  if (typeof features.credit_utilization === 'number') {
    score -= Math.round(features.credit_utilization * 60);
  }
  if (typeof features.bnpl_utilization === 'number') {
    score -= Math.round(features.bnpl_utilization * 50);
  }

  if (typeof features.repayment_completion_rate === 'number') {
    score += Math.round(features.repayment_completion_rate * 40);
  }

  if (typeof features.repayment_timeliness_avg_days === 'number') {
    if (features.repayment_timeliness_avg_days <= 0) {
      score += 10;
    } else {
      score -= Math.min(Math.round(features.repayment_timeliness_avg_days * 2), 40);
    }
  }

  if (typeof features.monthly_income_pkr === 'number') {
    score += Math.min(Math.floor(features.monthly_income_pkr / 50000) * 8, 40);
  }
  if (typeof features.net_profit_monthly_pkr === 'number' && features.net_profit_monthly_pkr > 0) {
    score += Math.min(Math.floor(features.net_profit_monthly_pkr / 50000) * 6, 30);
  }

  if (user?.openBanking?.enabled) {
    score += 20;
    if (user?.openBanking?.consents?.shareTransactions) {
      score += 8;
    }
  }

  score = Math.max(300, Math.min(850, Math.round(score)));
  const band = scoreBandFromScore(score);

  const defaultProbabilityByBand = {
    Excellent: 0.02,
    Good: 0.05,
    Fair: 0.1,
    Poor: 0.2
  };

  return {
    score,
    band,
    defaultProbability: defaultProbabilityByBand[band],
    lastCalculated: new Date()
  };
};

// ─── Main scoring function ───────────────────────────────────────────────────

/**
 * Score a user by calling FastAPI.
 * Returns { score, band, defaultProbability, lastCalculated }
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
    features = buildMerchantFeatures(user, transactions, creditLines, store);
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

    return {
      score:              result.score,
      band:               result.band,
      defaultProbability: result.default_probability,
      lastCalculated:     new Date(),
      factors: {
        paymentHistory:     0,
        creditUtilization:  features.credit_utilization ?? features.bnpl_utilization ?? 0,
        accountAge:         0,
        transactionVolume:  features.monthly_income_pkr ?? 0
      }
    };
  } catch (error) {
    if (ALLOW_SCORING_FALLBACK) {
      console.warn(`Fallback scoring is disabled by redesign policy, upstream error: ${error.message}`);
    }
    throw new ScoringServiceUnavailableError(error.message);
  }
};

// ─── Credit limit helper (kept for use in approval flow) ─────────────────────

const calculateCreditLimit = (score, monthlyRevenue = 0) => {
  let limit = 0;
  if      (score >= 750) limit = 500000;
  else if (score >= 700) limit = 350000;
  else if (score >= 650) limit = 200000;
  else if (score >= 600) limit = 100000;
  else                   limit = 50000;

  if (monthlyRevenue > 0) {
    limit = Math.max(limit, monthlyRevenue * 2);
  }
  return Math.min(limit, 500000);
};

// ─── Risk level helper (kept for CreditLine.riskLevel) ───────────────────────

const assessRiskLevel = (band) => {
  if (band === 'Excellent' || band === 'Good') return 'low';
  if (band === 'Fair')                         return 'medium';
  return 'high';
};

module.exports = {
  scoreUser,
  ScoringServiceUnavailableError,
  calculateCreditLimit,
  assessRiskLevel
};