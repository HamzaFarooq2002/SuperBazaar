import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrder } from '../hooks/useOrder';
import api from '../services/api';
import { ArrowLeft, Banknote, CreditCard, Landmark, ChevronRight } from 'lucide-react';
import { DELIVERY_FEE } from '../config/pricing';

export function PaymentMethod() {
  const { navigateTo } = useContext(AppContext);
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { setCurrentOrder, shippingFormData, setShippingFormData } = useOrder();
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'bnpl' | 'bank_financing' | null>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bnplEligibility, setBnplEligibility] = useState<any>(null);
  const [activeBankFinancing, setActiveBankFinancing] = useState<any>(null);

  const isCustomer = user?.userType === 'customer';
  const isMerchant = user?.userType === 'merchant';
  const orderTotal = totalPrice + DELIVERY_FEE;

  useEffect(() => {
    if (!isCustomer) return;
    const checkBnplEligibility = async () => {
      try {
        const categories = items.map((i) => i.category).filter(Boolean).join(',');
        const response = await api.bnpl.getEligibility({ cartTotal: orderTotal, categories });
        setBnplEligibility(response?.data || null);
      } catch {
        setBnplEligibility({ eligible: false });
      }
    };
    checkBnplEligibility();
  }, [orderTotal, isCustomer, items]);

  useEffect(() => {
    if (!isMerchant) return;
    const checkActiveFinancing = async () => {
      try {
        const response = await api.bankFinancing.list();
        const apps = response?.data?.applications || [];
        const active = apps.find((app: any) => ['OFFER_PENDING', 'OFFER_ACCEPTED', 'DISBURSED', 'REPAYING'].includes(app.applicationStatus));
        setActiveBankFinancing(active || null);
      } catch {
        setActiveBankFinancing(null);
      }
    };
    checkActiveFinancing();
  }, [isMerchant]);

  const handleConfirmPayment = async () => {
    if (!selectedMethod) return;
    setLoading(true);
    setError('');

    try {
      const orderData: any = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: selectedMethod,
        shippingAddress: {
          recipientName: shippingFormData?.name || user?.name || '',
          phone: user?.phone || '',
          street: shippingFormData?.address || user?.businessAddress || 'Address not specified',
          city: shippingFormData?.city || 'Karachi',
          state: shippingFormData?.area || '',
          postalCode: '75500',
          country: 'Pakistan'
        }
      };

      if (selectedMethod === 'bnpl') {
        sessionStorage.setItem('pendingBnplOrder', JSON.stringify(orderData));
        navigateTo('bnpl-plan-selection');
        return;
      }

      if (selectedMethod === 'bank_financing') {
        if (activeBankFinancing) {
          navigateTo('bank-financing-dashboard');
          return;
        }
        navigateTo('bank-financing-select');
        return;
      }

      const response = await api.orders.createOrder(orderData);
      if (response.success) {
        setCurrentOrder(response.data.order);
        setShippingFormData(null);
        clearCart();
        navigateTo('order-confirmation');
      }
    } catch (err: any) {
      const backendError = err?.error?.data?.error;
      const backendMessage = err?.error?.data?.message || err?.error?.message;
      setError(backendError || backendMessage || err?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    ...(isMerchant ? [{
      id: 'bank_financing' as const,
      icon: Landmark,
      title: 'Stock Now Pay Later via Bank',
      description: activeBankFinancing
        ? 'You already have an active financing. Repay it before applying again.'
        : 'Apply for inventory financing from your selected bank',
      badge: activeBankFinancing ? 'Active' : 'Bank-facilitated',
      badgeStyle: activeBankFinancing ? 'bg-[#3D8A75]/15 text-[#3D8A75]' : 'bg-yellow-100 text-yellow-700',
      color: 'from-[#102542] to-[#3D8A75]',
      details: activeBankFinancing
        ? `Tap to view your active ${activeBankFinancing.selectedBank} application`
        : 'Bank-issued pricing and tenure · KIBOR + spread'
    }] : []),
    ...(isCustomer && bnplEligibility?.eligible ? [{
      id: 'bnpl' as const,
      icon: CreditCard,
      title: 'Buy Now Pay Later (BNPL)',
      description: 'SuperBazaar Pay Later with 7/14-day plans',
      badge: 'Available',
      badgeStyle: 'bg-yellow-100 text-yellow-700',
      color: 'from-[#102542] to-[#3D8A75]',
      details: `${bnplEligibility?.tier || ''} tier`
    }] : []),
    {
      id: 'cash' as const,
      icon: Banknote,
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      badge: null,
      badgeStyle: '',
      color: 'from-gray-600 to-gray-800',
      details: 'Available in selected areas'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-32">
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button onClick={() => navigateTo('checkout')} className="text-[#102542] flex items-center gap-2"><ArrowLeft className="w-6 h-6" /></button>
          <p className="text-[#102542]">Payment Method</p>
          <div className="w-6" />
        </div>
      </div>

      <div className="px-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-6 mb-6 text-white">
          <p className="text-white/80 text-sm mb-2">Total Amount</p>
          <p className="text-[32px]">PKR {orderTotal.toLocaleString()}</p>
        </motion.div>

        <div className="space-y-4 mb-6">
          <p className="text-[#102542] mb-4">Select Payment Method</p>
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 cursor-pointer hover:bg-white/70 transition-all ${selectedMethod === method.id ? 'ring-2 ring-[#3D8A75] bg-white/70' : ''}`}
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
                        <span className={`inline-block px-2 py-0.5 text-[10px] rounded-full font-medium ${method.badgeStyle}`}>
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-colors ${selectedMethod === method.id ? 'text-[#3D8A75]' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{method.description}</p>
                  <p className="text-[#3D8A75] text-xs">{method.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">{error}</div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button
          onClick={handleConfirmPayment}
          disabled={!selectedMethod || loading}
          className={`w-full h-12 rounded-xl text-white font-medium transition-all ${selectedMethod && !loading ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c]' : 'bg-white/30 text-[#102542]/40 cursor-not-allowed'}`}
        >
          {loading ? 'Processing...' : 'Confirm Payment Method'}
        </button>
      </div>
    </div>
  );
}
