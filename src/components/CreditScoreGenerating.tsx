import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { Shield, Check } from 'lucide-react';
import api from '../services/api';

export function CreditScoreGenerating() {
  const { navigateTo } = useContext(AppContext);
  const hasCalledAPI = useRef(false);

  const steps = [
    { label: 'Verifying identity', delay: 0 },
    { label: 'Analyzing payment history', delay: 1 },
    { label: 'Checking credit utilization', delay: 2 },
    { label: 'Evaluating business profile', delay: 3 },
    { label: 'Calculating final score', delay: 4 }
  ];

  useEffect(() => {
    if (hasCalledAPI.current) return;
    hasCalledAPI.current = true;

    const startTime = Date.now();

    const runScoring = async () => {
      try {
        const response = await api.credit.generateCreditScore();
        if (response.success && response.data) {
          sessionStorage.setItem('creditScoreData', JSON.stringify(response.data));
        }
      } catch (err) {
        console.error('Credit scoring failed:', err);
        sessionStorage.removeItem('creditScoreData');
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 5500 - elapsed);
        setTimeout(() => navigateTo('credit-score-result'), remaining);
      }
    };

    runScoring();
  }, [navigateTo]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden flex items-center justify-center">
      {/* Animated Background Circles */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[300px] h-[300px] rounded-full bg-[#3D8A75] blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute w-[250px] h-[250px] rounded-full bg-[#102542] blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 px-6 w-full max-w-[400px]">
        {/* Central Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            {/* Rotating Border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-[120px] h-[120px] rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #3D8A75, #102542, #3D8A75)',
                padding: '3px'
              }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4]" />
            </motion.div>
            
            {/* Icon */}
            <div className="relative w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center shadow-xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-[24px] text-[#102542] mb-2">
            Generating Your Score
          </h2>
          <p className="text-[13px] text-[#102542] opacity-70">
            Please wait while we analyze your business profile
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="space-y-3 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: step.delay + 0.3, type: 'spring' }}
                className={`w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.delay < 4 
                    ? 'bg-gradient-to-br from-[#3D8A75] to-[#2d6b5c]' 
                    : 'bg-white/50 backdrop-blur-sm border border-white/60'
                }`}
              >
                {step.delay < 4 ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: step.delay + 0.5 }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-2 border-[#3D8A75] border-t-transparent rounded-full"
                  />
                )}
              </motion.div>
              
              <div className="flex-1 bg-white/40 backdrop-blur-sm border border-white/60 rounded-[8px] p-3">
                <p className={`text-[12px] transition-all ${
                  step.delay < 4 
                    ? 'text-[#102542] opacity-70' 
                    : 'text-[#102542] font-medium'
                }`}>
                  {step.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-full h-[8px] overflow-hidden"
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#3D8A75] to-[#102542] rounded-full"
          />
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[11px] text-[#102542] opacity-60 text-center mt-6"
        >
          This usually takes 5-10 seconds. Thank you for your patience!
        </motion.p>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-[#102542]/40 bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}
