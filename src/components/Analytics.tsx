import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Analytics() {
  const { navigateTo } = useContext(AppContext);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const revenueData = [
    { name: 'Jan', income: 40000, expense: 24000 },
    { name: 'Feb', income: 35000, expense: 22000 },
    { name: 'Mar', income: 48000, expense: 28000 },
    { name: 'Apr', income: 52000, expense: 30000 },
    { name: 'May', income: 45000, expense: 26000 },
    { name: 'Jun', income: 58000, expense: 32000 },
  ];

  const categoryData = [
    { name: 'Revenue', value: 45, color: '#3D8A75' },
    { name: 'Operations', value: 20, color: '#102542' },
    { name: 'Marketing', value: 15, color: '#CDD7D6' },
    { name: 'Technology', value: 12, color: '#10b981' },
    { name: 'Other', value: 8, color: '#f59e0b' },
  ];

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
        <h2 className="text-white mb-6">Analytics & Reports</h2>

        {/* Timeframe Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-full transition-all ${
              timeframe === 'week' 
                ? 'bg-white text-[#102542]' 
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-full transition-all ${
              timeframe === 'month' 
                ? 'bg-white text-[#102542]' 
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-4 py-2 rounded-full transition-all ${
              timeframe === 'year' 
                ? 'bg-white text-[#102542]' 
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Total Income</p>
            <h3 className="text-green-600">$278,000</h3>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Total Expenses</p>
            <h3 className="text-red-600">$162,000</h3>
          </motion.div>
        </div>

        {/* Revenue vs Expense Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-[#102542] mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CDD7D6" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #CDD7D6',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#3D8A75" strokeWidth={3} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Comparison */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-[#102542] mb-4">Monthly Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CDD7D6" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #CDD7D6',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#3D8A75" name="Income" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Categories */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-[#102542] mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #CDD7D6',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
