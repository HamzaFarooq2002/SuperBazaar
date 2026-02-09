import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Download, Share2, Printer } from 'lucide-react';

export function InvoiceDetails() {
  const { navigateTo } = useContext(AppContext);

  const items = [
    { description: 'Consulting Services - Q4 2025', quantity: 40, rate: 100, amount: 4000 },
    { description: 'Project Management', quantity: 12, rate: 100, amount: 1200 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <button 
          onClick={() => navigateTo('invoices')}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Invoice Details</h2>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Invoice Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[#102542] mb-1">Invoice</h3>
              <p className="text-gray-600">INV-2025-042</p>
            </div>
            <span className="px-4 py-2 rounded-full bg-green-100 text-green-600">Paid</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">From</p>
              <p className="text-[#102542]">FinanceFlow LLC</p>
              <p className="text-gray-500">123 Business St</p>
              <p className="text-gray-500">New York, NY 10001</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Bill To</p>
              <p className="text-[#102542]">ABC Corporation</p>
              <p className="text-gray-500">456 Client Ave</p>
              <p className="text-gray-500">Boston, MA 02101</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-gray-600 mb-1">Invoice Date</p>
              <p className="text-[#102542]">Nov 15, 2025</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Due Date</p>
              <p className="text-[#102542]">Dec 15, 2025</p>
            </div>
          </div>
        </motion.div>

        {/* Line Items */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-[#102542] mb-4">Items</h3>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                <p className="text-[#102542] mb-2">{item.description}</p>
                <div className="flex justify-between text-gray-600">
                  <span>{item.quantity} hrs × ${item.rate}/hr</span>
                  <span className="text-[#102542]">${item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-2 border-[#102542]/20 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>$5,200</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (0%)</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#102542]">Total</span>
              <h3 className="text-[#3D8A75]">$5,200</h3>
            </div>
          </div>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-[#102542] mb-4">Payment Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="text-[#102542]">Bank Transfer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Date</span>
              <span className="text-[#102542]">Nov 20, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="text-[#102542]">#TXN-001234</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <button className="py-4 rounded-xl bg-[#3D8A75] text-white flex flex-col items-center justify-center gap-2 shadow-lg hover:bg-[#2d6a5c] transition-colors">
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
          <button className="py-4 rounded-xl bg-[#102542] text-white flex flex-col items-center justify-center gap-2 shadow-lg hover:bg-[#0a1829] transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button className="py-4 rounded-xl bg-[#CDD7D6] text-[#102542] flex flex-col items-center justify-center gap-2 shadow-lg hover:bg-[#b8c4c3] transition-colors">
            <Printer className="w-5 h-5" />
            <span>Print</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
