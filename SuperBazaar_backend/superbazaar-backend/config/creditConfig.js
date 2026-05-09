module.exports = {
  NANO: {
    MIN_SCORE: 640,
    MIN_KYC_LEVEL: 2,
    MAX_ACTIVE_LOANS: 2,
    /** Minimum delivered stock orders (merchant as buyer) for nano eligibility. */
    MIN_COMPLETED_ORDERS: 2,
    /** Minimum account age since signup (days). */
    MIN_ACCOUNT_AGE_DAYS: 14,
    TIERS: [
      { tier: 'tier_1', minScore: 640, maxAmount: 25000, markupRate: 0.032 },
      { tier: 'tier_2', minScore: 700, maxAmount: 50000, markupRate: 0.028 },
      { tier: 'tier_3', minScore: 750, maxAmount: 75000, markupRate: 0.024 }
    ],
    TENURE_OPTIONS: [
      { months: 2, label: '2 months' },
      { months: 4, label: '4 months' },
      { months: 6, label: '6 months' }
    ],
    LATE_FEE_FLAT: 500,
    LATE_FEE_PER_DAY_RATE: 0.0015
  },
  BNPL: {
    MIN_SCORE: 650,
    MIN_KYC_LEVEL: 2,
    MIN_CART_VALUE: 500,
    MAX_CART_VALUE: 50000,
    TENURE_OPTIONS_DAYS: [7, 14],
    INELIGIBLE_CATEGORIES: ['Gift Cards'],
    LATE_FEE_RATE: 0.05,
    /** Max simple effective APR (flat fee / principal scaled to 365d) for BNPL offers. */
    MAX_APR_PERCENT: 36,
    /** Fraction of principal per tenure; tuned so feeRate * (365/tenureDays) <= MAX_APR_PERCENT. */
    TIER_RATE_CARD: {
      Excellent: { day7: 0, day14: 0, eligible: true },
      Good: { day7: 0.0065, day14: 0.013, eligible: true },
      Fair: { day7: 0.0055, day14: 0.011, eligible: true },
      Poor: { day7: null, day14: null, eligible: false }
    }
  },
  REMINDER_DAYS_BEFORE: [3, 1],
  TIMEZONE: 'Asia/Karachi'
};
