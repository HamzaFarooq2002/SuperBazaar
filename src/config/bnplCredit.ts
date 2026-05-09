/**
 * Mirrors backend `SuperBazaar_backend/superbazaar-backend/config/creditConfig.js` → BNPL.
 * Update both when changing BNPL tiers or minimum score.
 */
export const BNPL_MIN_SCORE = 650;

export const BNPL_TIER_RATE_CARD = {
  Excellent: { day7: 0, day14: 0 },
  Good: { day7: 0.0065, day14: 0.013 },
  Fair: { day7: 0.0055, day14: 0.011 }
} as const;

function formatMarkupFractionAsPct(fraction: number): string {
  if (fraction === 0) return '0%';
  const pct = fraction * 100;
  const rounded = Math.round(pct * 100) / 100;
  const text = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(2).replace(/\.?0+$/, '');
  return `${text}%`;
}

/** Human-readable line for the credit score screen (matches server fee fractions). */
export function bnplMarkupLine(tenure: 'day7' | 'day14', label: string): string {
  const segments = (Object.entries(BNPL_TIER_RATE_CARD) as [string, { day7: number; day14: number }][]).map(
    ([tier, rates]) => `${tier} ${formatMarkupFractionAsPct(rates[tenure])}`
  );
  return `${label}: ${segments.join(', ')}`;
}
