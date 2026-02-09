import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, FileText, TrendingUp, CreditCard, Home, Receipt, Wallet, User } from 'lucide-react';

export function PaymentsMain() {
  const { navigateTo } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'invoices' | 'snpl' | 'bnpl'>('invoices');

  // Recent Invoices Data
  const recentInvoices = [
    {
      id: 'INV-001',
      client: 'Ahmed Traders',
      amount: 45000,
      date: '15 Nov 2025',
      status: 'paid'
    },
    {
      id: 'INV-002',
      client: 'Karachi Wholesale',
      amount: 32000,
      date: '12 Nov 2025',
      status: 'pending'
    },
    {
      id: 'INV-003',
      client: 'Lahore Suppliers',
      amount: 28500,
      date: '10 Nov 2025',
      status: 'paid'
    },
    {
      id: 'INV-004',
      client: 'Islamabad Mart',
      amount: 56000,
      date: '8 Nov 2025',
      status: 'overdue'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white text-[24px] font-bold mb-2">Payments</h2>
        <p className="text-white/80 text-[14px]">Manage your invoices and loans</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 py-4 text-[14px] font-medium transition-colors relative ${
              activeTab === 'invoices' ? 'text-[#3D8A75]' : 'text-gray-500'
            }`}
          >
            Invoices
            {activeTab === 'invoices' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D8A75]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('snpl')}
            className={`flex-1 py-4 text-[14px] font-medium transition-colors relative ${
              activeTab === 'snpl' ? 'text-[#3D8A75]' : 'text-gray-500'
            }`}
          >
            SNPL
            {activeTab === 'snpl' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D8A75]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bnpl')}
            className={`flex-1 py-4 text-[14px] font-medium transition-colors relative ${
              activeTab === 'bnpl' ? 'text-[#3D8A75]' : 'text-gray-500'
            }`}
          >
            BNPL
            {activeTab === 'bnpl' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D8A75]"
              />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'invoices' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-[#102542]">Recent Invoices</h3>
              <button
                onClick={() => navigateTo('invoices')}
                className="text-[14px] text-[#3D8A75]"
              >
                View All
              </button>
            </div>
            {recentInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#CDD7D6] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#102542]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#102542]">{invoice.id}</p>
                      <p className="text-[12px] text-gray-500">{invoice.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-bold text-[#102542]">PKR {invoice.amount.toLocaleString()}</p>
                    <span className={`text-[11px] px-2 py-1 rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-600' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-[12px] text-gray-500">{invoice.date}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'snpl' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-[#102542]">Stocknow Paylater</h3>
                <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[12px]">
                  Active
                </div>
              </div>
              <button
                onClick={() => navigateTo('snpl-details')}
                className="w-full bg-gradient-to-r from-[#102542] to-[#3D8A75] text-white py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                View Loan Details
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4">
                <p className="text-[12px] text-gray-500 mb-1">Next Payment</p>
                <p className="text-[20px] font-bold text-[#102542]">PKR 1,250</p>
                <p className="text-[11px] text-gray-400">Due Jul 15</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-[12px] text-gray-500 mb-1">Remaining</p>
                <p className="text-[20px] font-bold text-[#102542]">PKR 2,500</p>
                <p className="text-[11px] text-gray-400">2 payments</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bnpl' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-[#102542]">Buy Now, Pay Later</h3>
                <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[12px]">
                  Available
                </div>
              </div>
              <p className="text-[14px] text-gray-600 mb-6">
                Split your purchases into 4 interest-free installments.
              </p>
              <button
                onClick={() => navigateTo('bnpl-application')}
                className="w-full bg-[#3D8A75] text-white py-4 rounded-xl hover:bg-[#2d6b5c] transition-colors"
              >
                Apply for BNPL
              </button>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 glass rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-[14px] text-[#102542]">No fees or interest</p>
              </div>
              <div className="flex items-center gap-3 p-4 glass rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-[14px] text-[#102542]">First payment in 30 days</p>
              </div>
              <div className="flex items-center gap-3 p-4 glass rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-[14px] text-[#102542]">Instant approval</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex flex-col items-center gap-1"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Home</span>
          </button>
          <button
            onClick={() => navigateTo('invoices')}
            className="flex flex-col items-center gap-1"
          >
            <Receipt className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Invoices</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Wallet className="w-6 h-6 text-[#3D8A75]" />
            <span className="text-[11px] text-[#3D8A75]">Payments</span>
          </button>
          <button
            onClick={() => navigateTo('profile')}
            className="flex flex-col items-center gap-1"
          >
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
