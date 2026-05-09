/** Mirrors backend `utils/bankFinancingSchedule.js` for SNPL offer preview. */

export const round = (value: number) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + Math.round(days));
  return d;
};

export type ScheduleRow = {
  dueDate: Date;
  principalAmount: number;
  markupAmount: number;
  processingFeeAmount: number;
  totalDue: number;
};

export function generateRepaymentSchedulePreview(params: {
  approvedAmount: number;
  annualMarkupRatePercent: number;
  tenureDays: number;
  processingFee?: number;
  baseDate?: Date;
}): { markupAmount: number; totalRepayable: number; schedule: ScheduleRow[] } {
  const {
    approvedAmount,
    annualMarkupRatePercent,
    tenureDays,
    processingFee = 0,
    baseDate = new Date()
  } = params;

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

  const schedule: ScheduleRow[] = [];
  let allocatedPrincipal = 0;
  let allocatedMarkup = 0;
  let allocatedProcessingFee = 0;

  for (let i = 1; i <= installmentCount; i += 1) {
    const isLast = i === installmentCount;
    const dueOffsetDays = isLast ? tenure : Math.ceil((tenure * i) / installmentCount);
    const dueDate = addDays(baseDate, dueOffsetDays);

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
      totalDue: round(principalAmount + installmentMarkup + processingFeeAmount)
    });
  }

  return { markupAmount, totalRepayable, schedule };
}
