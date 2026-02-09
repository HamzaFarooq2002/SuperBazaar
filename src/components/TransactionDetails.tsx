import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Download, Share2, CheckCircle } from 'lucide-react';

export function TransactionDetails() {
  const { navigateTo } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-24">
        <button 
          onClick={() => navigateTo('transactions')}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Transaction Details</h2>
      </div>

      <div className="px-6 -mt-16">
        {/* Amount Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-8 shadow-2xl text-center mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 mb-2">Amount</p>
          <h1 className="text-green-600">+$5,200</h1>
          <p className="text-gray-500 mt-2">Completed Successfully</p>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-[#102542] mb-4">Transaction Information</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Transaction ID</span>
              <span className="text-[#102542]">#TXN-001234</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Type</span>
              <span className="text-[#102542]">Income</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Category</span>
              <span className="text-[#102542]">Revenue</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">From</span>
              <span className="text-[#102542]">ABC Corp</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Date</span>
              <span className="text-[#102542]">Nov 20, 2025</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Time</span>
              <span className="text-[#102542]">2:30 PM</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Payment Method</span>
              <span className="text-[#102542]">Bank Transfer</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-600">Completed</span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-[#102542] mb-3">Description</h3>
          <p className="text-gray-600">
            Payment received from ABC Corp for consulting services provided in Q4 2025. 
            Invoice #INV-2025-042 has been settled in full.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 pb-6"
        >
          <button className="py-4 rounded-xl bg-[#3D8A75] text-white flex items-center justify-center gap-2 shadow-lg hover:bg-[#2d6a5c] transition-colors">
            <Download className="w-5 h-5" />
            Download
          </button>
          <button className="py-4 rounded-xl bg-[#102542] text-white flex items-center justify-center gap-2 shadow-lg hover:bg-[#0a1829] transition-colors">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </motion.div>
      </div>
    </div>
  );
}
