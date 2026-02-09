import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ShoppingBag, CreditCard, Gift, TrendingUp, Package, Wallet, Bell, User, ChevronRight, Star, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CustomerDashboard() {
  const { navigateTo } = useContext(AppContext);

  const quickActions = [
    { icon: ShoppingBag, label: 'Shop Now', color: 'from-[#3D8A75] to-[#2d6b5c]', screen: 'customer-marketplace' as const },
    { icon: Package, label: 'My Orders', color: 'from-[#102542] to-[#3D8A75]', screen: 'order-tracking' as const },
    { icon: Wallet, label: 'Nano Loan', color: 'from-purple-600 to-purple-800', screen: 'nano-loan' as const },
    { icon: Gift, label: 'Rewards', color: 'from-orange-500 to-orange-700', screen: 'rewards' as const }
  ];

  const featuredProducts = [
    {
      id: '1',
      name: 'Samsung Galaxy A54',
      price: 89999,
      originalPrice: 99999,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9kZXJufGVufDF8fHx8MTc2MzY0MTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      installment: 7499
    },
    {
      id: '2',
      name: 'Nike Air Max Shoes',
      price: 15999,
      originalPrice: 18999,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc2hvZXN8ZW58MXx8fHwxNzYzNjQxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      installment: 1333
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-2401',
      status: 'Delivered',
      date: 'Nov 24, 2024',
      amount: 45999,
      items: 2
    },
    {
      id: 'ORD-2389',
      status: 'In Transit',
      date: 'Nov 22, 2024',
      amount: 12500,
      items: 1
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-white/80 text-sm mb-1">Welcome back,</p>
            <h2 className="text-white">Ahmed Khan</h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigateTo('shopping-cart')}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors relative"
            >
              <ShoppingBag className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                3
              </div>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Available Balance</p>
              <p className="text-white text-[28px]">PKR 12,450</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">Cashback Earned</p>
              <p className="text-white">PKR 2,340</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">Reward Points</p>
              <p className="text-white">1,250 pts</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigateTo(action.screen)}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg hover:scale-105 transition-transform`}>
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-[#102542] text-xs text-center">{action.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Nano Loan Offer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigateTo('nano-loan')}
          className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-5 mb-6 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <p className="text-yellow-300 text-sm">Instant Approval</p>
              </div>
              <p className="text-white text-[20px] mb-2">Get Nano Loan</p>
              <p className="text-white/80 text-sm mb-3">Up to PKR 50,000 with 5% cashback</p>
              <button className="px-4 py-2 bg-white text-purple-700 rounded-lg text-sm hover:bg-white/90 transition-colors">
                Apply Now
              </button>
            </div>
            <CreditCard className="w-12 h-12 text-white/30" />
          </div>
        </motion.div>

        {/* Featured Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-[#102542]">Featured Products</p>
            <button 
              onClick={() => navigateTo('customer-marketplace')}
              className="text-[#3D8A75] text-sm flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => navigateTo('product-detail')}
                className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <div className="h-40 bg-gray-100">
                    <ImageWithFallback 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {product.discount}% OFF
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[#102542] text-sm mb-2 line-clamp-2">{product.name}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-600 text-xs">{product.rating}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-[#3D8A75]">PKR {product.price.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs line-through">PKR {product.originalPrice.toLocaleString()}</p>
                  </div>
                  <p className="text-[#102542] text-xs opacity-70">
                    or PKR {product.installment}/month
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-[#102542]">Recent Orders</p>
            <button 
              onClick={() => navigateTo('order-tracking')}
              className="text-[#3D8A75] text-sm flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                onClick={() => navigateTo('order-tracking')}
                className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 cursor-pointer hover:bg-white/70 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#3D8A75]/20 flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#3D8A75]" />
                    </div>
                    <div>
                      <p className="text-[#102542] mb-1">{order.id}</p>
                      <p className="text-gray-500 text-xs">{order.items} items • {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs mb-1 px-2 py-1 rounded-full inline-block ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </p>
                    <p className="text-[#102542] text-sm">PKR {order.amount.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl p-5 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Special Offer</p>
              <p className="text-white text-[18px] mb-2">Flash Sale Today!</p>
              <p className="text-white/90 text-sm mb-3">Get up to 50% off on selected items</p>
              <button 
                onClick={() => navigateTo('customer-marketplace')}
                className="px-4 py-2 bg-white text-orange-600 rounded-lg text-sm hover:bg-white/90 transition-colors"
              >
                Shop Now
              </button>
            </div>
            <Gift className="w-12 h-12 text-white/30" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
