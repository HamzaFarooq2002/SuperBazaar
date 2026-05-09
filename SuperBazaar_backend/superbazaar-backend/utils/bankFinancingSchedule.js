/**
 * Stock Now Pay Later (bank financing) repayment schedule.
 * Flat markup uses exact tenure days; installment due dates are spaced across that tenor
 * (not fixed 30-day steps that extend past the financed period).
 */

const round = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

const addDays = (base, days) => {
  const d = new Date(base);
  d.setDate(d.getDate() + Math.round(Number(days)));
  return d;
};

/**
 * @param {object} params
 * @param {number} params.approvedAmount
 * @param {number} params.annualMarkupRatePercent - nominal annual % (e.g. 14.76)
 * @param {number} params.tenureDays
 * @param {number} [params.processingFee]
 * @param {Date|string|number} [params.baseDate] - anchor for first due offset (default: now)
 * @returns {{ markupAmount: number, totalRepayable: number, schedule: Array<{ dueDate: Date, principalAmount: number, markupAmount: number, processingFeeAmount: number, totalDue: number, status: string }> }}
 */
const generateRepaymentSchedule = ({
  approvedAmount,
  annualMarkupRatePercent,
  tenureDays,
  processingFee = 0,
  baseDate = new Date()
}) => {
  const principal = Number(approvedAmount || 0);
  const annualRate = Number(annualMarkupRatePercent || 0) / 100;
  const tenure = Math.max(0, Number(tenureDays || 0));
  const markupAmount = round(principal * annualRate * (tenure / 365));
  const fee = Number(processingFee || 0);
  const totalRepayable = round(principal + markupAmount + fee);

  const installmentCount = Math.max(1, Math.ceil(tenure / 30));
  const basePrincipal = round(principal / installmentCount);
  const baseMarkup = round(markupAmount / installmentCount);
  const baseProcessingFee = round(fee / installmentCount);

  const schedule = [];
  let allocatedPrincipal = 0;
  let allocatedMarkup = 0;
  let allocatedProcessingFee = 0;
  const anchor = baseDate instanceof Date ? baseDate : new Date(baseDate);

  for (let i = 1; i <= installmentCount; i += 1) {
    const isLast = i === installmentCount;
    const dueOffsetDays = isLast ? tenure : Math.ceil((tenure * i) / installmentCount);
    const dueDate = addDays(anchor, dueOffsetDays);

    const principalAmount = isLast ? round(principal - allocatedPrincipal) : basePrincipal;
    const installmentMarkup = isLast ? round(markupAmount - allocatedMarkup) : baseMarkup;
    const processingFeeAmount = isLast ? round(fee - allocatedProcessingFee) : baseProcessingFee;

    allocatedPrincipal = round(allocatedPrincipal + principalAmount);
    allocatedMarkup = round(allocatedMarkup + installmentMarkup);
    allocatedProcessingFee = round(allocatedProcessingFee + processingFeeAmount);

    schedule.push({
      dueDate,
      principalAmount,
      markupAmount: installmentMarkup,
      processingFeeAmount,
      totalDue: round(principalAmount + installmentMarkup + processingFeeAmount),
      status: 'PENDING'
    });
  }

  return { markupAmount, totalRepayable, schedule };
};

module.exports = { generateRepaymentSchedule, round, addDays };
