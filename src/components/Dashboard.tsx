import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  CreditCard,
  FileText,
  ShoppingBag,
  BarChart3,
  Settings,
  User,
  Receipt,
  Clock,
  TrendingUp,
  Package
} from 'lucide-react';

export function Dashboard() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.dashboard.getDashboardStats();
      if (response.success) {
        setDashboardData(response.data?.stats || null);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `PKR ${(dashboardData?.revenue?.current ?? 0).toLocaleString()}`,
      change: dashboardData?.revenue?.change || '--',
      positive: !!dashboardData?.revenue?.positive,
      icon: ArrowUpRight 
    },
    { 
      label: 'Expenses', 
      value: `PKR ${(dashboardData?.expenses?.current ?? 0).toLocaleString()}`,
      change: dashboardData?.expenses?.change || '--',
      positive: !!dashboardData?.expenses?.positive,
      icon: ArrowDownRight 
    },
    { 
      label: 'Net Profit', 
      value: `PKR ${(dashboardData?.netProfit?.current ?? 0).toLocaleString()}`,
      change: dashboardData?.netProfit?.change || '--',
      positive: !!dashboardData?.netProfit?.positive,
      icon: Wallet 
    },
  ];

  const recentTransactions = dashboardData?.recentTransactions || [];

  const quickActions = [
    { label: 'Payments', icon: CreditCard, action: () => navigateTo('payments-main'), color: 'bg-[#3D8A75]' },
    { label: 'Marketplace', icon: ShoppingBag, action: () => navigateTo('marketplace'), color: 'bg-[#102542]' },
    { label: 'My Orders', icon: Receipt, action: () => navigateTo('order-tracking'), color: 'bg-[#3D8A75]' },
    { label: 'Analytics', icon: BarChart3, action: () => navigateTo('analytics'), color: 'bg-[#102542]' },
    { label: 'My Products', icon: Package, action: () => navigateTo('merchant-products'), color: 'bg-[#102542]' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-6 rounded-b-[2rem]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[#CDD7D6] mb-1">Welcome back,</p>
            <h2 className="text-white">{user?.name || 'User'}</h2>
            <p className="text-[#CDD7D6] text-sm mt-1">
              {user?.businessName && `${user.businessName}, `}
              {user?.businessAddress || 'Location'}
            </p>
          </div>
          <button 
            onClick={() => navigateTo('profile')}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Credit Score CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigateTo('credit-score-initiate')}
          className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 hover:bg-white/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium mb-0.5">Check Credit Score</p>
                <p className="text-[#CDD7D6] text-xs">Build trust with suppliers</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1">
              <span className="text-white text-xs">Free</span>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="px-6 mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="glass rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-600 mb-1">{stat.label}</p>
                  <h3 className="text-[#102542]">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.positive ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.positive ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-[#102542] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105`}
              >
                <action.icon className="w-8 h-8" />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#102542]">Recent Transactions</h3>
            <button 
              onClick={() => navigateTo('transactions')}
              className="text-[#3D8A75]"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="glass rounded-2xl p-8 shadow-md text-center">
                <p className="text-gray-400 mb-1">No transactions yet</p>
                <p className="text-gray-400 text-sm">Your recent transactions will appear here</p>
              </div>
            ) : (
              recentTransactions.map((transaction: any, index: number) => (
                <motion.div
                  key={transaction._id || index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={() => {
                    navigateTo('transaction-details');
                  }}
                  className="glass rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[#102542] mb-1">{transaction.description || transaction.name || 'Transaction'}</p>
                      <p className="text-gray-500">
                        {transaction.transactionDate 
                          ? new Date(transaction.transactionDate).toLocaleDateString() 
                          : transaction.date || ''}
                      </p>
                    </div>
                    <span className={`${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}PKR {Math.abs(transaction.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-[#3D8A75]">
            <Wallet className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => navigateTo('marketplace')} className="flex flex-col items-center gap-1 text-gray-400">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs">Shop</span>
          </button>
          <button onClick={() => navigateTo('order-tracking')} className="flex flex-col items-center gap-1 text-gray-400">
            <Receipt className="w-6 h-6" />
            <span className="text-xs">Orders</span>
          </button>
          <button onClick={() => navigateTo('settings')} className="flex flex-col items-center gap-1 text-gray-400">
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}