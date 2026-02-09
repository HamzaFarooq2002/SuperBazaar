import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import { ArrowLeft, Search, ShoppingBag, Star, Heart, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CustomerMarketplace() {
  const { navigateTo } = useContext(AppContext);
  const { totalItems } = useCart();

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty'];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const products = [
    {
      id: '1',
      name: 'Samsung Galaxy A54 5G',
      price: 89999,
      originalPrice: 99999,
      discount: 10,
      rating: 4.5,
      reviews: 324,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9kZXJufGVufDF8fHx8MTc2MzY0MTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      installment: 7499
    },
    {
      id: '2',
      name: 'Nike Air Max Shoes',
      price: 15999,
      originalPrice: 18999,
      discount: 15,
      rating: 4.8,
      reviews: 189,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc2hvZXN8ZW58MXx8fHwxNzYzNjQxOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      installment: 1333
    },
    {
      id: '3',
      name: 'Apple Watch Series 9',
      price: 124999,
      originalPrice: 139999,
      discount: 11,
      rating: 4.9,
      reviews: 456,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHdhdGNofGVufDF8fHx8MTc2MzY0MTk3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      installment: 10416
    },
    {
      id: '4',
      name: 'Designer Handbag',
      price: 8999,
      originalPrice: 12999,
      discount: 30,
      rating: 4.6,
      reviews: 234,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kYmFnJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjM2NDE5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      installment: 749
    },
    {
      id: '5',
      name: 'LED Smart TV 43"',
      price: 64999,
      originalPrice: 74999,
      discount: 13,
      rating: 4.7,
      reviews: 567,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHR2fGVufDF8fHx8MTc2MzY0MTk3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      installment: 5416
    },
    {
      id: '6',
      name: 'Yoga Mat Premium',
      price: 3499,
      originalPrice: 4999,
      discount: 30,
      rating: 4.4,
      reviews: 123,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWF0fGVufDF8fHx8MTc2MzY0MTk3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      installment: 291
    },
    {
      id: '7',
      name: 'Coffee Maker',
      price: 12999,
      originalPrice: 15999,
      discount: 18,
      rating: 4.5,
      reviews: 289,
      category: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtYWtlcnxlbnwxfHx8fDE3NjM2NDE5Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      installment: 1083
    },
    {
      id: '8',
      name: 'Skincare Set',
      price: 5999,
      originalPrice: 8999,
      discount: 33,
      rating: 4.8,
      reviews: 412,
      category: 'Beauty',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc2MzY0MTk4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      installment: 499
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigateTo('customer-dashboard')}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
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
        </div>
        <h2 className="text-white mb-2">Shop & Pay Later</h2>
        <p className="text-[#CDD7D6] text-sm mb-6">Buy now, pay in easy installments</p>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
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

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 mb-6 text-white"
        >
          <p className="text-white text-sm mb-1">🔥 Flash Sale</p>
          <p className="text-white text-[18px] mb-2">Up to 50% OFF</p>
          <p className="text-white/90 text-sm">Limited time offer. Shop now!</p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 pb-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigateTo('product-detail')}
              className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <div className="h-48 bg-gray-100">
                  <ImageWithFallback 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {product.discount}% OFF
                </div>
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-[#102542] text-sm mb-2 line-clamp-2 h-10">{product.name}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600 text-xs">{product.rating}</span>
                  <span className="text-gray-400 text-xs">({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-[#3D8A75]">PKR {product.price.toLocaleString()}</p>
                </div>
                <p className="text-gray-400 text-xs line-through mb-2">PKR {product.originalPrice.toLocaleString()}</p>
                <div className="bg-[#3D8A75]/10 rounded-lg p-2 text-center">
                  <p className="text-[#3D8A75] text-xs">
                    PKR {product.installment}/month
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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