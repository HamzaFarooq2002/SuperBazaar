const Order = require('../models/Order');
const BankFinancingApplication = require('../models/BankFinancingApplication');
const bankFinancingConfig = require('../config/bankFinancingConfig');

const snplGraceDays = Math.max(0, Number(bankFinancingConfig.SNPL_REPAYMENT_GRACE_DAYS || 0));

const runReminderJob = async () => {
  const now = new Date();
  const orders = await Order.find({
    paymentMethod: 'bnpl',
    paymentStatus: { $in: ['pending', 'partially_paid'] },
    'bnplDetails.outstandingPrincipal': { $gt: 0 }
  });
  for (const order of orders) {
    if (!order.bnplDetails?.dueDate) continue;
    const diffDays = Math.floor((new Date(order.bnplDetails.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    order.internalNotes = `BNPL_STATUS:${diffDays <= 0 ? 'DUE_OR_OVERDUE' : 'ACTIVE'}`;
    await order.save();
  }

  const bankApplications = await BankFinancingApplication.find({
    applicationStatus: { $in: ['DISBURSED', 'REPAYING'] },
    repaymentStatus: { $in: ['ACTIVE', 'OVERDUE'] }
  });

  for (const application of bankApplications) {
    const nextDueInstallment = application.repaymentSchedule
      .filter((installment) => installment.status !== 'PAID')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    if (!nextDueInstallment) {
      application.repaymentStatus = 'COMPLETED';
      application.applicationStatus = 'CLOSED';
      await application.save();
      continue;
    }

    const diffDays = Math.floor((new Date(nextDueInstallment.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysPastDue = -diffDays;
    let nextReminderStatus = 'ACTIVE';
    if (daysPastDue > snplGraceDays) nextReminderStatus = 'OVERDUE';
    else if (diffDays <= 0) nextReminderStatus = 'DUE_OR_IN_GRACE';

    application.eligibilitySnapshot = {
      ...(application.eligibilitySnapshot || {}),
      nextReminderStatus,
      nextDueInDays: diffDays
    };
    await application.save();
  }
};

module.exports = { runReminderJob };
