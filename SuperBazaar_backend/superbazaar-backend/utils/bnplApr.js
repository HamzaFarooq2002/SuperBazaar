const creditConfig = require('../config/creditConfig');

/**
 * Simple effective APR for flat fee at end of term: feeRate * (365 / tenureDays).
 * feeRate is markup as a fraction of principal (e.g. 0.01 = 1%).
 */
const effectiveAprDecimal = (markupRate, tenureDays) => {
  const r = Number(markupRate || 0);
  const d = Math.max(1, Number(tenureDays || 1));
  return r * (365 / d);
};

const maxAprDecimal = () => {
  const pct = Number(creditConfig.BNPL.MAX_APR_PERCENT ?? 36);
  return Math.max(0, pct) / 100;
};

/**
 * @returns {{ ok: boolean, apr: number, maxApr: number, tenureDays: number }}
 */
const validateBnplApr = ({ markupRate, tenureDays }) => {
  const maxApr = maxAprDecimal();
  const apr = effectiveAprDecimal(markupRate, tenureDays);
  return {
    ok: apr <= maxApr + Number.EPSILON,
    apr,
    maxApr,
    tenureDays: Number(tenureDays || 0)
  };
};

/**
 * Validates both tenure options for a tier rate card entry.
 */
const tierRatesWithinAprCap = (rates) => {
  if (!rates?.eligible) return { ok: true, ok7: true, ok14: true };
  const d7 = validateBnplApr({ markupRate: rates.day7, tenureDays: 7 });
  const d14 = validateBnplApr({ markupRate: rates.day14, tenureDays: 14 });
  return { ok: d7.ok && d14.ok, ok7: d7.ok, ok14: d14.ok, apr7: d7.apr, apr14: d14.apr };
};

module.exports = {
  effectiveAprDecimal,
  maxAprDecimal,
  validateBnplApr,
  tierRatesWithinAprCap
};
