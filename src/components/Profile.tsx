import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, User, Mail, Phone, Building, MapPin, Edit, LogOut } from 'lucide-react';

export function Profile() {
  const { navigateTo } = useContext(AppContext);
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ orders: 0, transactions: 0, rating: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [ordersRes, txnRes] = await Promise.all([
          api.orders.getOrders().catch(() => ({ success: false })),
          api.users.getTransactions().catch(() => ({ success: false }))
        ]);

        const orders = ordersRes.success ? (ordersRes.data?.orders || ordersRes.data || []) : [];
        const transactions = txnRes.success ? (txnRes.data?.transactions || txnRes.data || []) : [];

        setStats({
          orders: Array.isArray(orders) ? orders.length : 0,
          transactions: Array.isArray(transactions) ? transactions.length : 0,
          rating: 0 // No rating system yet
        });
      } catch (error) {
        console.error('Failed to load profile stats:', error);
      }
    };
    loadStats();
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigateTo('login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-24">
        <button 
          onClick={() => navigateTo(user?.userType === 'customer' ? 'customer-dashboard' : 'dashboard')}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Profile</h2>
      </div>

      <div className="px-6 -mt-16">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-6 shadow-2xl text-center mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-[#102542] mb-1">{user?.name || 'User'}</h3>
          <p className="text-gray-600 mb-1">{user?.userType === 'merchant' ? 'Shop Owner' : user?.userType === 'supplier' ? 'Supplier' : 'Customer'}</p>
          <p className="text-gray-500 text-sm mb-4">{user?.businessName || 'Business Name'}</p>
          <button className="px-6 py-2 rounded-xl bg-[#3D8A75] text-white flex items-center gap-2 mx-auto hover:bg-[#2d6a5c] transition-colors">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </motion.div>

        {/* Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-[#102542] mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 mb-1">Email</p>
                <p className="text-[#102542]">{user?.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="text-[#102542]">{user?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 mb-1">Business</p>
                <p className="text-[#102542]">{user?.businessName || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 mb-1">Location</p>
                <p className="text-[#102542]">{user?.businessAddress || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Business Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-[#102542] mb-4">Business Statistics</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-[#3D8A75] mb-1">{stats.orders}</p>
              <p className="text-gray-600 text-sm">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-[#3D8A75] mb-1">{stats.transactions}</p>
              <p className="text-gray-600 text-sm">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-[#3D8A75] mb-1">{stats.rating > 0 ? stats.rating.toFixed(1) : '--'}</p>
              <p className="text-gray-600 text-sm">Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <button 
            onClick={() => navigateTo('settings')}
            className="w-full glass rounded-2xl p-4 shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow"
          >
            <span className="text-[#102542]">Settings</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full glass rounded-2xl p-4 shadow-lg flex items-center justify-center gap-2 text-red-600 hover:shadow-xl transition-shadow"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
