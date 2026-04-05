import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrder } from '../hooks/useOrder';
import { DELIVERY_FEE } from '../config/pricing';
import { ArrowLeft, MapPin, Phone, User, Home, Edit2 } from 'lucide-react';

export function Checkout() {
  const { navigateTo } = useContext(AppContext);
  const { totalPrice } = useCart();
  const { user } = useAuth();
  const { setShippingFormData } = useOrder();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: user?.businessAddress || '',
    city: 'Karachi',
    area: ''
  });

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user?.name || '',
    }));
  }, [user]);

  const subtotal = totalPrice || 0;
  const orderTotal = subtotal + DELIVERY_FEE;

  // Calculate estimated delivery date dynamically
  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5); // 3-5 business days
    return date.toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-32">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigateTo('shopping-cart')}
            className="text-[#102542] flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542]">Checkout</p>
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
                1
              </div>
              <p className="text-[#102542] text-xs">Delivery</p>
            </div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mb-2">
                2
              </div>
              <p className="text-gray-500 text-xs">Payment</p>
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

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-[#102542]">Delivery Address</p>
            <button className="text-[#3D8A75] text-sm flex items-center gap-1">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-600 text-xs mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-xs mb-2 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={user?.phone || ''}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 text-[#102542] cursor-default"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-xs mb-2 block">Delivery Address</label>
              <div className="relative">
                <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  placeholder="Enter delivery address"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75] transition-all resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-600 text-xs mb-2 block">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75] transition-all"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                </select>
              </div>
              <div>
                <label className="text-gray-600 text-xs mb-2 block">Area</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="Area / Neighborhood"
                  className="w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75] transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4"
        >
          <p className="text-[#102542] mb-4">Delivery Time</p>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 px-4 rounded-xl bg-[#3D8A75] text-white text-sm">
              Standard (3-5 days)
            </button>
          </div>
          <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700 text-xs">
              Estimated delivery: {getEstimatedDelivery()}
            </p>
          </div>
        </motion.div>

        {/* Special Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4"
        >
          <label className="text-[#102542] mb-3 block">Special Instructions (Optional)</label>
          <textarea
            placeholder="Any special delivery instructions..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 text-[#102542] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D8A75] transition-all resize-none"
          />
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-500 text-xs">Total Amount</p>
            <p className="text-[#102542] text-[20px]">PKR {orderTotal.toLocaleString()}</p>
          </div>
          <button
            onClick={() => {
              setShippingFormData({
                name: formData.name,
                phone: user?.phone || '',
                address: formData.address,
                city: formData.city,
                area: formData.area
              });
              navigateTo('payment-method');
            }}
            className="flex-1 bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] h-12 rounded-xl text-white font-medium hover:shadow-lg transition-all"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
