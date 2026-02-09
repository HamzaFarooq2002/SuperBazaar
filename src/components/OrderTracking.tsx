import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import api from '../services/api';
import type { Order } from '../services/api.types';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, CreditCard, Loader2 } from 'lucide-react';

export function OrderTracking() {
  const { navigateTo } = useContext(AppContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.orders.getOrders();
      if (response.success) {
        setOrders(response.data.orders || []);
      }
    } catch (err: any) {
      setError(err?.error?.message || 'Failed to load orders');
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format order items
  const formatOrderItems = (order: Order) => {
    if (order.items && order.items.length > 0) {
      return order.items.slice(0, 2).map((item: any) => 
        item.product?.name || 'Product'
      ).join(', ') + (order.items.length > 2 ? '...' : '');
    }
    return 'Order items';
  };

  // Map order status to display status
  const getDisplayStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Processing',
      'confirmed': 'Confirmed',
      'shipped': 'In Transit',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

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
        {/* Loading State */}
        {loading && (
          <div className="glass rounded-3xl p-8 shadow-lg text-center">
            <Loader2 className="w-8 h-8 text-[#3D8A75] mx-auto mb-2 animate-spin" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="glass rounded-3xl p-6 shadow-lg mb-4">
            <p className="text-red-600 text-center mb-4">{error}</p>
            <button
              onClick={loadOrders}
              className="px-6 py-2 bg-[#3D8A75] text-white rounded-xl mx-auto block hover:bg-[#2d6b5c] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="glass rounded-3xl p-8 shadow-lg text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-[#102542] mb-2">No orders yet</p>
            <p className="text-gray-600 text-sm mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigateTo('marketplace')}
              className="px-6 py-3 bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Browse Marketplace
            </button>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.map((order, index) => (
          <motion.div
            key={order._id}
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
                <p className="text-[#102542] mb-1">{formatOrderItems(order)}</p>
                <p className="text-gray-500 text-sm mb-2">Order #{order.orderNumber}</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  order.orderStatus === 'delivered' 
                    ? 'bg-green-100 text-green-600' 
                    : order.orderStatus === 'cancelled'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {getDisplayStatus(order.orderStatus)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-gray-500 text-sm mb-1">Order Date</p>
                <p className="text-[#102542]">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                <p className="text-[#102542]">PKR {order.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {(order.paymentMethod === 'bnpl' || order.paymentMethod === 'credit') && (
              <div className="mt-4 p-3 rounded-xl bg-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-blue-900 text-sm">
                      {order.paymentMethod === 'bnpl' ? 'Buy Now Pay Later' : 'Nano Loan'}
                    </p>
                    <p className="text-blue-600 text-xs">Payment Status: {order.paymentStatus}</p>
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