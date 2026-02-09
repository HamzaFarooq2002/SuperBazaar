import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Package, Truck, Shield, CreditCard } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductDetail() {
  const { navigateTo } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);

  // Sample product data
  const product = {
    id: '1',
    name: 'Rice - 50kg Bag',
    price: 8500,
    rating: 4.8,
    reviews: 124,
    seller: 'Metro Wholesale',
    unit: 'per bag',
    description: 'Premium quality Basmati rice, perfect for retail shops. Long grain, aromatic, and carefully selected for the best quality.',
    inStock: true,
    stockCount: 45,
    image: 'https://images.unsplash.com/photo-1646980990815-1e97d5ee932f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYmFnJTIwZ3JhaW5zfGVufDF8fHx8MTc2MzY0MTk3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Premium Basmati Quality',
      'Long Grain Rice',
      'Sealed 50kg Bags',
      'Direct from Mills'
    ]
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-24">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigateTo('marketplace')}
            className="text-[#102542] flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542]">Product Details</p>
          <button 
            onClick={() => navigateTo('shopping-cart')}
            className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-[#102542] hover:bg-white/70 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-6 mt-6 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-md border border-white/60 shadow-lg"
      >
        <div className="h-64 bg-gray-100">
          <ImageWithFallback 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <div className="px-6 mt-6">
        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-[#102542] text-[18px] mb-1">{product.name}</h2>
              <p className="text-[#3D8A75] text-sm">{product.seller}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs ${
              product.inStock 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {product.inStock ? `${product.stockCount} in stock` : 'Out of Stock'}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-[#102542]">{product.rating}</span>
            </div>
            <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-[#3D8A75] text-[24px]">PKR {product.price.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">{product.unit}</p>
          </div>

          {/* Description */}
          <p className="text-[#102542] text-sm leading-relaxed mb-4 opacity-80">
            {product.description}
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3D8A75]" />
                <span className="text-[#102542] text-xs opacity-80">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-4"
        >
          <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-xl p-3 text-center">
            <Truck className="w-5 h-5 text-[#3D8A75] mx-auto mb-2" />
            <p className="text-[#102542] text-[10px]">Fast Delivery</p>
          </div>
          <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-xl p-3 text-center">
            <Shield className="w-5 h-5 text-[#3D8A75] mx-auto mb-2" />
            <p className="text-[#102542] text-[10px]">Secure Payment</p>
          </div>
          <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-xl p-3 text-center">
            <CreditCard className="w-5 h-5 text-[#3D8A75] mx-auto mb-2" />
            <p className="text-[#102542] text-[10px]">Pay Later</p>
          </div>
        </motion.div>

        {/* Quantity Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4"
        >
          <p className="text-[#102542] mb-3">Select Quantity</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#102542] hover:bg-white transition-colors disabled:opacity-40"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <p className="text-[#102542] text-[24px]">{quantity}</p>
              <p className="text-gray-500 text-xs">{quantity > 1 ? 'bags' : 'bag'}</p>
            </div>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stockCount}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#102542] hover:bg-white transition-colors disabled:opacity-40"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-500 text-xs">Total Amount</p>
            <p className="text-[#102542] text-[20px]">PKR {totalPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={() => navigateTo('shopping-cart')}
            className="flex-1 bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] h-12 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
