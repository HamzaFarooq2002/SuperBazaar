import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, CreditCard, Building, Smartphone, DollarSign, Inbox } from 'lucide-react';

export function Payments() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        // Fetch real transactions that can serve as payment history
        const response = await api.users.getTransactions();
        if (response.success) {
          const allTxns = response.data?.transactions || response.data || [];
          // Show recent transactions as payment history
          setRecentPayments(allTxns.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load payments:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  // Payment methods will be dynamic once feature is built - start empty
  const paymentMethods: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-24">
        <button 
          onClick={() => navigateTo(homeDashboard)}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white mb-2">Payments</h2>
        <p className="text-[#CDD7D6]">Manage payment methods and history</p>
      </div>

      <div className="px-6 -mt-16">
        {/* Balance Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-dark rounded-3xl p-6 shadow-2xl mb-6"
        >
          <p className="text-white/80 mb-2">Available Balance</p>
          <h1 className="text-white mb-4">PKR 0</h1>
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-white text-[#102542] hover:bg-white/90 transition-colors">
              Withdraw
            </button>
            <button className="flex-1 py-3 rounded-xl bg-[#3D8A75] text-white hover:bg-[#2d6a5c] transition-colors">
              Add Funds
            </button>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#102542]">Payment Methods</h3>
            <button className="text-[#3D8A75]">+ Add New</button>
          </div>
          {paymentMethods.length === 0 ? (
            <div className="glass rounded-2xl p-6 shadow-lg text-center">
              <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No payment methods added yet</p>
              <p className="text-gray-400 text-xs mt-1">Add a payment method to make transactions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method: any, index: number) => (
                <motion.div
                  key={method.id || index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="glass rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <CreditCard className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#102542] mb-1">{method.type}</p>
                      <p className="text-gray-500">{method.brand} •••• {method.last4}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div>
          <h3 className="text-[#102542] mb-4">Recent Payments</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : recentPayments.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No payment history yet</p>
              <p className="text-gray-400 text-xs mt-1">Your payment history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment: any, index: number) => (
                <motion.div
                  key={payment._id || index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="glass rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[#102542] mb-1">{payment.description || 'Transaction'}</p>
                      <p className="text-gray-500">
                        {payment.transactionDate 
                          ? new Date(payment.transactionDate).toLocaleDateString() 
                          : ''}
                      </p>
                    </div>
                    <span className={`${payment.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.type === 'income' ? '+' : '-'}PKR {Math.abs(payment.amount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 capitalize">{(payment.paymentMethod || '').replace(/_/g, ' ')}</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {payment.status || 'completed'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
