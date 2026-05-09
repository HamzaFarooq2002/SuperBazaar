import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Inbox, CheckCircle2, Clock } from 'lucide-react';
import { AppContext } from '../../App';
import api from '../../services/api';
import { BankBrandTile, getBankBrand } from './bankBrands';
import { FacilitatorChip } from './FacilitatorChip';

const ACTIVE_STATUSES = ['OFFER_PENDING', 'OFFER_ACCEPTED', 'DISBURSED', 'REPAYING'];

const statusLabel = (status: string, repaymentStatus?: string) => {
  const labels: Record<string, string> = {
    OFFER_PENDING: 'Awaiting your acceptance',
    OFFER_ACCEPTED: 'Accepted, awaiting disbursement',
    DISBURSED: 'Disbursed by bank',
    REPAYING: repaymentStatus === 'OVERDUE' ? 'Overdue' : 'Repayment active',
    CLOSED: 'Closed',
    REJECTED: 'Rejected by bank policy',
    OFFER_DECLINED: 'Offer declined',
    OFFER_EXPIRED: 'Offer expired'
  };
  return labels[status] || status || 'Unknown';
};

const sortedInstallments = (app: any) =>
  [...(app?.repaymentSchedule || [])].sort(
    (a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

const getOutstanding = (app: any) =>
  sortedInstallments(app)
    .filter((installment: any) => installment.status !== 'PAID')
    .reduce(
      (sum: number, installment: any) =>
        sum + Number(installment.totalDue || 0) - Number(installment.paidAmount || 0),
      0
    );

const formatDateShort = (date: any) =>
  new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

export function BankFinancingDashboard() {
  const { navigateTo } = useContext(AppContext);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.bankFinancing
      .list()
      .then((res) => setApplications(res.data.applications || []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const active = useMemo(
    () => applications.find((app: any) => ACTIVE_STATUSES.includes(app.applicationStatus)),
    [applications]
  );
  const past = useMemo(
    () => applications.filter((app: any) => !ACTIVE_STATUSES.includes(app.applicationStatus)),
    [applications]
  );

  const outstandingTotal = active ? getOutstanding(active) : 0;
  const installments = active ? sortedInstallments(active) : [];
  const paidCount = installments.filter((i: any) => i.status === 'PAID').length;
  const totalCount = installments.length || 1;
  const progressPercent = active ? Math.round((paidCount / totalCount) * 100) : 0;
  const nextInstallment = installments.find((i: any) => i.status !== 'PAID');
  const brand = active ? getBankBrand(active.selectedBank) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Dark gradient hero */}
      <div
        className="px-6 pt-12 pb-8 text-white relative overflow-hidden"
        style={{
          background: brand
            ? `linear-gradient(135deg, #102542 0%, ${brand.color} 100%)`
            : 'linear-gradient(135deg, #102542 0%, #3D8A75 100%)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateTo('payments-main')}
            className="text-white flex items-center gap-1"
            aria-label="Back to payments"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <FacilitatorChip bank={active?.selectedBank} variant="dark" />
        </div>
        <h2 className="text-white text-[24px] font-bold mb-1">Bank Financing</h2>
        <p className="text-white/70 text-sm mb-5">Stock Now Pay Later via Bank</p>

        {active ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <BankBrandTile bank={active.selectedBank} size={48} />
              <div>
                <p className="text-white/70 text-[11px]">Lender</p>
                <p className="text-white font-semibold">{active.selectedBank}</p>
              </div>
            </div>
            <p className="text-white/70 text-xs mb-1">Outstanding balance</p>
            <p className="text-[36px] font-bold tracking-[-0.48px] leading-none mb-4">
              PKR {Math.max(0, outstandingTotal).toLocaleString()}
            </p>

            {installments.length > 0 && (
              <>
                <div className="h-2 rounded-full bg-white/20 overflow-hidden mb-2">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-white/80">
                  <span>
                    {paidCount} of {totalCount} installments paid
                  </span>
                  <span>{progressPercent}%</span>
                </div>
              </>
            )}

            {nextInstallment && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
                  <p className="text-white/70 text-[11px] mb-0.5">Next due</p>
                  <p className="text-white font-semibold text-sm">
                    PKR {Number(nextInstallment.totalDue || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
                  <p className="text-white/70 text-[11px] mb-0.5">By</p>
                  <p className="text-white font-semibold text-sm">{formatDateShort(nextInstallment.dueDate)}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
            <Inbox className="w-10 h-10 text-white/70 mx-auto mb-2" />
            <p className="text-white font-medium mb-1">No active financing</p>
            <p className="text-white/70 text-xs">Apply during checkout to finance your stock purchase via bank.</p>
          </div>
        )}
      </div>

      <div className="px-6 -mt-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : loading ? (
          <div className="space-y-3 pt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <>
            {/* Active application installments */}
            {active && installments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[#102542] font-semibold text-sm">Repayment schedule</p>
                  <span className="text-[11px] text-gray-500">
                    {statusLabel(active.applicationStatus, active.repaymentStatus)}
                  </span>
                </div>
                <div className="relative">
                  {installments.length > 1 && (
                    <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gray-200" />
                  )}
                  <div className="space-y-3">
                    {installments.map((row: any, index: number) => {
                      const isPaid = row.status === 'PAID';
                      const isOverdue = row.status === 'OVERDUE';
                      const isNext = !isPaid && installments.findIndex((i: any) => i.status !== 'PAID') === index;
                      return (
                        <div key={index} className="relative flex gap-4">
                          <div className="relative z-10 flex-shrink-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] ${
                                isPaid
                                  ? 'bg-[#3D8A75] text-white'
                                  : isOverdue
                                  ? 'bg-red-500 text-white'
                                  : isNext
                                  ? 'bg-gradient-to-br from-[#3D8A75] to-[#2d6b5c] text-white shadow-md ring-4 ring-[#3D8A75]/15'
                                  : 'bg-white border-2 border-gray-300 text-gray-500'
                              }`}
                            >
                              {isPaid ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                            </div>
                          </div>
                          <div
                            className={`flex-1 rounded-xl p-3 ${
                              isPaid
                                ? 'bg-gray-50 border border-gray-100 opacity-70'
                                : isOverdue
                                ? 'bg-red-50 border border-red-200'
                                : isNext
                                ? 'bg-[#3D8A75]/10 border border-[#3D8A75]/30'
                                : 'bg-gray-50 border border-gray-100'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p
                                  className={`text-sm font-semibold ${
                                    isPaid ? 'text-gray-500 line-through' : 'text-[#102542]'
                                  }`}
                                >
                                  PKR {Number(row.totalDue || 0).toLocaleString()}
                                </p>
                                <p className="text-[11px] text-gray-500">Due {formatDateShort(row.dueDate)}</p>
                              </div>
                              {isPaid && (
                                <span className="text-[10px] font-bold text-[#3D8A75] bg-white rounded-full px-2 py-0.5 border border-[#3D8A75]/30">
                                  PAID
                                </span>
                              )}
                              {isOverdue && (
                                <span className="text-[10px] font-bold text-red-700 bg-white rounded-full px-2 py-0.5 border border-red-300">
                                  OVERDUE
                                </span>
                              )}
                              {isNext && (
                                <span className="text-[10px] font-bold text-[#3D8A75] bg-white rounded-full px-2 py-0.5 border border-[#3D8A75]/30">
                                  NEXT
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Repay actions */}
            {active && ['DISBURSED', 'REPAYING'].includes(active.applicationStatus) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                {(() => {
                  const nextDue = sortedInstallments(active).find((i: any) => i.status === 'PENDING' || i.status === 'OVERDUE' || i.status === 'PARTIAL');
                  const nextDueIdx = nextDue ? sortedInstallments(active).findIndex((i: any) => i.status === 'PENDING' || i.status === 'OVERDUE' || i.status === 'PARTIAL') : -1;
                  return nextDue ? (
                    <button
                      onClick={() => {
                        sessionStorage.setItem('repayAppId', active._id);
                        if (nextDueIdx >= 0) sessionStorage.setItem('repayAutoSelectIdx', String(nextDueIdx));
                        navigateTo('bank-financing-repay');
                      }}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white font-medium text-sm flex items-center justify-center gap-2"
                    >
                      Pay Next Installment — PKR {Number(nextDue.totalDue - (nextDue.paidAmount || 0)).toLocaleString()}
                    </button>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                      <p className="text-green-800 text-sm font-medium">All installments paid!</p>
                    </div>
                  );
                })()}
                <button
                  onClick={() => {
                    sessionStorage.setItem('repayAppId', active._id);
                    navigateTo('bank-financing-repay');
                  }}
                  className="w-full mt-2 text-[12px] text-[#3D8A75] underline text-center"
                >
                  View all installments &amp; make partial payments
                </button>
              </motion.div>
            )}

            {/* Past applications */}
            {past.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <p className="text-[#102542] font-semibold text-sm mb-3">Past applications</p>
                <div className="space-y-2">
                  {past.map((app: any) => (
                    <div
                      key={app._id}
                      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm"
                    >
                      <BankBrandTile bank={app.selectedBank} size={40} />
                      <div className="flex-1">
                        <p className="text-[#102542] font-semibold text-sm">{app.selectedBank}</p>
                        <p className="text-[11px] text-gray-500">
                          {statusLabel(app.applicationStatus, app.repaymentStatus)} · PKR{' '}
                          {Number(app.approvedAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      {app.applicationStatus === 'CLOSED' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#3D8A75]" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {applications.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">No bank financing applications yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
