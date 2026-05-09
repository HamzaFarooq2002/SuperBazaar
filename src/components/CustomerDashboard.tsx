import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ShoppingBag, Gift, Package, Wallet, User, ChevronRight, Star, BarChart3 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CustomerDashboard() {
  const { navigateTo, setSelectedProduct } = useContext(AppContext);
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [cashbackEarned, setCashbackEarned] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured products from API
        const prodResponse = await api.products.getProducts({ limit: 2 });
        if (prodResponse.success) {
          const products = prodResponse.data?.products || prodResponse.data || [];
          setFeaturedProducts(products.slice(0, 2).map((p: any) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.price ? Math.round(p.price * 1.15) : 0,
            discount: 15,
            image: p.mainImage || p.image || '',
            rating: 4.5,
            installment: p.price ? Math.round(p.price / 12) : 0,
            raw: p
          })));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }

      try {
        const walletRes = await api.users.getWallet();
        if (walletRes.success) {
          setWalletBalance(walletRes.data?.walletBalance ?? 0);
        }
      } catch (err) {
        console.error('Failed to load wallet:', err);
      }

      try {
        const rewardsRes = await api.users.getRewards();
        if (rewardsRes.success) {
          setRewardPoints(rewardsRes.data?.totalPoints ?? 0);
          setCashbackEarned(rewardsRes.data?.cashbackEarned ?? 0);
        }
      } catch (err) {
        console.error('Failed to load rewards:', err);
      }

      try {
        const orderResponse = await api.orders.getOrders();
        if (orderResponse.success) {
          const orders = orderResponse.data?.orders || orderResponse.data || [];
          setRecentOrders(orders.slice(0, 3).map((o: any) => ({
            id: o.orderNumber || o._id,
            status: o.status === 'delivered' ? 'Delivered' : o.status === 'shipped' ? 'In Transit' : 'Processing',
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
            amount: o.totalAmount || 0,
            items: o.items?.length || 0
          })));
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    };
    loadData();
  }, []);

  const quickActions = [
    { icon: ShoppingBag, label: 'Shop Now', color: 'from-[#3D8A75] to-[#2d6b5c]', screen: 'customer-marketplace' as const },
    { icon: Package, label: 'My Orders', color: 'from-[#102542] to-[#3D8A75]', screen: 'order-tracking' as const },
    { icon: Wallet, label: 'Payments', color: 'from-[#102542] to-[#3D8A75]', screen: 'payments-main' as const },
    { icon: Gift, label: 'Rewards', color: 'from-orange-500 to-orange-700', screen: 'rewards' as const },
    { icon: BarChart3, label: 'Credit Score', color: 'from-blue-600 to-cyan-700', screen: 'credit-score-initiate' as const }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-white/80 text-sm mb-1">Welcome back,</p>
            <h2 className="text-white">{user?.name || 'Customer'}</h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigateTo('shopping-cart')}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors relative"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {totalItems}
                </div>
              )}
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
              <p className="text-white text-[28px]">PKR {walletBalance.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">Cashback Earned</p>
              <p className="text-white">PKR {cashbackEarned.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">Reward Points</p>
              <p className="text-white">{rewardPoints.toLocaleString()} pts</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
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
            {featuredProducts.length === 0 ? (
              <div className="col-span-2 text-center py-6">
                <p className="text-gray-400 text-sm">No products available yet</p>
              </div>
            ) : (
              featuredProducts.map((product: any, index: number) => (
                <motion.div
                  key={product.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={() => {
                    setSelectedProduct?.(product.raw || product);
                    navigateTo('product-detail');
                  }}
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
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[#102542] text-sm mb-2 line-clamp-2">{product.name}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-600 text-xs">{product.rating}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <p className="text-[#3D8A75]">PKR {(product.price || 0).toLocaleString()}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-gray-400 text-xs line-through">PKR {product.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                    {product.installment > 0 && (
                      <p className="text-[#102542] text-xs opacity-70">
                        or PKR {product.installment}/month
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
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
            {recentOrders.length === 0 ? (
              <div className="text-center py-6">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No orders yet. Start shopping!</p>
              </div>
            ) : (
              recentOrders.map((order: any, index: number) => (
                <motion.div
                  key={order.id || index}
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
                      <p className="text-[#102542] text-sm">PKR {(order.amount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
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
