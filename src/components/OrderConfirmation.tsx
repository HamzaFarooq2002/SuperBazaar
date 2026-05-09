import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useOrder } from '../hooks/useOrder';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle, Package, MapPin, CreditCard, Calendar } from 'lucide-react';

export function OrderConfirmation() {
  const { navigateTo } = useContext(AppContext);
  const { currentOrder } = useOrder();
  const { user } = useAuth();
  const homeMarketplace = user?.userType === 'customer' ? 'customer-marketplace' : 'marketplace';

  // If no order data, show fallback or redirect
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
        <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-8 text-center">
          <p className="text-[#102542] mb-4">No order found</p>
          <button
            onClick={() => navigateTo(homeMarketplace)}
            className="px-6 py-3 bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white rounded-xl hover:shadow-lg transition-all"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Format payment method for display
  const paymentMethodDisplay = 
    currentOrder.paymentMethod === 'bank_financing' ? 'Bank Financing' :
    currentOrder.paymentMethod === 'cash' ? 'Cash on Delivery' : 
    currentOrder.paymentMethod;

  const orderDetails = {
    orderId: currentOrder.orderNumber || 'N/A',
    date: currentOrder.createdAt ? new Date(currentOrder.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now',
    estimatedDelivery: currentOrder.estimatedDelivery 
      ? new Date(currentOrder.estimatedDelivery).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : 'To be confirmed',
    items: currentOrder.items?.length ?? 0,
    total: currentOrder.totalAmount ?? 0,
    paymentMethod: paymentMethodDisplay,
    deliveryAddress: currentOrder.shippingAddress
      ? [currentOrder.shippingAddress.street, currentOrder.shippingAddress.city].filter(Boolean).join(', ') || 'Address not specified'
      : 'Address not specified'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-24">
      {/* Success Animation */}
      <div className="px-6 pt-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-[#3D8A75] to-[#2d6b5c] rounded-full flex items-center justify-center">
              <CheckCircle className="w-20 h-20 text-white" strokeWidth={2} />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute inset-0 bg-[#3D8A75] rounded-full"
            />
          </div>
        </motion.div>

        {currentOrder.paymentMethod === 'bnpl' && currentOrder.bnplDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4"
          >
            <p className="text-[#102542] mb-3">BNPL Summary</p>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Principal: PKR {Number(currentOrder.bnplDetails.principal || 0).toLocaleString()}</p>
              <p>Tenure: {currentOrder.bnplDetails.tenureDays} days</p>
              <p>Due Date: {currentOrder.bnplDetails.dueDate ? new Date(currentOrder.bnplDetails.dueDate).toLocaleDateString('en-PK') : '-'}</p>
              <p>Total Payable: PKR {Number(currentOrder.bnplDetails.totalPayable || 0).toLocaleString()}</p>
            </div>
          </motion.div>
        )}

        {currentOrder.paymentMethod === 'bank_financing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4"
          >
            <p className="text-[#102542] mb-3">Bank Financing Summary</p>
            <div className="space-y-2 text-sm text-gray-700">
              <p>This order was financed by the selected bank. SuperBazaar facilitated the application and supplier settlement.</p>
              <p>Financing status: {currentOrder.financingStatus === 'BANK_DISBURSED' ? 'Bank disbursed' : currentOrder.financingStatus || 'Pending'}</p>
              {currentOrder.financingApplication && <p>Application reference: {String(currentOrder.financingApplication)}</p>}
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-[#102542] text-[24px] mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 text-sm">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </motion.div>

        {/* Order ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-6 mb-6 text-white"
        >
          <p className="text-white/80 text-sm mb-2">Order ID</p>
          <p className="text-[24px] tracking-wider mb-4">{orderDetails.orderId}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">Order Date</span>
            <span>{orderDetails.date}</span>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4"
        >
          <p className="text-[#102542] mb-4">Order Summary</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3D8A75]/20 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#3D8A75]" />
              </div>
              <div className="flex-1">
                <p className="text-[#102542] text-sm mb-1">Items</p>
                <p className="text-gray-600 text-sm">{orderDetails.items} products</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3D8A75]/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#3D8A75]" />
              </div>
              <div className="flex-1">
                <p className="text-[#102542] text-sm mb-1">Delivery Address</p>
                <p className="text-gray-600 text-sm">{orderDetails.deliveryAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3D8A75]/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#3D8A75]" />
              </div>
              <div className="flex-1">
                <p className="text-[#102542] text-sm mb-1">Estimated Delivery</p>
                <p className="text-gray-600 text-sm">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3D8A75]/20 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-[#3D8A75]" />
              </div>
              <div className="flex-1">
                <p className="text-[#102542] text-sm mb-1">Payment Method</p>
                <p className="text-gray-600 text-sm">{orderDetails.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-[#102542]">Total Amount</span>
              <span className="text-[#3D8A75] text-[20px]">PKR {orderDetails.total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Track Order Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigateTo('order-tracking')}
          className="w-full bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] h-12 rounded-xl text-white font-medium mb-3 hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          Track Your Order
        </motion.button>

        {/* Continue Shopping */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => navigateTo(homeMarketplace)}
          className="w-full bg-white/50 backdrop-blur-md border border-white/60 h-12 rounded-xl text-[#102542] font-medium hover:bg-white/70 transition-all"
        >
          Continue Shopping
        </motion.button>

      </div>
    </div>
  );
}
