import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Check, Circle, Home, Receipt, Wallet, User } from 'lucide-react';

export function SNPLDetails() {
  const { navigateTo } = useContext(AppContext);
  const [autoRepayment, setAutoRepayment] = React.useState(false);

  const installments = [
    {
      number: 1,
      amount: 1250,
      status: 'paid',
      date: 'May 15'
    },
    {
      number: 2,
      amount: 1250,
      status: 'paid',
      date: 'June 15'
    },
    {
      number: 3,
      amount: 1250,
      status: 'pending',
      date: 'July 15'
    },
    {
      number: 4,
      amount: 1250,
      status: 'pending',
      date: 'August 15'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <button 
          onClick={() => navigateTo('payments-main')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6 text-[#102542]" />
        </button>
        <h2 className="text-[#102542] text-[18px] font-bold text-center">Loan Details</h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Loan Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-[22px] font-bold text-[#102542]">Loan Summary</h3>
          
          {/* Remaining Balance */}
          <div className="glass rounded-2xl p-6 bg-gray-50">
            <p className="text-[14px] text-[#102542] mb-2">Remaining Balance</p>
            <p className="text-[28px] font-bold text-[#102542]">PKR 2,500</p>
          </div>

          {/* Next Payment & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 border border-gray-200">
              <p className="text-[14px] text-[#102542] mb-2">Next Payment</p>
              <p className="text-[24px] font-bold text-[#102542]">PKR 1,250</p>
            </div>
            <div className="glass rounded-2xl p-4 border border-gray-200">
              <p className="text-[14px] text-[#102542] mb-2">Due Date</p>
              <p className="text-[24px] font-bold text-[#102542]">July 15, 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-[18px] font-bold text-[#102542] mb-4">Payment Schedule</h3>
          
          <div className="space-y-4">
            {installments.map((installment, index) => (
              <div key={installment.number} className="flex items-start gap-4">
                {/* Icon */}
                <div className="mt-1">
                  {installment.status === 'paid' ? (
                    <div className="w-6 h-6 rounded-full bg-[#3D8A75] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6 border-l-2 border-gray-200 pl-4 -ml-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[16px] font-bold text-[#102542]">
                      Installment {installment.number}
                    </p>
                    <p className="text-[14px] font-bold text-[#102542]">
                      PKR {installment.amount.toLocaleString()}
                    </p>
                  </div>
                  <p className={`text-[14px] ${
                    installment.status === 'paid' ? 'text-[#3D8A75]' : 'text-gray-500'
                  }`}>
                    {installment.status === 'paid' ? 'Paid' : `Due ${installment.date}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Automatic Repayments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-[18px] font-bold text-[#102542] mb-4">Automatic Repayments</h3>
          
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#102542]">Enable Automatic Repayments</p>
            <button
              onClick={() => setAutoRepayment(!autoRepayment)}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                autoRepayment ? 'bg-[#3D8A75]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  autoRepayment ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>
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
          <button
            onClick={() => navigateTo('payments-main')}
            className="flex flex-col items-center gap-1"
          >
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
