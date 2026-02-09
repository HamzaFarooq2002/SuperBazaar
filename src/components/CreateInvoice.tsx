import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export function CreateInvoice() {
  const { navigateTo } = useContext(AppContext);
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = 0;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('success');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Create Invoice</h2>
      </div>

      <form onSubmit={handleSubmit} className="px-6 mt-6 space-y-6">
        {/* Client Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-[#102542] mb-4">Client Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Client Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                placeholder="ABC Corporation"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                placeholder="client@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Address</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                placeholder="123 Client St, City, State 12345"
                rows={3}
              />
            </div>
          </div>
        </motion.div>

        {/* Invoice Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-[#102542] mb-4">Invoice Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Invoice Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                defaultValue="2025-11-20"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Line Items */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#102542]">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="w-10 h-10 rounded-full bg-[#3D8A75] text-white flex items-center justify-center hover:bg-[#2d6a5c] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="space-y-3 pb-4 border-b border-gray-200 last:border-0">
                <div className="flex justify-between items-start">
                  <p className="text-gray-700">Item {index + 1}</p>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                  placeholder="Description"
                  required
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                    placeholder="Qty"
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                    placeholder="Rate"
                    min="0"
                    step="0.01"
                    required
                  />
                  <div className="px-4 py-3 rounded-xl bg-[#CDD7D6] flex items-center justify-center">
                    <span className="text-[#102542]">${(item.quantity * item.rate).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-2 border-[#102542]/20 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#102542]">Total</span>
              <h3 className="text-[#3D8A75]">${total.toFixed(2)}</h3>
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6 shadow-lg"
        >
          <label className="block text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
            placeholder="Additional notes or payment terms..."
            rows={4}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          type="submit"
          className="w-full py-4 rounded-xl bg-[#3D8A75] text-white transition-all hover:bg-[#2d6a5c] shadow-lg"
        >
          Create Invoice
        </motion.button>
      </form>
    </div>
  );
}
