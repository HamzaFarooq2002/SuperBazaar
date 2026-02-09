import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Wallet, TrendingUp, Clock, CheckCircle, Zap } from 'lucide-react';

export function NanoLoan() {
  const { navigateTo } = useContext(AppContext);
  const [loanAmount, setLoanAmount] = useState(25000);

  const minLoan = 5000;
  const maxLoan = 50000;

  const loanDetails = {
    tenure: 6, // months
    interest: 0, // 0% interest
    cashback: 5, // 5%
    monthlyPayment: Math.round(loanAmount / 6),
    cashbackAmount: Math.round(loanAmount * 0.05)
  };

  const benefits = [
    { icon: Zap, title: 'Instant Approval', desc: 'Get approved in 2 minutes' },
    { icon: Wallet, title: '0% Interest', desc: 'No hidden charges' },
    { icon: TrendingUp, title: '5% Cashback', desc: 'On every loan disbursed' },
    { icon: Clock, title: 'Flexible Tenure', desc: 'Pay back in 6 months' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigateTo('customer-dashboard')}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-6" />
        </div>
        <h2 className="text-white mb-2">Nano Loan</h2>
        <p className="text-white/80 text-sm">Quick cash when you need it</p>
      </div>

      <div className="px-6 mt-6">
        {/* Loan Amount Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-6 mb-6"
        >
          <p className="text-[#102542] mb-4">Select Loan Amount</p>
          <div className="text-center mb-6">
            <p className="text-[#3D8A75] text-[40px] mb-2">PKR {loanAmount.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Monthly Payment: PKR {loanDetails.monthlyPayment.toLocaleString()}</p>
          </div>
          <input
            type="range"
            min={minLoan}
            max={maxLoan}
            step={1000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D8A75]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>PKR {minLoan.toLocaleString()}</span>
            <span>PKR {maxLoan.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Loan Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-6"
        >
          <p className="text-[#102542] mb-4">Loan Details</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Loan Amount</span>
              <span className="text-[#102542]">PKR {loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Repayment Tenure</span>
              <span className="text-[#102542]">{loanDetails.tenure} months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Interest Rate</span>
              <span className="text-green-600">{loanDetails.interest}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Cashback</span>
              <span className="text-green-600">+ PKR {loanDetails.cashbackAmount.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-[#102542]">Monthly Payment</span>
              <span className="text-[#3D8A75] text-[18px]">PKR {loanDetails.monthlyPayment.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-6"
        >
          <p className="text-[#102542] mb-4">Why Choose Nano Loan?</p>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-2">
                  <benefit.icon className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-[#102542] text-sm mb-1">{benefit.title}</p>
                <p className="text-gray-500 text-xs">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Eligibility */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-800 mb-1">You're Eligible!</p>
              <p className="text-green-700 text-sm">Based on your credit score and purchase history, you qualify for a nano loan up to PKR 50,000.</p>
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 mb-4"
        >
          <p className="text-gray-600 text-xs leading-relaxed">
            By applying for this loan, you agree to our Terms & Conditions. The loan will be disbursed to your Super Bazaar wallet instantly upon approval. Monthly installments will be auto-debited from your linked account.
          </p>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button
          onClick={() => navigateTo('success')}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 h-12 rounded-xl text-white font-medium hover:shadow-lg transition-all"
        >
          Apply for Nano Loan
        </button>
      </div>
    </div>
  );
}
