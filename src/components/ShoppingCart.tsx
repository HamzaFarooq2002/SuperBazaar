import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ShoppingCart() {
  const { navigateTo } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Rice - 50kg Bag',
      price: 8500,
      quantity: 2,
      seller: 'Metro Wholesale',
      image: 'https://images.unsplash.com/photo-1646980990815-1e97d5ee932f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYmFnJTIwZ3JhaW5zfGVufDF8fHx8MTc2MzY0MTk3NHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      name: 'Cooking Oil - 5L (Pack of 4)',
      price: 3200,
      quantity: 1,
      seller: 'Bismillah Traders',
      image: 'https://images.unsplash.com/photo-1757801333069-f7b3cabaec4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwb2lsJTIwYm90dGxlc3xlbnwxfHx8fDE3NjM2NDE5NzR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '3',
      name: 'Tea - 1kg Pack',
      price: 1500,
      quantity: 3,
      seller: 'Shah Wholesale',
      image: 'https://images.unsplash.com/photo-1597916375079-1201154a650c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBsZWF2ZXMlMjBwYWNrYWdlfGVufDF8fHx8MTc2MzY0MTk3NXww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 500;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-32">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigateTo('marketplace')}
            className="text-[#102542] flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542]">Shopping Cart</p>
          <div className="w-6" />
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Cart Empty State */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-8 text-center"
          >
            <ShoppingBag className="w-16 h-16 text-[#102542] opacity-30 mx-auto mb-4" />
            <p className="text-[#102542] mb-2">Your cart is empty</p>
            <p className="text-gray-500 text-sm mb-6">Add products to get started</p>
            <button
              onClick={() => navigateTo('marketplace')}
              className="px-6 py-3 bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Browse Marketplace
            </button>
          </motion.div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[#102542] text-sm mb-1">{item.name}</p>
                          <p className="text-gray-500 text-xs">{item.seller}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[#3D8A75]">PKR {item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center text-[#102542] hover:bg-white transition-colors disabled:opacity-40"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-[#102542] w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center text-[#102542] hover:bg-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-[#3D8A75]" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 bg-transparent text-[#102542] placeholder:text-gray-400 focus:outline-none"
                />
                <button className="px-4 py-2 bg-[#3D8A75] text-white rounded-lg text-sm hover:bg-[#2d6b5c] transition-colors">
                  Apply
                </button>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-6"
            >
              <p className="text-[#102542] mb-4">Order Summary</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Subtotal ({cartItems.length} items)</span>
                  <span className="text-[#102542]">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Delivery Fee</span>
                  <span className="text-[#102542]">PKR {deliveryFee.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Discount</span>
                    <span className="text-green-600">- PKR {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-[#102542]">Total</span>
                  <span className="text-[#3D8A75] text-[20px]">PKR {total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-500 text-xs">Total Amount</p>
              <p className="text-[#102542] text-[20px]">PKR {total.toLocaleString()}</p>
            </div>
            <button
              onClick={() => navigateTo('checkout')}
              className="flex-1 bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] h-12 rounded-xl text-white font-medium hover:shadow-lg transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
