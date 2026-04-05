import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import api from '../services/api';
import { ArrowLeft, Search, ShoppingBag, Star, Heart, Inbox, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CustomerMarketplace() {
  const { navigateTo, setSelectedProduct } = useContext(AppContext);
  const { totalItems, addItem, items, updateQuantity, removeItem } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedProductId, setAddedProductId] = useState('');

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty'];
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.products.getProducts();
        if (response.success) {
          const prodList = response.data?.products || response.data || [];
          setProducts(prodList.map((p: any) => {
            const price = Number(p.price) || 0;
            const compareAt = Number(p.compareAtPrice) || 0;
            return {
              id: p._id || '',
              name: String(p.name || 'Unnamed Product'),
              price,
              originalPrice: compareAt || Math.round(price * 1.15),
              discount: compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 10,
              rating: Number(p.rating) || 4.5,
              reviews: Number(p.reviewCount) || 0,
              category: String(p.category || 'General'),
              image: p.mainImage || p.image || '',
              installment: price ? Math.round(price / 12) : 0,
              raw: p
            };
          }));
        }
      } catch (err: any) {
        console.error('Failed to load products:', err);
        setError(err?.error?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const cat = String(p.category || '').toLowerCase();
    const name = String(p.name || '').toLowerCase();
    const matchesCategory = activeCategory === 'All' || cat.includes(activeCategory.toLowerCase());
    const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: any, e: any) => {
    e.stopPropagation();
    const raw = product.raw || {};

    addItem({
      productId: raw._id || product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      supplier: raw.supplier?._id || raw.supplier || raw.merchant || '',
      supplierName: raw.supplierName || raw.supplier?.name || 'Unknown Supplier',
      image: product.image
    });
    setAddedProductId(raw._id || product.id);
    setTimeout(() => setAddedProductId(''), 1400);
  };

  const getProductQty = (productId: string) => items.find((i) => i.productId === productId)?.quantity || 0;

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Products Grid */}
        {error ? (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-red-500 mb-2">{error}</p>
            <button onClick={() => { setError(''); setLoading(true); }} className="text-[#3D8A75] text-sm underline">Try again</button>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">No products found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (setSelectedProduct) setSelectedProduct(product.raw);
                  navigateTo('product-detail');
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <div className="h-48 bg-gray-100">
                    {product.image ? (
                      <ImageWithFallback 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {product.discount}% OFF
                    </div>
                  )}
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
                    <p className="text-[#3D8A75]">PKR {(product.price ?? 0).toLocaleString()}</p>
                  </div>
                  {product.originalPrice > product.price && (
                    <p className="text-gray-400 text-xs line-through mb-2">PKR {(product.originalPrice ?? 0).toLocaleString()}</p>
                  )}
                  {product.installment > 0 && (
                    <div className="bg-[#3D8A75]/10 rounded-lg p-2 text-center">
                      <p className="text-[#3D8A75] text-xs">
                        PKR {product.installment}/month
                      </p>
                    </div>
                  )}
                  {getProductQty(product.id) > 0 ? (
                    <div className="mt-3">
                      <div className="w-full h-9 rounded-xl bg-[#3D8A75]/10 border border-[#3D8A75]/30 text-[#102542] text-xs font-medium flex items-center justify-between px-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const qty = getProductQty(product.id);
                            if (qty <= 1) {
                              removeItem(product.id);
                            } else {
                              updateQuantity(product.id, qty - 1);
                            }
                          }}
                          className="w-6 h-6 rounded-md bg-white flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span>{getProductQty(product.id)} in cart</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, getProductQty(product.id) + 1);
                          }}
                          className="w-6 h-6 rounded-md bg-white flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(product.id);
                        }}
                        className="mt-2 w-full h-8 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`mt-3 w-full h-9 rounded-xl text-white text-xs font-medium transition-all cursor-pointer ${
                        addedProductId === product.id
                          ? 'bg-[#2d6b5c]'
                          : 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] hover:shadow-lg'
                      }`}
                    >
                      {addedProductId === product.id ? 'Added' : 'Add to Cart'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {addedProductId && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#102542] text-white px-4 py-2 rounded-full text-xs shadow-lg flex items-center gap-2 z-20">
          <CheckCircle2 className="w-4 h-4 text-green-300" />
          Added to cart
          <button onClick={() => navigateTo('shopping-cart')} className="underline text-green-200">
            View cart
          </button>
        </div>
      )}

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
