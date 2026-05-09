import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, XCircle, TrendingUp } from 'lucide-react';
import { AppContext } from '../../App';
import { FacilitatorChip } from './FacilitatorChip';

export function BankFinancingRejected() {
  const { navigateTo } = useContext(AppContext);
  const rejection = JSON.parse(sessionStorage.getItem('bankFinancingRejected') || '{}');
  const reasons = rejection?.reasons || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex flex-col">
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigateTo('payment-method')}
            className="text-[#102542] flex items-center gap-1"
            aria-label="Back to payment method"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542] text-lg font-medium">Application not approved</p>
        </div>
        <FacilitatorChip />
      </div>

      <div className="flex-1 px-6 pt-8 pb-32 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-red-100 border-4 border-white flex items-center justify-center mb-5 shadow-md"
        >
          <XCircle className="w-12 h-12 text-red-500" strokeWidth={2} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[#102542] text-[20px] font-bold mb-2 text-center"
        >
          Bank could not approve this application
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 text-center mb-6 max-w-sm"
        >
          The selected bank declined this Stock Now Pay Later request under their current credit policy.
          SuperBazaar is not the lender — only the facilitator.
        </motion.p>

        {reasons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-6 shadow-sm"
          >
            <p className="text-[#102542] font-semibold text-sm mb-3">Why it was declined</p>
            <div className="space-y-2">
              {reasons.map((reason: any, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{reason?.message || reason?.code || String(reason)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full space-y-3"
        >
          <button
            onClick={() => navigateTo('credit-score-result')}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Improve credit profile
          </button>
          <button
            onClick={() => navigateTo('bank-financing-select')}
            className="w-full h-12 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Try a different bank
          </button>
        </motion.div>
      </div>
    </div>
  );
}
