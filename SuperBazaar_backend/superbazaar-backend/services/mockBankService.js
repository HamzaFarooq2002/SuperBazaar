const bankFinancingConfig = require('../config/bankFinancingConfig');
const { randomUUID } = require('crypto');
const { generateRepaymentSchedule } = require('../utils/bankFinancingSchedule');

const round = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

const toRiskTier = (score) => {
  const s = Number(score || 0);
  if (s >= 750) return 'Excellent';
  if (s >= 700) return 'Good';
  if (s >= 650) return 'Fair';
  return 'Poor';
};

const buildApplicationId = () => `BAPP-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

const buildOfferPricing = ({ tier, requestedAmount, selectedBank }) => {
  const tierConfig = bankFinancingConfig.TIER_PRICING[tier] || bankFinancingConfig.TIER_PRICING.Poor;
  if (!tierConfig.eligible) {
    return {
      approved: false,
      reason: 'Rejected due to risk tier'
    };
  }

  const approvedAmount = round(requestedAmount);
  const bankAdjustment = Number(bankFinancingConfig.BANK_PRICING[selectedBank]?.spreadAdjustmentPercent || 0);
  const spreadPercent = round(Number(tierConfig.spreadPercent || 0) + bankAdjustment);
  const annualMarkupRatePercent = round(bankFinancingConfig.KIBOR_3M_PERCENT + spreadPercent);
  const processingFee = round(approvedAmount * bankFinancingConfig.PROCESSING_FEE_RATE);

  return {
    approved: true,
    approvedAmount,
    kibor3mPercent: bankFinancingConfig.KIBOR_3M_PERCENT,
    spreadPercent,
    annualMarkupRatePercent,
    tenureOptionsDays: tierConfig.tenureOptionsDays,
    processingFeeRate: bankFinancingConfig.PROCESSING_FEE_RATE,
    processingFee
  };
};

const approveApplication = ({ merchantRiskTier, requestedAmount, selectedBank }) => {
  const tier = merchantRiskTier || toRiskTier(0);
  const offer = buildOfferPricing({ tier, requestedAmount, selectedBank });

  if (!offer.approved) {
    return {
      approved: false,
      bankApplicationId: buildApplicationId(),
      selectedBank,
      reason: offer.reason
    };
  }

  const offerExpiry = new Date();
  offerExpiry.setHours(offerExpiry.getHours() + bankFinancingConfig.OFFER_VALIDITY_HOURS);

  return {
    approved: true,
    bankApplicationId: buildApplicationId(),
    selectedBank,
    approvedAmount: offer.approvedAmount,
    kibor3mPercent: offer.kibor3mPercent,
    spreadPercent: offer.spreadPercent,
    annualMarkupRatePercent: offer.annualMarkupRatePercent,
    processingFeeRate: offer.processingFeeRate,
    tenureOptionsDays: offer.tenureOptionsDays,
    processingFee: offer.processingFee,
    latePaymentPolicy: bankFinancingConfig.LATE_PAYMENT_POLICY_TEXT,
    offerExpiry
  };
};

const disburseFunds = ({ applicationId }) => ({
  disbursed: true,
  bankApplicationId: applicationId,
  disbursedAt: new Date()
});

module.exports = {
  toRiskTier,
  approveApplication,
  generateRepaymentSchedule,
  disburseFunds
};
