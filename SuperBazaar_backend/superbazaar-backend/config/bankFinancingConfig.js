module.exports = {
  PRODUCT_NAME: 'Stock Now Pay Later via Bank',
  CONSENT_TEXT_VERSION: 'bank-financing-consent-v2',
  OFFER_TEXT_VERSION: 'bank-financing-offer-v2',
  DATA_SHARING_CONSENT_TEXT:
    'I authorize SuperBazaar to share my marketplace transaction data, order details, credit score, KYC profile, business information, and supplier/order verification data with my selected bank for evaluating my Stock Now Pay Later financing application. I understand SuperBazaar is not the lender and the selected bank may independently approve, reject, or modify financing terms.',
  /** Shown on offer / consent UI: explains flat markup vs tenure-aligned installments. */
  FLAT_MARKUP_DISCLOSURE_TEXT:
    'Total bank markup is a flat amount on your approved principal for the exact financing tenure you choose (in days), using the annual markup rate shown—not by assuming each installment is a full 30-day interest period. Installment due dates are spread across that same tenure. After each due date, a 3-day grace period applies before the installment is treated as overdue.',
  OFFER_ACCEPTANCE_TEXT:
    "I have read and understood that this is a bank-issued financing offer. SuperBazaar is not the lender. I accept the selected bank's markup rate, tenure, processing fee, repayment schedule, and late payment policy. I acknowledge the flat markup is calculated on principal for the exact tenure in days, with installment dates within that period and a 3-day grace before overdue status.",
  BANKS: [
    'HBL',
    'Meezan Bank',
    'Bank Alfalah',
    'UBL',
    'MCB',
    'JS Bank',
    'Allied Bank',
    'Standard Chartered Bank'
  ],
  KIBOR_3M_PERCENT: 11.76,
  BANK_PRICING: {
    HBL: { spreadAdjustmentPercent: 0 },
    'Meezan Bank': { spreadAdjustmentPercent: 0.25 },
    'Bank Alfalah': { spreadAdjustmentPercent: 0.15 },
    UBL: { spreadAdjustmentPercent: 0.1 },
    MCB: { spreadAdjustmentPercent: 0.2 },
    'JS Bank': { spreadAdjustmentPercent: 0.35 },
    'Allied Bank': { spreadAdjustmentPercent: 0.18 },
    'Standard Chartered Bank': { spreadAdjustmentPercent: 0.3 }
  },
  TIER_PRICING: {
    Excellent: {
      eligible: true,
      spreadPercent: 3,
      annualMarkupRatePercent: 14.76,
      tenureOptionsDays: [30, 60, 90, 120]
    },
    Good: {
      eligible: true,
      spreadPercent: 5,
      annualMarkupRatePercent: 16.76,
      tenureOptionsDays: [30, 60, 90]
    },
    Fair: {
      eligible: true,
      spreadPercent: 7,
      annualMarkupRatePercent: 18.76,
      tenureOptionsDays: [30, 60]
    },
    Poor: {
      eligible: false,
      spreadPercent: null,
      annualMarkupRatePercent: null,
      tenureOptionsDays: []
    }
  },
  PROCESSING_FEE_RATE: 0.005,
  MIN_SCORE_TO_APPLY: 650,
  MIN_ORDER_AMOUNT: 500,
  MAX_ORDER_AMOUNT: 500000,
  OFFER_VALIDITY_HOURS: 48,
  /** Max applications concurrently in OFFER_PENDING | OFFER_ACCEPTED | DISBURSED | REPAYING per merchant. */
  MAX_CONCURRENT_ACTIVE_APPLICATIONS: 2,
  /** Calendar days after installment due date before status becomes OVERDUE (collections semantics). */
  SNPL_REPAYMENT_GRACE_DAYS: 3,
  LATE_PAYMENT_POLICY_TEXT: "As per selected bank's policy. The selected bank will notify you of any late payment charges and collection process before repayment is due."
};
