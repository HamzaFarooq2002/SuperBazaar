import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrder } from '../hooks/useOrder';
import api from '../services/api';
import { ArrowLeft, CreditCard, Wallet, CircleDollarSign, Banknote, ChevronRight } from 'lucide-react';

export function PaymentMethod() {
  const { navigateTo } = useContext(AppContext);
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { setCurrentOrder } = useOrder();
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'installment' | 'nano-loan' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = 500;
  const orderTotal = totalPrice + deliveryFee;

  const handleConfirmPayment = async () => {
    if (!selectedMethod) return;

    setLoading(true);
    setError('');

    try {
      // Map UI payment method to API payment method
      // Backend accepts: 'cash', 'bank_transfer', 'snpl', 'bnpl'
      const apiPaymentMethod = 
        selectedMethod === 'installment' ? 'bnpl' :
        selectedMethod === 'nano-loan' ? 'snpl' : 'cash';

      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,  // Backend expects "productId" not "product"
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: apiPaymentMethod,
        shippingAddress: {
          street: user?.businessAddress || 'Shop address',
          city: 'Karachi',
          postalCode: '75500',
          country: 'Pakistan'
        }
      };

      // Debug logging
      console.log('🛒 Cart Items:', items);
      console.log('📦 Order Data Being Sent:', orderData);
      console.log('🆔 Product IDs:', orderData.items.map(i => i.productId));

      // Validate product IDs before sending
      const invalidItems = orderData.items.filter(item => !item.productId || item.productId === 'undefined' || item.productId === '1');
      if (invalidItems.length > 0) {
        console.error('❌ Invalid items detected:', invalidItems);
        throw new Error(`Invalid product IDs detected. Please clear your cart and add products fresh from marketplace. Invalid items: ${invalidItems.length}`);
      }

      const response = await api.orders.createOrder(orderData);

      if (response.success) {
        // Store order for confirmation page
        setCurrentOrder(response.data.order);
        // Clear cart after successful order
        clearCart();
        // Navigate to confirmation
        navigateTo('order-confirmation');
      }
    } catch (err: any) {
      // Extract the most specific error message available
      // The api.js interceptor wraps errors as: { success, error: { message, status, data } }
      // The backend returns: { success, message, error: "detailed error string" }
      const backendError = err?.error?.data?.error;  // The detailed error from backend
      const backendMessage = err?.error?.data?.message || err?.error?.message;
      const errorMessage = backendError || backendMessage || err?.message || 'Failed to create order';
      setError(errorMessage);
      console.error('❌ Order creation error:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'installment' as const,
      icon: CreditCard,
      title: 'Pay in Installments',
      description: `Split into 4 easy payments of PKR ${Math.round(orderTotal / 4).toLocaleString()}`,
      badge: 'Popular',
      color: 'from-[#3D8A75] to-[#102542]',
      details: '0% markup for 3 months'
    },
    {
      id: 'nano-loan' as const,
      icon: Wallet,
      title: 'Nano Loan',
      description: 'Get instant nano loan up to PKR 50,000',
      badge: 'Cashback 5%',
      color: 'from-[#102542] to-[#3D8A75]',
      details: 'Pay back in 6 months'
    },
    {
      id: 'cash' as const,
      icon: Banknote,
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      badge: null,
      color: 'from-gray-600 to-gray-800',
      details: 'Available in selected areas'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-32">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigateTo('checkout')}
            className="text-[#102542] flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542]">Payment Method</p>
          <div className="w-6" />
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#3D8A75] flex items-center justify-center text-white mb-2">
                ✓
              </div>
              <p className="text-[#102542] text-xs">Delivery</p>
            </div>
            <div className="flex-1 h-px bg-[#3D8A75]" />
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#3D8A75] flex items-center justify-center text-white mb-2">
                2
              </div>
              <p className="text-[#102542] text-xs">Payment</p>
            </div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mb-2">
                3
              </div>
              <p className="text-gray-500 text-xs">Confirm</p>
            </div>
          </div>
        </motion.div>

        {/* Order Amount */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-6 mb-6 text-white"
        >
          <p className="text-white/80 text-sm mb-2">Total Amount</p>
          <p className="text-[32px]">PKR {orderTotal.toLocaleString()}</p>
        </motion.div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-6">
          <p className="text-[#102542] mb-4">Select Payment Method</p>
          
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 cursor-pointer transition-all hover:bg-white/70 hover:scale-[1.02] ${
                selectedMethod === method.id ? 'ring-2 ring-[#3D8A75] bg-white/70' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[#102542] mb-1">{method.title}</p>
                      {method.badge && (
                        <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-colors ${
                      selectedMethod === method.id ? 'text-[#3D8A75]' : 'text-gray-400'
                    }`} />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{method.description}</p>
                  <p className="text-[#3D8A75] text-xs">{method.details}</p>
                </div>
              </div>

              {/* Installment Breakdown */}
              {method.id === 'installment' && selectedMethod === 'installment' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <p className="text-[#102542] text-sm mb-3">Payment Schedule</p>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Payment {num}</span>
                        <span className="text-[#102542]">PKR {Math.round(orderTotal / 4).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Nano Loan Details */}
              {method.id === 'nano-loan' && selectedMethod === 'nano-loan' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Loan Amount</span>
                      <span className="text-[#102542]">PKR {orderTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Cashback (5%)</span>
                      <span className="text-green-600">- PKR {(orderTotal * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Monthly Payment</span>
                      <span className="text-[#102542]">PKR {Math.round(orderTotal / 6).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4"
          >
            {error}
          </motion.div>
        )}

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 text-center"
        >
          <p className="text-[#102542] text-sm">
            <span className="font-bold">🔒</span> Your payment information is secure and encrypted
          </p>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button
          onClick={handleConfirmPayment}
          disabled={!selectedMethod || loading}
          className={`w-full h-12 rounded-xl text-white font-medium transition-all ${
            selectedMethod && !loading
              ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] hover:shadow-lg hover:scale-[1.02]' 
              : 'bg-white/30 text-[#102542]/40 cursor-not-allowed'
          }`}
        >
          {loading ? 'Creating Order...' : 'Confirm Payment Method'}
        </button>
      </div>
    </div>
  );
}
