import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ShoppingBag } from 'lucide-react';

export function OnboardingTwo() {
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
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center">
              <ShoppingBag className="w-32 h-32 text-white" />
            </div>
          </div>
          <h2 className="text-[#102542] mb-4">Shop from Wholesale Market</h2>
          <p className="text-gray-600">
            Browse thousands of products from verified suppliers and order inventory for your shop with instant credit approval
          </p>
        </motion.div>
      </div>
      
      <div className="px-6 pb-8">
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-8 h-2 rounded-full bg-[#3D8A75]"></div>
        </div>
        <button
          onClick={() => navigateTo('signup')}
          className="w-full py-4 rounded-xl bg-[#3D8A75] text-white transition-all hover:bg-[#2d6a5c]"
        >
          Get Started
        </button>
        <button
          onClick={() => navigateTo('login')}
          className="w-full py-4 text-gray-600 mt-2"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}