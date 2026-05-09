import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../../App';
import { usePaymentSession } from '../../../contexts/PaymentSessionContext';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export function PBBFailure() {
  const { navigateTo } = useContext(AppContext);
  const { session, resetSession, setSession } = usePaymentSession();

  const isRepay = session.intent === 'bank_financing_repay';

  const handleRetry = () => {
    setSession((prev) => ({ ...prev, status: 'idle', sessionId: null, pbbId: null, selectedBank: null, selectedBankName: null, failureReason: null }));
    navigateTo('pbb-bank-select');
  };

  const handleOtherMethod = () => {
    resetSession();
    navigateTo(isRepay ? 'bank-financing-repay-method' : 'payment-method');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 text-center max-w-sm w-full">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-[22px] font-bold text-[#102542] mb-1">Payment Failed</h2>
        <p className="text-[#102542]/60 text-sm mb-6">{session.failureReason || 'Transaction declined'}</p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-left">
          <p className="text-red-800 text-sm font-medium mb-1">What happened?</p>
          <p className="text-red-700 text-xs leading-relaxed">
            {session.failureReason === 'Insufficient funds' && 'Your bank account does not have enough balance to complete this transaction.'}
            {session.failureReason === 'Account locked' && 'Your bank account has been temporarily locked due to too many incorrect PIN attempts.'}
            {session.failureReason === 'Transaction declined' && 'Your bank declined this transaction. This could be due to security policies or account restrictions.'}
            {!['Insufficient funds', 'Account locked', 'Transaction declined'].includes(session.failureReason || '') && 'An unexpected error occurred with your bank. Please try again or use a different payment method.'}
          </p>
        </div>

        <div className="space-y-3">
          <button onClick={handleRetry} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#102542] to-[#3D8A75] text-white font-medium flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Different Bank
          </button>
          <button onClick={handleOtherMethod} className="w-full h-12 rounded-xl border border-gray-200 bg-white text-[#102542] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Choose Different Method
          </button>
        </div>
      </motion.div>
    </div>
  );
}
