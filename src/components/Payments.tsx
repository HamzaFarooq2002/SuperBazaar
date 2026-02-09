import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, CreditCard, Building, Smartphone, DollarSign } from 'lucide-react';

export function Payments() {
  const { navigateTo } = useContext(AppContext);

  const paymentMethods = [
    { id: '1', type: 'Credit Card', last4: '4242', brand: 'Visa', icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
    { id: '2', type: 'Bank Account', last4: '6789', brand: 'Chase', icon: Building, color: 'bg-green-100 text-green-600' },
    { id: '3', type: 'Digital Wallet', last4: 'PayPal', brand: 'PayPal', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
  ];

  const recentPayments = [
    { id: '1', description: 'Software Subscription', amount: 99, date: 'Nov 19, 2025', status: 'completed', method: 'Visa •••• 4242' },
    { id: '2', description: 'Office Supplies', amount: 340, date: 'Nov 18, 2025', status: 'completed', method: 'Chase •••• 6789' },
    { id: '3', description: 'Marketing Campaign', amount: 1200, date: 'Nov 17, 2025', status: 'pending', method: 'PayPal' },
    { id: '4', description: 'Freelancer Payment', amount: 2500, date: 'Nov 15, 2025', status: 'completed', method: 'Chase •••• 6789' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-24">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white mb-2">Payments</h2>
        <p className="text-[#CDD7D6]">Manage payment methods and history</p>
      </div>

      <div className="px-6 -mt-16">
        {/* Balance Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-dark rounded-3xl p-6 shadow-2xl mb-6"
        >
          <p className="text-white/80 mb-2">Available Balance</p>
          <h1 className="text-white mb-4">$26,340.50</h1>
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-white text-[#102542] hover:bg-white/90 transition-colors">
              Withdraw
            </button>
            <button className="flex-1 py-3 rounded-xl bg-[#3D8A75] text-white hover:bg-[#2d6a5c] transition-colors">
              Add Funds
            </button>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#102542]">Payment Methods</h3>
            <button className="text-[#3D8A75]">+ Add New</button>
          </div>
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl ${method.color} flex items-center justify-center`}>
                    <method.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#102542] mb-1">{method.type}</p>
                    <p className="text-gray-500">{method.brand} •••• {method.last4}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#3D8A75] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#3D8A75]"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div>
          <h3 className="text-[#102542] mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {recentPayments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="glass rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[#102542] mb-1">{payment.description}</p>
                    <p className="text-gray-500">{payment.date}</p>
                  </div>
                  <span className="text-[#102542]">-${payment.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{payment.method}</span>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    payment.status === 'completed' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
