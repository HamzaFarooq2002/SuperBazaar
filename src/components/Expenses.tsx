import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Plus, Coffee, Wifi, Car, Home, ShoppingCart, Zap } from 'lucide-react';

export function Expenses() {
  const { navigateTo } = useContext(AppContext);

  const categories = [
    { name: 'Office Supplies', amount: 3240, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { name: 'Utilities', amount: 1850, icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Transportation', amount: 1420, icon: Car, color: 'bg-purple-100 text-purple-600' },
    { name: 'Internet', amount: 990, icon: Wifi, color: 'bg-green-100 text-green-600' },
    { name: 'Rent', amount: 5200, icon: Home, color: 'bg-red-100 text-red-600' },
    { name: 'Meals', amount: 780, icon: Coffee, color: 'bg-orange-100 text-orange-600' },
  ];

  const recentExpenses = [
    { id: '1', name: 'Office Supplies - Staples', amount: 340, date: 'Today', category: 'Office Supplies' },
    { id: '2', name: 'Electric Bill', amount: 450, date: 'Yesterday', category: 'Utilities' },
    { id: '3', name: 'Uber for Business', amount: 85, date: 'Nov 18', category: 'Transportation' },
    { id: '4', name: 'Internet - Comcast', amount: 99, date: 'Nov 17', category: 'Internet' },
  ];

  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0);

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
          <h1 className="text-[#102542] mb-1">${totalExpenses.toLocaleString()}</h1>
          <p className="text-red-600">-5.2% from last month</p>
        </motion.div>

        {/* Categories */}
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
                <p className="text-gray-600 mb-1">{category.name}</p>
                <p className="text-[#102542]">${category.amount.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div>
          <h3 className="text-[#102542] mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {recentExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="glass rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#102542] mb-1">{expense.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{expense.date}</span>
                      <span className="px-2 py-1 rounded-full bg-[#CDD7D6] text-[#102542] text-xs">
                        {expense.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-red-600">-${expense.amount}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
