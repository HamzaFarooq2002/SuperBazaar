import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import {
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  ClipboardList,
  TrendingUp,
  Store,
  Wallet,
} from 'lucide-react';

interface SupplierStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  ordersReceived: number;
  totalSales: number;
  recentOrders: any[];
}

export function SupplierDashboard() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.dashboard.getDashboardStats();
        if (response.success) {
          const raw = (response.data as any) || {};
          const mergedStats = (raw.stats as SupplierStats) || (raw as SupplierStats);
          setStats({
            totalProducts: mergedStats?.totalProducts ?? 0,
            activeProducts: mergedStats?.activeProducts ?? 0,
            lowStockProducts: mergedStats?.lowStockProducts ?? 0,
            ordersReceived: mergedStats?.ordersReceived ?? 0,
            totalSales: mergedStats?.totalSales ?? 0,
            recentOrders: mergedStats?.recentOrders ?? [],
          });
        }
      } catch (error) {
        console.error('Failed to load supplier dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const overviewCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Active Listings',
      value: stats?.activeProducts ?? 0,
      icon: Store,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Low Stock',
      value: stats?.lowStockProducts ?? 0,
      icon: ClipboardList,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Orders This Month',
      value: stats?.ordersReceived ?? 0,
      icon: ShoppingCart,
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  const quickActions = [
    {
      label: 'My Products',
      icon: Package,
      description: 'Add, edit & manage stock',
      action: () => navigateTo('supplier-products'),
    },
    {
      label: 'View Orders',
      icon: ClipboardList,
      description: 'Orders for your products',
      action: () => navigateTo('supplier-orders'),
    },
    {
      label: 'Marketplace',
      icon: Store,
      description: 'Browse live listings',
      action: () => navigateTo('marketplace'),
    },
    {
      label: 'Nano Loan',
      icon: Wallet,
      description: 'Quick cash when needed',
      action: () => navigateTo('nano-loan'),
    },
  ];

  const formattedSales =
    stats && typeof stats.totalSales === 'number'
      ? `PKR ${stats.totalSales.toLocaleString()}`
      : 'PKR 0';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-6 rounded-b-[2rem]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[#CDD7D6] mb-1">Welcome back,</p>
            <h2 className="text-white">{user?.name || 'Supplier'}</h2>
            <p className="text-[#CDD7D6] text-sm mt-1">
              {user?.businessName && `${user.businessName}, `}
              {user?.businessAddress || 'Your warehouse'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('profile')}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Sales highlight */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 hover:bg-white/30 transition-all group text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white text-sm mb-0.5">Sales this month</p>
                <p className="text-white text-lg font-semibold">
                  {loading ? 'Loading…' : formattedSales}
                </p>
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Overview cards */}
        <div className="grid grid-cols-2 gap-3">
          {overviewCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass rounded-2xl p-4 shadow-md flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-lg text-[#102542] font-semibold">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-[#102542] mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={action.action}
                className="glass rounded-2xl p-4 shadow-md flex flex-col items-start gap-2 hover:shadow-lg transition-shadow"
              >
                <div className="w-9 h-9 rounded-xl bg-[#3D8A75]/10 flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-[#3D8A75]" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-[#102542] font-medium">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#102542]">Recent Orders</h3>
            <button
              onClick={() => navigateTo('supplier-orders')}
              className="text-[#3D8A75] text-sm"
            >
              View all
            </button>
          </div>

          {loading ? (
            <div className="glass rounded-2xl p-6 text-center text-gray-500">
              Loading orders…
            </div>
          ) : !stats || !stats.recentOrders || stats.recentOrders.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center text-gray-400">
              No orders received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order: any, index: number) => (
                <motion.div
                  key={order._id || index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="glass rounded-2xl p-4 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[#102542] text-sm mb-1">
                        {order.merchantName || 'Merchant'}
                      </p>
                      <p className="text-gray-500 text-xs mb-1">
                        {order.orderNumber || 'Order'} •{' '}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                    <p className="text-[#3D8A75] text-sm font-semibold">
                      PKR {(order.totalAmount ?? 0).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Supplier */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-[#3D8A75]">
            <Store className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => navigateTo('supplier-products')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Package className="w-6 h-6" />
            <span className="text-xs">Products</span>
          </button>
          <button
            onClick={() => navigateTo('supplier-orders')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs">Orders</span>
          </button>
          <button
            onClick={() => navigateTo('nano-loan')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs">Loan</span>
          </button>
          <button
            onClick={() => navigateTo('settings')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

