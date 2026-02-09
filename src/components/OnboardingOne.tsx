import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { CreditCard } from 'lucide-react';

export function OnboardingOne() {
  const { navigateTo } = useContext(AppContext);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="mb-8 flex justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#102542] to-[#3D8A75] flex items-center justify-center">
              <CreditCard className="w-32 h-32 text-white" />
            </div>
          </div>
          <h2 className="text-[#102542] mb-4">Stocknow Paylater</h2>
          <p className="text-gray-600">
            Get instant credit to stock your shop. Buy inventory now and pay later in flexible installments
          </p>
        </motion.div>
      </div>
      
      <div className="px-6 pb-8">
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-8 h-2 rounded-full bg-[#3D8A75]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
        <button
          onClick={() => navigateTo('onboarding2')}
          className="w-full py-4 rounded-xl bg-[#3D8A75] text-white transition-all hover:bg-[#2d6a5c]"
        >
          Next
        </button>
        <button
          onClick={() => navigateTo('login')}
          className="w-full py-4 text-gray-600 mt-2"
        >
          Skip
        </button>
      </div>
    </div>
  );
}