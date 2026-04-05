import React, { useContext, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';

export function OpenBankingProcessing() {
  const { navigateTo } = useContext(AppContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('open-banking-enabled');
    }, 5500);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  const steps = [
    'Connecting to your bank securely',
    'Retrieving transaction and payment data',
    'Analyzing spending habits and cashflow',
    'Updating your financing profile'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/70 border border-white/60 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-[20px] text-[#102542] font-bold text-center mb-2">Enabling Open Banking</h2>
          <p className="text-[13px] text-[#61758a] text-center mb-6">
            We are securely retrieving your banking insights.
          </p>

          <div className="space-y-3 mb-5">
            {steps.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.35 }}
                className="flex items-center gap-3 bg-white/70 rounded-xl p-3"
              >
                <div className="w-5 h-5 rounded-full border-2 border-[#3D8A75] border-t-transparent animate-spin" />
                <p className="text-[12px] text-[#102542]">{step}</p>
              </motion.div>
            ))}
          </div>

          <div className="h-2 rounded-full bg-white/60 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5.2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-[#3D8A75] to-[#102542]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
