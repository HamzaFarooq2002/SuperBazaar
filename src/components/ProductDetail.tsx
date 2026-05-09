import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Truck, Shield, CreditCard, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductDetail() {
  const { navigateTo, selectedProduct } = useContext(AppContext);
  const { addItem, totalItems } = useCart();
  const { user } = useAuth();
  const homeMarketplace = user?.userType === 'customer' ? 'customer-marketplace' : 'marketplace';
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Use real product from context, or fallback to sample data
  const product = selectedProduct || {
    _id: '1',
    name: 'Product Not Found',
    price: 0,
    rating: { average: 0, count: 0 },
    supplierName: 'Unknown',
    unit: 'per unit',
    description: 'Please select a product from the marketplace.',
    stockQuantity: 0,
    mainImage: 'https://images.unsplash.com/photo-1646980990815-1e97d5ee932f',
    features: []
  };

  const rawRating = product.rating as unknown;
  const ratingNumber =
    rawRating != null && typeof rawRating === 'object' && 'average' in (rawRating as object)
      ? Number((rawRating as { average?: unknown }).average) || 0
      : typeof rawRating === 'number'
        ? rawRating
        : 0;

  const rawReviews = product.reviews as unknown;
  const reviewsCount =
    typeof product.rating?.count === 'number'
      ? product.rating.count
      : typeof rawReviews === 'number'
        ? rawReviews
        : Array.isArray(rawReviews)
          ? rawReviews.length
          : 0;

  const safeFeatures = Array.isArray(product.features) ? product.features : [];

  // Map product fields to match display names (never pass-through Mongo rating/reviews shapes into JSX)
  const displayProduct = {
    _id: product._id || product.id,
    name: product.name,
    price: Number(product.price ?? 0),
    rating: ratingNumber,
    reviews: reviewsCount,
    seller: product.supplierName || product.seller || 'Unknown Supplier',
    unit: product.unit || 'per unit',
    description: product.description,
    inStock: (product.stockQuantity ?? 0) > 0,
    stockCount: Math.max(0, Number(product.stockQuantity ?? 0)),
    image: product.mainImage || product.image,
    features: safeFeatures.map((f: unknown) => (typeof f === 'string' ? f : f != null && typeof f === 'object' && 'label' in (f as object) ? String((f as { label?: unknown }).label) : String(f)))
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= displayProduct.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: displayProduct._id,
      productName: displayProduct.name,
      price: displayProduct.price,
      quantity: quantity,
      supplier: product.supplier?._id || product.supplier || displayProduct._id,
      supplierName: displayProduct.seller,
      image: displayProduct.image
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigateTo('shopping-cart');
    }, 1500);
  };

  const totalPrice = displayProduct.price * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-24">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigateTo(homeMarketplace)}
            className="text-[#102542] flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542]">Product Details</p>
          <button 
            onClick={() => navigateTo('shopping-cart')}
            className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-[#102542] hover:bg-white/70 transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
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
            src={displayProduct.image} 
            alt={displayProduct.name}
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
              <h2 className="text-[#102542] text-[18px] mb-1">{displayProduct.name}</h2>
              <p className="text-[#3D8A75] text-sm">{displayProduct.seller}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs ${
              displayProduct.inStock 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {displayProduct.inStock ? `${displayProduct.stockCount} in stock` : 'Out of Stock'}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-[#102542]">{displayProduct.rating}</span>
            </div>
            <span className="text-gray-500 text-sm">({displayProduct.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-[#3D8A75] text-[24px]">PKR {displayProduct.price.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">{displayProduct.unit}</p>
          </div>

          {/* Description */}
          <p className="text-[#102542] text-sm leading-relaxed mb-4 opacity-80">
            {displayProduct.description}
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {displayProduct.features.length > 0 && displayProduct.features.map((feature, index) => (
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
              <p className="text-gray-500 text-xs">{quantity > 1 ? 'units' : 'unit'}</p>
            </div>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= displayProduct.stockCount}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#102542] hover:bg-white transition-colors disabled:opacity-40"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
          >
            <Check className="w-5 h-5" />
            <span>Added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-500 text-xs">Total Amount</p>
            <p className="text-[#102542] text-[20px]">PKR {totalPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!displayProduct.inStock}
            className="flex-1 bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] h-12 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
