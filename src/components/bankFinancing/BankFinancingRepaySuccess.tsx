import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../App';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';

export function BankFinancingRepaySuccess() {
  const { navigateTo } = useContext(AppContext);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('repayResult');
    if (raw) { try { setResult(JSON.parse(raw)); } catch {} }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 text-center max-w-sm w-full">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-[22px] font-bold text-[#102542] mb-2">Payment Successful!</h2>
        {result && (
          <div className="space-y-3 mb-6">
            <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-xl p-4 text-white text-left">
              <p className="text-white/70 text-xs mb-1">Amount Paid</p>
              <p className="text-[22px] font-bold">PKR {Number(result.amountPaid || 0).toLocaleString()}</p>
            </div>
            {result.isPartial && result.remainderCreated && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-amber-800 text-xs leading-relaxed">
                  Partial payment — PKR {Number(result.remainderCreated.amount || 0).toLocaleString()} still due on{' '}
                  {result.remainderCreated.dueDate ? new Date(result.remainderCreated.dueDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : 'same date'}.
                </p>
              </div>
            )}
            {result.transactionId && (
              <p className="text-[11px] text-gray-400">Txn ID: {result.transactionId}</p>
            )}
            {result.remainingDue > 0 && (
              <p className="text-sm text-[#102542]/70">Remaining due: PKR {Number(result.remainingDue).toLocaleString()}</p>
            )}
            {result.applicationStatus === 'CLOSED' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-800 text-sm font-medium">Financing fully repaid! Application closed.</p>
              </div>
            )}
          </div>
        )}
        <button onClick={() => navigateTo('bank-financing-dashboard')} className="w-full h-12 rounded-xl border border-gray-200 bg-white text-[#102542] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          Back to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
        {result && result.applicationStatus !== 'CLOSED' && (
          <button
            onClick={() => navigateTo('bank-financing-repay')}
            className="w-full h-12 rounded-xl border border-[#3D8A75]/40 text-[#3D8A75] font-medium text-sm bg-white/60 hover:bg-white/80 transition-colors"
          >
            View Updated Schedule
          </button>
        )}
      </motion.div>
    </div>
  );
}
