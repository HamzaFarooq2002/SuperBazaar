import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { X, ShoppingBag, Home, Receipt, Wallet, User } from 'lucide-react';

export function BNPLApplication() {
  const { navigateTo } = useContext(AppContext);
  const [amount, setAmount] = useState('4000');

  const handleApply = () => {
    // Simulate application process
    navigateTo('bnpl-approved');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigateTo('payments-main')}
            className="flex items-center justify-center w-12 h-12"
          >
            <X className="w-6 h-6 text-[#121417]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#121417]">Checkout</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Hero Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-[28px] font-bold text-[#121417] mb-4">
            You're approved!
          </h2>
          <p className="text-[16px] text-[#121417] leading-relaxed">
            Your purchase is approved with Buy Now, Pay Later. Review your payment plan below.
          </p>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-t border-gray-200 py-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-medium text-[#121417] mb-1">Product Name</p>
              <p className="text-[14px] text-[#3D8A75]">PKR {parseInt(amount).toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Payment Plan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-[18px] font-bold text-[#121417] mb-4">Payment Plan</h3>
          
          <div className="bg-white border-t border-gray-200 py-4">
            <p className="text-[16px] font-medium text-[#121417] mb-1">Buy Now, Pay Later</p>
            <p className="text-[14px] text-[#3D8A75]">
              4 interest-free payments of PKR {(parseInt(amount) / 4).toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Payment Schedule Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-6"
        >
          {[
            { num: 1, date: 'July 15' },
            { num: 2, date: 'August 15' },
            { num: 3, date: 'September 15' },
            { num: 4, date: 'October 15' }
          ].map((payment) => (
            <div key={payment.num} className="border-t border-gray-200 pt-4">
              <p className="text-[14px] text-[#3D8A75] mb-2">Payment {payment.num}</p>
              <p className="text-[14px] text-[#121417]">
                PKR {(parseInt(amount) / 4).toLocaleString()} - Due {payment.date}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <button
          onClick={handleApply}
          className="w-full h-12 bg-[#3D8A75] hover:bg-[#2d6b5c] text-white text-[16px] font-bold rounded-xl transition-colors"
        >
          Confirm & Pay
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex flex-col items-center gap-1"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Home</span>
          </button>
          <button
            onClick={() => navigateTo('invoices')}
            className="flex flex-col items-center gap-1"
          >
            <Receipt className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Invoices</span>
          </button>
          <button
            onClick={() => navigateTo('payments-main')}
            className="flex flex-col items-center gap-1"
          >
            <Wallet className="w-6 h-6 text-[#3D8A75]" />
            <span className="text-[11px] text-[#3D8A75]">Payments</span>
          </button>
          <button
            onClick={() => navigateTo('profile')}
            className="flex flex-col items-center gap-1"
          >
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
