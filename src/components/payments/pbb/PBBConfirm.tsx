import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../../App';
import { usePaymentSession } from '../../../contexts/PaymentSessionContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export function PBBConfirm() {
  const { navigateTo } = useContext(AppContext);
  const { session, setSession } = usePaymentSession();
  const [consented, setConsented] = useState(false);

  if (!session.sessionId) { navigateTo('pbb-bank-select'); return null; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-32">
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('pbb-login')} className="text-[#102542]"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-[16px] font-semibold text-[#102542]">Confirm Payment</h1>
        </div>
      </div>

      <div className="px-6 pt-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 border border-white/70 rounded-2xl p-5 mb-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-[#102542]/60 text-sm">Bank</span>
            <span className="text-[#102542] font-medium text-sm">{session.selectedBankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#102542]/60 text-sm">Transaction ID</span>
            <span className="text-[#102542] font-medium text-sm font-mono">{session.pbbId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#102542]/60 text-sm">Beneficiary</span>
            <span className="text-[#102542] font-medium text-sm">SuperBazaar</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="text-[#102542] font-semibold">Total Amount</span>
            <span className="text-[#3D8A75] text-[20px] font-bold">PKR {session.amount.toLocaleString()}</span>
          </div>
        </motion.div>

        <motion.label initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-start gap-3 bg-white/50 border border-white/60 rounded-xl p-4 cursor-pointer mb-5">
          <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} className="mt-0.5 accent-[#3D8A75] w-4 h-4 flex-shrink-0" />
          <p className="text-[12px] text-[#102542]/70 leading-relaxed">
            I authorize this payment of <strong>PKR {session.amount.toLocaleString()}</strong> from my {session.selectedBankName} account to SuperBazaar. This payment will be debited from your account once confirmed.
          </p>
        </motion.label>

        <div className="flex items-center gap-2 text-[11px] text-[#102542]/50">
          <ShieldCheck className="w-4 h-4 text-[#3D8A75]" />
          <span>Secured by {session.selectedBankName} · Powered by SuperBazaar Pay</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button
          onClick={() => { if (consented) { setSession((prev) => ({ ...prev, status: 'processing' })); navigateTo('pbb-processing'); } }}
          disabled={!consented}
          className={`w-full h-12 rounded-xl text-white font-medium transition-all ${consented ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c]' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}
