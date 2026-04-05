import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import api from '../services/api';
import { ArrowLeft, Download, Share2, CheckCircle, Inbox } from 'lucide-react';

export function TransactionDetails() {
  const { navigateTo, selectedTransaction } = useContext(AppContext);
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransaction = async () => {
      if (!selectedTransaction) {
        setLoading(false);
        return;
      }
      try {
        // Try to fetch transaction details from API
        const response = await api.users.getTransactions();
        if (response.success) {
          const txns = response.data?.transactions || response.data || [];
          const found = txns.find((t: any) => (t._id || t.id) === selectedTransaction);
          if (found) setTransaction(found);
        }
      } catch (error) {
        console.error('Failed to load transaction:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTransaction();
  }, [selectedTransaction]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500">Loading transaction...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
          <button 
            onClick={() => navigateTo('transactions')}
            className="mb-6 text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white">Transaction Details</h2>
        </div>
        <div className="px-6 mt-12 text-center">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">Transaction not found</p>
          <p className="text-gray-400 text-sm">Select a transaction from the list to view details</p>
          <button
            onClick={() => navigateTo('transactions')}
            className="mt-4 px-6 py-2 bg-[#3D8A75] text-white rounded-xl"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  const isIncome = transaction.type === 'income';
  const amount = Math.abs(transaction.amount || 0);
  const dateStr = transaction.transactionDate 
    ? new Date(transaction.transactionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';
  const timeStr = transaction.transactionDate 
    ? new Date(transaction.transactionDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '';

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
          <div className={`w-16 h-16 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mx-auto mb-4`}>
            <CheckCircle className={`w-8 h-8 ${isIncome ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <p className="text-gray-600 mb-2">Amount</p>
          <h1 className={isIncome ? 'text-green-600' : 'text-red-600'}>
            {isIncome ? '+' : '-'}PKR {amount.toLocaleString()}
          </h1>
          <p className="text-gray-500 mt-2 capitalize">{transaction.status || 'Completed'}</p>
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
            {transaction.transactionId && (
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Transaction ID</span>
                <span className="text-[#102542]">#{transaction.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Type</span>
              <span className="text-[#102542] capitalize">{transaction.type || '--'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Category</span>
              <span className="text-[#102542] capitalize">{transaction.category || '--'}</span>
            </div>
            {dateStr && (
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Date</span>
                <span className="text-[#102542]">{dateStr}</span>
              </div>
            )}
            {timeStr && (
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Time</span>
                <span className="text-[#102542]">{timeStr}</span>
              </div>
            )}
            {transaction.paymentMethod && (
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-[#102542] capitalize">{transaction.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
            )}
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 capitalize">
                {transaction.status || 'completed'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        {transaction.description && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6 shadow-lg mb-6"
          >
            <h3 className="text-[#102542] mb-3">Description</h3>
            <p className="text-gray-600">{transaction.description}</p>
          </motion.div>
        )}

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
