import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import {
  ArrowLeft,
  Plus,
  Package,
  Edit2,
  Trash2,
  AlertTriangle,
  Search,
  X,
  Save,
  ChevronDown,
  ImagePlus,
  Eye,
  Store,
  UploadCloud,
  Loader2,
} from 'lucide-react';

const CATEGORIES = ['Groceries', 'Beverages', 'Snacks', 'Personal Care', 'Household', 'Other'] as const;

interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  minOrderQuantity: number;
  mainImage: string;
  isActive: boolean;
  sku?: string;
}

const emptyForm = {
  name: '',
  description: '',
  category: 'Groceries' as string,
  price: '',
  unit: 'per unit',
  stockQuantity: '',
  minOrderQuantity: '1',
  sku: '',
  mainImage: '',
};

export function SupplierProducts() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ name: string; sizeKb: number } | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const homeDashboard = 'supplier-dashboard' as const;

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.products.getProducts({ supplier: user?._id || (user as any)?.id, limit: 100 });
      if (res.success) {
        const list = res.data?.products ?? res.data ?? [];
        setProducts(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview(null);
    setImageInfo(null);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (p: Product) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description || '',
      category: p.category,
      price: String(p.price),
      unit: p.unit || 'per unit',
      stockQuantity: String(p.stockQuantity),
      minOrderQuantity: String(p.minOrderQuantity),
      sku: p.sku || '',
      mainImage: p.mainImage || '',
    });
    setImagePreview(p.mainImage || null);
    setImageInfo(null);
    setError('');
    setShowForm(true);
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const compressImage = async (file: File): Promise<string> => {
    const source = await fileToDataUrl(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = source;
    });

    const maxDimension = 1280;
    let { width, height } = img;
    if (width > height && width > maxDimension) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else if (height >= width && height > maxDimension) {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return source;
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', 0.82);
  };

  const applyImageFile = async (file: File) => {
    if (!file) return;
    setError('');
    setProcessingImage(true);
    try {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      if (file.size > 6 * 1024 * 1024) {
        setError('Image must be under 6 MB before compression.');
        return;
      }

      const base64 = await compressImage(file);
      setImagePreview(base64);
      setForm((prev) => ({ ...prev, mainImage: base64 }));
      setImageInfo({ name: file.name, sizeKb: Math.round(file.size / 1024) });
    } catch (err) {
      console.error('Image processing failed', err);
      setError('Could not process image. Try another file.');
    } finally {
      setProcessingImage(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await applyImageFile(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageInfo(null);
    setForm((prev) => ({ ...prev, mainImage: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stockQuantity) {
      setError('Name, price, and stock are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload: Record<string, any> = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        unit: form.unit,
        stockQuantity: Number(form.stockQuantity),
        minOrderQuantity: Number(form.minOrderQuantity) || 1,
        sku: form.sku || undefined,
      };

      if (form.mainImage) {
        payload.mainImage = form.mainImage;
      }

      if (editingId) {
        await api.products.updateProduct(editingId, payload);
      } else {
        await api.products.createProduct(payload);
      }

      setShowForm(false);
      setImagePreview(null);
      await loadProducts();
    } catch (err: any) {
      setError(err?.error?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this product listing?')) return;
    try {
      await api.products.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-6 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigateTo(homeDashboard)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold flex-1">My Products</h1>
          <button
            onClick={() => navigateTo('marketplace')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            title="View Marketplace"
          >
            <Eye className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={openAddForm}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-white/20 border border-white/30 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* View Marketplace banner */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigateTo('marketplace')}
          className="w-full mb-4 py-3 rounded-xl bg-[#102542]/5 border border-[#102542]/10 text-[#102542] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#102542]/10 transition-colors"
        >
          <Store className="w-4 h-4" />
          View Marketplace
          <span className="text-xs text-gray-400 ml-1">— see your products live</span>
        </motion.button>

        {/* Quick add CTA */}
        {!showForm && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={openAddForm}
            className="w-full mb-4 py-3 rounded-xl border-2 border-dashed border-[#3D8A75]/30 text-[#3D8A75] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#3D8A75]/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </motion.button>
        )}

        {/* Product Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#102542] font-semibold text-base">
                  {editingId ? 'Edit Product' : 'New Product'}
                </h3>
                <button onClick={() => { setShowForm(false); setImagePreview(null); setImageInfo(null); }}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {error && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#102542] mb-1.5">Product Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-3 py-1 rounded-lg bg-white/90 text-xs font-medium text-[#102542] hover:bg-white transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) await applyImageFile(file);
                      }}
                      className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
                        dragActive
                          ? 'border-[#3D8A75] bg-[#3D8A75]/5 text-[#3D8A75]'
                          : 'border-gray-200 text-gray-400 hover:border-[#3D8A75]/40 hover:text-[#3D8A75]'
                      }`}
                    >
                      {processingImage ? (
                        <>
                          <Loader2 className="w-7 h-7 animate-spin" />
                          <span className="text-xs font-medium">Optimizing image...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8" />
                          <span className="text-xs font-medium">Tap or drag image here</span>
                          <span className="text-[10px] text-gray-300">PNG, JPG, WebP — up to 6 MB (auto-compressed)</span>
                        </>
                      )}
                    </button>
                  )}
                  {imageInfo && (
                    <p className="text-[11px] text-gray-500 mt-2">
                      Selected: {imageInfo.name} ({imageInfo.sizeKb} KB)
                    </p>
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-[#102542] mb-1.5">Product Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Basmati Rice 5kg"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]/40"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#102542] mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief product description…"
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]/40 resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[#102542] mb-1.5">Category *</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#102542] appearance-none focus:outline-none focus:ring-2 focus:ring-[#3D8A75]/40 bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#102542] mb-1.5">Price (PKR) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#102542] mb-1.5">Unit</label>
                    <input
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      placeholder="per kg, per unit…"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]/40"
                    />
                  </div>
                </div>

                {/* Stock & Min Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#102542] mb-1.5">Stock Qty *</label>
                    <input
                      type="number"
                      value={form.stockQuantity}
                      onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#102542] mb-1.5">Min Order Qty</label>
                    <input
                      type="number"
                      value={form.minOrderQuantity}
                      onChange={(e) => setForm({ ...form, minOrderQuantity: e.target.value })}
                      placeholder="1"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]/40"
                    />
                  </div>
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-[#102542] mb-1.5">SKU <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g. RICE-BAS-5K"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]/40"
                  />
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-[#3D8A75] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#346f61] transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving…' : editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {products.length === 0 ? 'No products yet. Add your first listing!' : 'No matching products.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-[#102542] truncate">{product.name}</h4>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#3D8A75] whitespace-nowrap">
                        PKR {product.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          product.stockQuantity <= 5
                            ? 'bg-red-50 text-red-600'
                            : product.stockQuantity <= 20
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-green-50 text-green-600'
                        }`}
                      >
                        Stock: {product.stockQuantity}
                      </span>
                      {product.sku && (
                        <span className="text-xs text-gray-400">SKU: {product.sku}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEditForm(product)}
                    className="flex-1 py-2 rounded-lg bg-[#102542]/5 text-[#102542] text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-[#102542]/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
