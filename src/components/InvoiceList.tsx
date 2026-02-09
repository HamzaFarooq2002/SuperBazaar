import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

export function InvoiceList() {
  const { navigateTo, setSelectedInvoice } = useContext(AppContext);

  const invoices = [
    { id: '1', client: 'ABC Corporation', amount: 5200, date: 'Nov 20, 2025', status: 'paid', invoiceNo: 'INV-2025-042' },
    { id: '2', client: 'Tech Startup Inc', amount: 3800, date: 'Nov 18, 2025', status: 'pending', invoiceNo: 'INV-2025-041' },
    { id: '3', client: 'Global Trading Co', amount: 7500, date: 'Nov 15, 2025', status: 'paid', invoiceNo: 'INV-2025-040' },
    { id: '4', client: 'Local Business LLC', amount: 2100, date: 'Nov 12, 2025', status: 'overdue', invoiceNo: 'INV-2025-039' },
    { id: '5', client: 'Enterprise Solutions', amount: 9200, date: 'Nov 10, 2025', status: 'paid', invoiceNo: 'INV-2025-038' },
    { id: '6', client: 'Startup Ventures', amount: 4600, date: 'Nov 8, 2025', status: 'pending', invoiceNo: 'INV-2025-037' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'overdue': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-5 h-5" />;
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'overdue': return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigateTo('dashboard')}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigateTo('create-invoice')}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-white mb-2">Invoices</h2>
        <p className="text-[#CDD7D6]">Manage and track your invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mt-6 grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-4 shadow-lg text-center"
        >
          <p className="text-gray-600 mb-1">Paid</p>
          <h3 className="text-green-600">3</h3>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 shadow-lg text-center"
        >
          <p className="text-gray-600 mb-1">Pending</p>
          <h3 className="text-yellow-600">2</h3>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 shadow-lg text-center"
        >
          <p className="text-gray-600 mb-1">Overdue</p>
          <h3 className="text-red-600">1</h3>
        </motion.div>
      </div>

      {/* Invoices List */}
      <div className="px-6 space-y-3">
        {invoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            onClick={() => {
              setSelectedInvoice?.(invoice.id);
              navigateTo('invoice-details');
            }}
            className="glass rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[#102542] mb-1">{invoice.client}</p>
                <p className="text-gray-500">{invoice.invoiceNo}</p>
              </div>
              <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(invoice.status)}`}>
                {getStatusIcon(invoice.status)}
                <span className="capitalize">{invoice.status}</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{invoice.date}</span>
              <span className="text-[#102542]">${invoice.amount.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
