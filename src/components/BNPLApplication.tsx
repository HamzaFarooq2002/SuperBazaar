import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { X, ShoppingBag, Home, Receipt, Wallet, User } from 'lucide-react';

export function BNPLApplication() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';
  const [amount, setAmount] = useState('4000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    const purchaseAmount = parseInt(amount);
    if (!purchaseAmount || purchaseAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.credit.applyBNPL({ purchaseAmount });
      if (response.success) {
        navigateTo('bnpl-approved');
      } else {
        setError(response.error?.message || 'BNPL application failed');
      }
    } catch (err: any) {
      setError(err?.error?.message || err?.message || 'Failed to apply for BNPL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parsedAmount = parseInt(amount) || 0;
  const installmentAmount = Math.round(parsedAmount / 4);

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
          <h1 className="text-[18px] font-bold text-[#121417]">Apply for BNPL</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Amount Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-[28px] font-bold text-[#121417] mb-4">
            How much do you need?
          </h2>
          <p className="text-[16px] text-gray-600 mb-6">
            Enter the purchase amount you'd like to split into 4 interest-free installments.
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">PKR</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-16 pr-4 py-4 rounded-xl border border-gray-300 text-2xl font-bold text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
              placeholder="0"
              min="100"
              max="50000"
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">Max limit: PKR 50,000</p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-t border-gray-200 py-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-medium text-[#121417] mb-1">Total Amount</p>
              <p className="text-[14px] text-[#3D8A75]">PKR {parsedAmount.toLocaleString()}</p>
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
              4 interest-free payments of PKR {installmentAmount.toLocaleString()}
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
          {[1, 2, 3, 4].map((num) => {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + num);
            return (
              <div key={num} className="border-t border-gray-200 pt-4">
                <p className="text-[14px] text-[#3D8A75] mb-2">Payment {num}</p>
                <p className="text-[14px] text-[#121417]">
                  PKR {installmentAmount.toLocaleString()} - Due {dueDate.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <button
          onClick={handleApply}
          disabled={loading || parsedAmount <= 0}
          className={`w-full h-12 text-white text-[16px] font-bold rounded-xl transition-colors ${
            loading || parsedAmount <= 0 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#3D8A75] hover:bg-[#2d6b5c]'
          }`}
        >
          {loading ? 'Processing...' : 'Confirm & Apply'}
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => navigateTo(homeDashboard)} className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Home</span>
          </button>
          <button onClick={() => navigateTo('order-tracking')} className="flex flex-col items-center gap-1">
            <Receipt className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Orders</span>
          </button>
          <button onClick={() => navigateTo('payments-main')} className="flex flex-col items-center gap-1">
            <Wallet className="w-6 h-6 text-[#3D8A75]" />
            <span className="text-[11px] text-[#3D8A75]">Payments</span>
          </button>
          <button onClick={() => navigateTo('profile')} className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
