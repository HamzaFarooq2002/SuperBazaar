import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown, Inbox } from 'lucide-react';

export function TransactionsList() {
  const { navigateTo, setSelectedTransaction } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await api.users.getTransactions();
        if (response.success) {
          setTransactions(response.data?.transactions || response.data || []);
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t: any) => {
    if (filter === 'all') return true;
    if (filter === 'income') return t.type === 'income' || t.type === 'loan_disbursement';
    if (filter === 'expense') return t.type === 'expense' || t.type === 'loan_repayment';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <button 
          onClick={() => navigateTo(homeDashboard)}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white mb-6">All Transactions</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'all' 
                ? 'bg-white text-[#102542]' 
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'income' 
                ? 'bg-white text-[#102542]' 
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'expense' 
                ? 'bg-white text-[#102542]' 
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-6 mt-6 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">No transactions yet</p>
            <p className="text-gray-400 text-sm">Your transactions will appear here as you use the app</p>
          </div>
        ) : (
          filteredTransactions.map((transaction: any, index: number) => (
            <motion.div
              key={transaction._id || transaction.id || index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedTransaction?.(transaction._id || transaction.id);
                navigateTo('transaction-details');
              }}
              className="glass rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  } flex items-center justify-center`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-[#102542] mb-1">{transaction.description || transaction.name || 'Transaction'}</p>
                    <p className="text-gray-500">
                      {transaction.transactionDate 
                        ? new Date(transaction.transactionDate).toLocaleDateString() 
                        : transaction.date || ''}
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 rounded-full bg-[#CDD7D6] text-[#102542] text-xs">
                      {transaction.category || transaction.type || 'General'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`block ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}PKR {Math.abs(transaction.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}