import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, TrendingUp, DollarSign, Inbox } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Analytics() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const periodMap: Record<'week' | 'month' | 'year', string> = {
          week: '7days',
          month: '30days',
          year: '90days'
        };
        const response = await api.dashboard.getAnalytics({ period: periodMap[timeframe] });
        if (response.success) {
          const chartData = response.data?.chartData || [];
          const totals = response.data?.totals || { income: 0, expenses: 0 };
          const categoryBreakdown = response.data?.categoryBreakdown || {};

          setRevenueData(chartData.map((item: any) => ({
            name: item.date,
            income: item.income || 0,
            expense: item.expenses || 0
          })));
          setTotalIncome(totals.income || 0);
          setTotalExpenses(totals.expenses || 0);

          const colors = ['#3D8A75', '#102542', '#CDD7D6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
          const catData = Object.entries(categoryBreakdown).map(([name, value], i) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: Number(value) || 0,
            color: colors[i % colors.length]
          }));
          setCategoryData(catData);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
          <button onClick={() => navigateTo(homeDashboard)} className="mb-6 text-white flex items-center gap-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white mb-6">Analytics & Reports</h2>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

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
        <h2 className="text-white mb-6">Analytics & Reports</h2>

        {/* Timeframe Selector */}
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-full transition-all capitalize ${
                timeframe === tf 
                  ? 'bg-white text-[#102542]' 
                  : 'bg-white/20 text-white backdrop-blur-sm'
              }`}
            >
              {tf}
            </button>
          ))}
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
            <h3 className="text-green-600">PKR {totalIncome.toLocaleString()}</h3>
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
            <h3 className="text-red-600">PKR {totalExpenses.toLocaleString()}</h3>
          </motion.div>
        </div>

        {revenueData.length > 0 ? (
          <>
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
                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, '']}
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
                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#3D8A75" name="Income" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-8 shadow-lg text-center"
          >
            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">No analytics data yet</p>
            <p className="text-gray-400 text-sm">Start making transactions to see your analytics</p>
          </motion.div>
        )}

        {/* Expense Categories */}
        {categoryData.length > 0 && (
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
                  {categoryData.map((entry: any, index: number) => (
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
                  formatter={(value: number) => [`PKR ${value.toLocaleString()}`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
