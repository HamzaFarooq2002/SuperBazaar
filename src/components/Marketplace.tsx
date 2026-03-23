import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Search, ShoppingCart, Star, CreditCard, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import api from '../services/api';
import type { Product } from '../services/api.types';

export function Marketplace() {
  const { navigateTo, setSelectedProduct } = useContext(AppContext);
  const { addItem, totalItems } = useCart();
  const { user } = useAuth();
  const homeDashboard =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';

  const categories = ['All', 'Groceries', 'Beverages', 'Snacks', 'Personal Care', 'Household'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = activeCategory !== 'All' ? { category: activeCategory } : {};
      const response = await api.products.getProducts(params);
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (err: any) {
      setError(err?.error?.message || 'Failed to load products');
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to detail page
    addItem({
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      supplier: product.supplier?._id || product.supplier || product._id,
      supplierName: product.supplierName,
      image: product.mainImage
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigateTo(homeDashboard)}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigateTo('shopping-cart')}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
        <h2 className="text-white mb-2">Wholesale Marketplace</h2>
        <p className="text-[#CDD7D6] text-sm mb-6">Stock your shop with Stocknow Paylater</p>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search wholesale products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCategory === category 
                  ? 'bg-[#3D8A75] text-white' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-600">Loading products...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 pb-4">
            {products.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedProduct?.(item);
                navigateTo('product-detail');
              }}
              className="glass rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="h-36 bg-gray-100 overflow-hidden">
                <ImageWithFallback 
                  src={item.mainImage} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <p className="text-[#102542] mb-1 text-sm line-clamp-2">{item.name}</p>
                <p className="text-gray-500 text-xs mb-2">{item.supplierName}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600 text-xs">{item.rating?.average || 0}</span>
                  <span className="text-gray-400 text-xs">({item.rating?.count || 0})</span>
                </div>
                <div className="mb-3">
                  <p className="text-[#3D8A75]">PKR {item.price.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">{item.unit}</p>
                </div>
                <button 
                  onClick={(e) => handleQuickAdd(item, e)}
                  className="w-full py-2 rounded-lg bg-[#3D8A75] text-white text-sm hover:bg-[#2d6a5c] transition-colors flex items-center justify-center gap-1 mt-auto"
                >
                  <CreditCard className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
}