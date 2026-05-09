import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../../App';
import { usePaymentSession } from '../../../contexts/PaymentSessionContext';
import { CheckCircle, Copy } from 'lucide-react';

export function PBBSuccess() {
  const { navigateTo } = useContext(AppContext);
  const { session, resetSession } = usePaymentSession();
  const [copied, setCopied] = React.useState(false);

  const copyTxn = () => {
    if (session.pbbId) {
      navigator.clipboard.writeText(session.pbbId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const isRepay =
    session.intent === 'bank_financing_repay' ||
    sessionStorage.getItem('pbbIntent') === 'bank_financing_repay';

  const clearPbbStorage = () => {
    sessionStorage.removeItem('pbbOrderDraft');
    sessionStorage.removeItem('pbbIntent');
    sessionStorage.removeItem('pbbAmount');
    sessionStorage.removeItem('pbbApplicationId');
    sessionStorage.removeItem('pbbInstallmentIdx');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 text-center max-w-sm w-full">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-[22px] font-bold text-[#102542] mb-1">Payment Successful!</h2>
        <p className="text-[#102542]/60 text-sm mb-6">Your payment has been processed via {session.selectedBankName}</p>

        <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-5 text-white mb-5">
          <p className="text-white/70 text-sm mb-1">Amount Paid</p>
          <p className="text-[28px] font-bold">PKR {session.amount.toLocaleString()}</p>
        </div>

        <div className="bg-white/60 border border-white/70 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-[11px] text-[#102542]/50 mb-0.5">Transaction ID</p>
              <p className="text-[13px] text-[#102542] font-mono font-medium">{session.pbbId}</p>
            </div>
            <button onClick={copyTxn} className="text-[#3D8A75]">
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => { resetSession(); clearPbbStorage(); navigateTo(isRepay ? 'bank-financing-repay-success' : 'order-confirmation'); }} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white font-medium">
            {isRepay ? 'View Repayment Summary' : 'View Order Confirmation'}
          </button>
          <button onClick={() => { resetSession(); clearPbbStorage(); navigateTo('dashboard'); }} className="w-full h-12 rounded-xl border border-gray-200 bg-white text-[#102542] font-medium hover:bg-gray-50 transition-colors">
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
