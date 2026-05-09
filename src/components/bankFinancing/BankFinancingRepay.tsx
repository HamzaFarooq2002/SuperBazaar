import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function BankFinancingRepay() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('repayAppId');
    if (!raw) { navigateTo('bank-financing-dashboard'); return; }
    api.bankFinancing.get(raw).then((res: any) => {
      const application = res.data?.application || res.data;
      setApp(application);
      const autoIdx = sessionStorage.getItem('repayAutoSelectIdx');
      if (autoIdx !== null) {
        const idx = Number(autoIdx);
        const sched = application?.repaymentSchedule || [];
        if (sched[idx]) {
          const remaining = Number(sched[idx].totalDue || 0) - Number(sched[idx].paidAmount || 0);
          setSelectedIdx(idx);
          setAmount(String(remaining));
        }
        sessionStorage.removeItem('repayAutoSelectIdx');
      }
      setLoading(false);
    }).catch(() => { navigateTo('bank-financing-dashboard'); });
  }, []);

  const schedule = app?.repaymentSchedule || [];
  const pendingInstallments = schedule
    .map((inst: any, idx: number) => ({ ...inst, idx }))
    .filter((inst: any) => inst.status === 'PENDING' || inst.status === 'OVERDUE' || inst.status === 'PARTIAL');

  const selected = selectedIdx !== null ? schedule[selectedIdx] : null;
  const installmentDue = selected ? Number(selected.totalDue || 0) - Number(selected.paidAmount || 0) : 0;
  const minPayment = Math.ceil(installmentDue * 0.10);
  const numAmount = Number(amount || 0);

  const validateAmount = (val: string) => {
    const n = Number(val);
    if (!val || n <= 0) { setAmountError(''); return; }
    if (n < minPayment) setAmountError(`Minimum payment is PKR ${minPayment.toLocaleString()}`);
    else if (n > installmentDue) setAmountError(`Cannot exceed PKR ${installmentDue.toLocaleString()}`);
    else setAmountError('');
  };

  const handleProceed = () => {
    if (!selected || !amount || amountError) return;
    sessionStorage.setItem('repayInstallmentIdx', String(selectedIdx));
    sessionStorage.setItem('repayAmount', amount);
    navigateTo('bank-financing-repay-method');
  };

  const statusIcon = (status: string) => {
    if (status === 'PAID') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'OVERDUE') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (status === 'PARTIAL') return <Clock className="w-4 h-4 text-amber-500" />;
    return <Calendar className="w-4 h-4 text-blue-500" />;
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-36">
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4">
        <div className="h-5 w-40 bg-white/50 rounded animate-pulse" />
      </div>
      <div className="px-6 pt-5 space-y-3">
        <div className="h-20 bg-white/40 rounded-2xl animate-pulse" />
        <div className="h-4 w-32 bg-white/40 rounded animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-white/40 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (schedule.length > 0 && pendingInstallments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-[22px] font-bold text-[#102542] mb-2">All Installments Paid!</h2>
        <p className="text-[#102542]/60 text-sm mb-6">This financing application is fully repaid and closed.</p>
        <button onClick={() => navigateTo('bank-financing-dashboard')} className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white font-medium">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-36">
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('bank-financing-dashboard')} className="text-[#102542]"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-[16px] font-semibold text-[#102542]">Make a Repayment</h1>
            {app?.selectedBank && <p className="text-[12px] text-[#102542]/60">{app.selectedBank} · {app.applicationId}</p>}
          </div>
        </div>
      </div>

      <div className="px-6 pt-5">
        {/* Summary card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-5 text-white mb-5">
          <p className="text-white/70 text-sm">Total Remaining Due</p>
          <p className="text-[28px] font-bold">PKR {(schedule.filter((i: any) => i.status !== 'PAID').reduce((s: number, i: any) => s + Number(i.totalDue || 0) - Number(i.paidAmount || 0), 0)).toLocaleString()}</p>
        </motion.div>

        {/* Schedule */}
        <p className="text-[#102542] font-medium mb-3">Repayment Schedule</p>
        {schedule.some((i: any) => i.installmentType === 'PARTIAL_REMAINDER') && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
            <p className="text-amber-800 text-[11px] leading-relaxed">
              <span className="font-semibold">Remainder installments</span> (marked "Remainder") were created automatically when a previous installment was partially paid. They share the same due date as the original.
            </p>
          </div>
        )}
        <div className="space-y-3 mb-5">
          {schedule.map((inst: any, idx: number) => {
            const remaining = Number(inst.totalDue || 0) - Number(inst.paidAmount || 0);
            const isPaid = inst.status === 'PAID';
            return (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                onClick={() => { if (!isPaid) { setSelectedIdx(idx); setAmount(String(remaining)); validateAmount(String(remaining)); } }}
                className={`bg-white/50 border rounded-xl p-4 cursor-pointer transition-all ${isPaid ? 'opacity-50 cursor-not-allowed border-white/40' : selectedIdx === idx ? 'ring-2 ring-[#3D8A75] border-transparent bg-white/70' : 'border-white/60 hover:bg-white/70'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {statusIcon(inst.status)}
                    <div>
                      <p className="text-[13px] font-medium text-[#102542]">
                        Installment {idx + 1}
                        {inst.installmentType === 'PARTIAL_REMAINDER' && (
                          <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full" title="Created automatically from a previous partial payment">Remainder</span>
                        )}
                      </p>
                      <p className="text-[11px] text-[#102542]/60">{new Date(inst.dueDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[14px] font-semibold ${isPaid ? 'text-green-600' : inst.status === 'OVERDUE' ? 'text-red-600' : 'text-[#102542]'}`}>
                      PKR {Number(inst.totalDue || 0).toLocaleString()}
                    </p>
                    {Number(inst.paidAmount || 0) > 0 && !isPaid && (
                      <p className="text-[11px] text-amber-600">PKR {Number(inst.paidAmount).toLocaleString()} paid</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Amount input */}
        {selectedIdx !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 border border-white/70 rounded-2xl p-5 mb-4">
            <div className="flex justify-between mb-3">
              <button onClick={() => { setAmount(String(minPayment)); validateAmount(String(minPayment)); }} className={`flex-1 mr-2 py-2 rounded-lg text-[13px] font-medium border transition-all ${numAmount === minPayment ? 'bg-[#3D8A75] text-white border-transparent' : 'border-gray-200 text-[#102542] bg-white/60'}`}>
                Min (PKR {minPayment.toLocaleString()})
              </button>
              <button onClick={() => { setAmount(String(installmentDue)); validateAmount(String(installmentDue)); }} className={`flex-1 ml-2 py-2 rounded-lg text-[13px] font-medium border transition-all ${numAmount === installmentDue ? 'bg-[#3D8A75] text-white border-transparent' : 'border-gray-200 text-[#102542] bg-white/60'}`}>
                Full (PKR {installmentDue.toLocaleString()})
              </button>
            </div>
            <label className="block text-[12px] text-[#102542]/60 mb-1.5">Payment Amount (PKR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); validateAmount(e.target.value); }}
              placeholder={`${minPayment} – ${installmentDue}`}
              className="w-full h-12 px-4 rounded-xl border border-[#e0e0e0] bg-white text-[15px] text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
            />
            {amountError && <p className="text-red-500 text-[11px] mt-1">{amountError}</p>}
            {numAmount > 0 && numAmount < installmentDue && !amountError && (
              <p className="text-amber-600 text-[11px] mt-1">Partial payment — PKR {(installmentDue - numAmount).toLocaleString()} will remain due on the same date.</p>
            )}
          </motion.div>
        )}
        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4"><p className="text-red-600 text-sm">{error}</p></div>}
      </div>

      {selectedIdx !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
          <button
            onClick={handleProceed}
            disabled={!amount || !!amountError || numAmount <= 0}
            className={`w-full h-12 rounded-xl text-white font-medium transition-all ${amount && !amountError && numAmount > 0 ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c]' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Continue — Pay PKR {numAmount > 0 ? numAmount.toLocaleString() : '—'}
          </button>
        </div>
      )}
    </div>
  );
}
