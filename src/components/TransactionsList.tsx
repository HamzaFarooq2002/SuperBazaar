import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';

export function TransactionsList() {
  const { navigateTo, setSelectedTransaction } = useContext(AppContext);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const transactions = [
    { id: '1', name: 'Stock Purchase - Metro Wholesale', amount: 45200, date: 'Nov 20, 2025', time: '2:30 PM', type: 'expense', category: 'Inventory' },
    { id: '2', name: 'Sales Revenue', amount: 78500, date: 'Nov 20, 2025', time: '11:20 AM', type: 'income', category: 'Revenue' },
    { id: '3', name: 'Inventory - Bismillah Traders', amount: 32800, date: 'Nov 19, 2025', time: '4:15 PM', type: 'expense', category: 'Inventory' },
    { id: '4', name: 'Customer Payment', amount: 15900, date: 'Nov 19, 2025', time: '9:00 AM', type: 'income', category: 'Revenue' },
    { id: '5', name: 'Stock - Shah Wholesale', amount: 28400, date: 'Nov 18, 2025', time: '3:45 PM', type: 'expense', category: 'Inventory' },
    { id: '6', name: 'Shop Rent', amount: 35000, date: 'Nov 18, 2025', time: '1:20 PM', type: 'expense', category: 'Operations' },
    { id: '7', name: 'Daily Sales', amount: 52300, date: 'Nov 17, 2025', time: '5:30 PM', type: 'income', category: 'Revenue' },
    { id: '8', name: 'Electricity Bill', amount: 8500, date: 'Nov 17, 2025', time: '10:15 AM', type: 'expense', category: 'Utilities' },
  ];

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' ? true : t.type === filter
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <button 
          onClick={() => navigateTo('dashboard')}
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
        {filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              setSelectedTransaction?.(transaction.id);
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
                  <p className="text-[#102542] mb-1">{transaction.name}</p>
                  <p className="text-gray-500">{transaction.date} • {transaction.time}</p>
                  <span className="inline-block mt-1 px-2 py-1 rounded-full bg-[#CDD7D6] text-[#102542] text-xs">
                    {transaction.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`block ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}PKR {transaction.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}