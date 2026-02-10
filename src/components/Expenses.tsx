import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import api from '../services/api';
import { ArrowLeft, Plus, Coffee, Wifi, Car, Home, ShoppingCart, Zap, Inbox } from 'lucide-react';

export function Expenses() {
  const { navigateTo } = useContext(AppContext);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await api.users.getTransactions();
        if (response.success) {
          const allTxns = response.data?.transactions || response.data || [];
          // Filter only expense-type transactions
          const expenseTxns = allTxns.filter((t: any) => t.type === 'expense');
          setExpenses(expenseTxns);
        }
      } catch (error) {
        console.error('Failed to load expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, []);

  // Build category summary from real data
  const categoryMap: Record<string, number> = {};
  expenses.forEach((exp: any) => {
    const cat = exp.category || 'other';
    categoryMap[cat] = (categoryMap[cat] || 0) + Math.abs(exp.amount || 0);
  });

  const categoryIcons: Record<string, any> = {
    'stock_purchase': ShoppingCart,
    'inventory': ShoppingCart,
    'utilities': Zap,
    'transportation': Car,
    'internet': Wifi,
    'rent': Home,
    'meals': Coffee,
    'other': ShoppingCart
  };

  const categoryColors: Record<string, string> = {
    'stock_purchase': 'bg-blue-100 text-blue-600',
    'inventory': 'bg-blue-100 text-blue-600',
    'utilities': 'bg-yellow-100 text-yellow-600',
    'transportation': 'bg-purple-100 text-purple-600',
    'internet': 'bg-green-100 text-green-600',
    'rent': 'bg-red-100 text-red-600',
    'meals': 'bg-orange-100 text-orange-600',
    'other': 'bg-gray-100 text-gray-600'
  };

  const categories = Object.entries(categoryMap).map(([name, amount]) => ({
    name: name.replace(/_/g, ' '),
    amount,
    icon: categoryIcons[name] || ShoppingCart,
    color: categoryColors[name] || 'bg-gray-100 text-gray-600'
  }));

  const totalExpenses = expenses.reduce((sum, exp) => sum + Math.abs(exp.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-24">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigateTo('dashboard')}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-white mb-2">Expenses</h2>
        <p className="text-[#CDD7D6]">Track and manage your expenses</p>
      </div>

      <div className="px-6 -mt-16">
        {/* Total Expenses Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-6 shadow-2xl text-center mb-6"
        >
          <p className="text-gray-600 mb-2">Total Expenses This Month</p>
          <h1 className="text-[#102542] mb-1">PKR {totalExpenses.toLocaleString()}</h1>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500">Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">No expenses yet</p>
            <p className="text-gray-400 text-sm">Your expenses will appear here as you make purchases</p>
          </div>
        ) : (
          <>
            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[#102542] mb-4">By Category</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="glass rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    >
                      <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-3`}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      <p className="text-gray-600 mb-1 capitalize">{category.name}</p>
                      <p className="text-[#102542]">PKR {category.amount.toLocaleString()}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Expenses */}
            <div>
              <h3 className="text-[#102542] mb-4">Recent Expenses</h3>
              <div className="space-y-3">
                {expenses.slice(0, 10).map((expense: any, index: number) => (
                  <motion.div
                    key={expense._id || index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="glass rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#102542] mb-1">{expense.description || 'Expense'}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">
                            {expense.transactionDate
                              ? new Date(expense.transactionDate).toLocaleDateString()
                              : ''}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-[#CDD7D6] text-[#102542] text-xs capitalize">
                            {(expense.category || 'other').replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                      <span className="text-red-600">-PKR {Math.abs(expense.amount || 0).toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
