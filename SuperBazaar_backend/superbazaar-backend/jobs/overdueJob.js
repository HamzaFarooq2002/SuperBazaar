const Order = require('../models/Order');
const BankFinancingApplication = require('../models/BankFinancingApplication');
const creditConfig = require('../config/creditConfig');
const bankFinancingConfig = require('../config/bankFinancingConfig');

const SNPL_GRACE_MS =
  Math.max(0, Number(bankFinancingConfig.SNPL_REPAYMENT_GRACE_DAYS || 0)) * 24 * 60 * 60 * 1000;

const runOverdueJob = async () => {
  const now = new Date();
  const orders = await Order.find({
    paymentMethod: 'bnpl',
    paymentStatus: { $in: ['pending', 'partially_paid'] },
    'bnplDetails.outstandingPrincipal': { $gt: 0 }
  });
  for (const order of orders) {
    if (!order.bnplDetails?.dueDate) continue;
    const diffDays = Math.floor((now.getTime() - new Date(order.bnplDetails.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 3) {
      const outstandingPrincipal = Number(order.bnplDetails.outstandingPrincipal || 0);
      order.bnplDetails.lateFee = outstandingPrincipal * creditConfig.BNPL.LATE_FEE_RATE;
    }
    if (diffDays >= 7 && !order.bnplDetails.blockedAt) {
      order.bnplDetails.blockedAt = now;
    }
    if (diffDays >= 30 && !order.bnplDetails.recoveryAt) {
      order.bnplDetails.recoveryAt = now;
    }
    await order.save();
  }

  const bankApplications = await BankFinancingApplication.find({
    applicationStatus: { $in: ['DISBURSED', 'REPAYING'] },
    repaymentStatus: { $in: ['ACTIVE', 'OVERDUE'] },
    'repaymentSchedule.status': { $in: ['PENDING', 'OVERDUE'] }
  });

  for (const application of bankApplications) {
    let hasOverdueInstallment = false;
    let hasPendingInstallment = false;

    application.repaymentSchedule = application.repaymentSchedule.map((installment) => {
      if (installment.status === 'PAID') return installment;
      const dueDate = installment.dueDate ? new Date(installment.dueDate) : null;
      const overdueThreshold = dueDate ? new Date(dueDate.getTime() + SNPL_GRACE_MS) : null;
      if (overdueThreshold && now >= overdueThreshold) {
        installment.status = 'OVERDUE';
        hasOverdueInstallment = true;
      } else {
        hasPendingInstallment = true;
      }
      return installment;
    });

    if (hasOverdueInstallment) {
      application.repaymentStatus = 'OVERDUE';
      application.applicationStatus = 'REPAYING';
    } else if (hasPendingInstallment) {
      application.repaymentStatus = 'ACTIVE';
    } else {
      application.repaymentStatus = 'COMPLETED';
      application.applicationStatus = 'CLOSED';
    }

    await application.save();
  }
};

module.exports = { runOverdueJob };
