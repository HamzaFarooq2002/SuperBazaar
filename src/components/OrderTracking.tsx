import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, CreditCard } from 'lucide-react';

export function OrderTracking() {
  const { navigateTo } = useContext(AppContext);

  const orders = [
    {
      id: 'ORD-2025-1234',
      items: 'Rice 50kg, Cooking Oil 5L',
      supplier: 'Metro Wholesale',
      date: 'Nov 18, 2025',
      amount: 45200,
      status: 'In Transit',
      paylater: true,
      dueDate: 'Dec 15, 2025'
    },
    {
      id: 'ORD-2025-1198',
      items: 'Tea 1kg, Sugar 50kg',
      supplier: 'Shah Wholesale',
      date: 'Nov 15, 2025',
      amount: 32800,
      status: 'Delivered',
      paylater: true,
      dueDate: 'Dec 12, 2025'
    },
    {
      id: 'ORD-2025-1142',
      items: 'Biscuits Carton, Chips Box',
      supplier: 'Lahore Wholesale',
      date: 'Nov 12, 2025',
      amount: 18500,
      status: 'Delivered',
      paylater: true,
      dueDate: 'Dec 10, 2025'
    }
  ];

  const trackingSteps = [
    { status: 'Order Placed', date: 'Nov 18, 2:30 PM', completed: true, icon: CheckCircle },
    { status: 'Processing', date: 'Nov 18, 4:15 PM', completed: true, icon: Package },
    { status: 'Shipped', date: 'Nov 19, 9:00 AM', completed: true, icon: Truck },
    { status: 'Out for Delivery', date: 'Nov 20, 8:30 AM', completed: false, icon: Clock },
    { status: 'Delivered', date: 'Expected by end of day', completed: false, icon: CheckCircle },
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
        <h2 className="text-white mb-2">My Orders</h2>
        <p className="text-[#CDD7D6]">Track your wholesale purchases</p>
      </div>

      <div className="px-6 -mt-16">
        {/* Orders List */}
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-3xl p-6 shadow-lg mb-4"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#102542] mb-1">{order.items}</p>
                <p className="text-gray-500 text-sm mb-2">{order.supplier}</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  order.status === 'Delivered' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-gray-500 text-sm mb-1">Order Date</p>
                <p className="text-[#102542]">{order.date}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                <p className="text-[#102542]">PKR {order.amount.toLocaleString()}</p>
              </div>
            </div>

            {order.paylater && (
              <div className="mt-4 p-3 rounded-xl bg-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-blue-900 text-sm">Stocknow Paylater</p>
                    <p className="text-blue-600 text-xs">Due: {order.dueDate}</p>
                  </div>
                </div>
              </div>
            )}

            <button className="w-full mt-4 py-3 rounded-xl bg-[#3D8A75] text-white hover:bg-[#2d6a5c] transition-colors">
              View Details
            </button>
          </motion.div>
        ))}

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <button 
            onClick={() => navigateTo('marketplace')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Order More Stock
          </button>
        </motion.div>
      </div>
    </div>
  );
}