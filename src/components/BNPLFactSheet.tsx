import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import { useOrder } from '../hooks/useOrder';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const DISCLOSURES = [
  { label: 'Lender', value: 'SuperBazaar NBFC' },
  { label: 'Facility', value: 'Digital Buy-Now-Pay-Later for retail purchases' },
  { label: 'Markup', value: 'Per selected plan and tier rate card' },
  { label: 'Late fee', value: '5% of outstanding principal after 3+ days overdue (non-compounding)' },
  { label: 'Blocked state', value: 'Account access restricted after 7+ overdue days' },
  { label: 'Recovery', value: 'Applicable at 30+ overdue days; may affect credit profile' },
  { label: 'Prepayment', value: 'Partial and full prepayment permitted at any time' },
  { label: 'Data use', value: 'Credit assessment data shared with licensed bureau partners' },
];

export function BNPLFactSheet() {
  const { navigateTo } = useContext(AppContext);
  const { items, clearCart } = useCart();
  const { shippingFormData, setCurrentOrder, setShippingFormData } = useOrder();
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selection = JSON.parse(sessionStorage.getItem('bnplSelection') || '{}');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.bnpl.initiate({
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        shippingAddress: {
          recipientName: shippingFormData?.name || user?.name || '',
          phone: user?.phone || '',
          street: shippingFormData?.address || '',
          city: shippingFormData?.city || 'Karachi',
          state: shippingFormData?.area || '',
          postalCode: '75500',
          country: 'Pakistan',
        },
        selectedTenureDays: selection.tenureDays,
        consentEligibility: true,
        termsAccepted: true,
      });
      if (response.success) {
        setCurrentOrder(response.data.order);
        sessionStorage.removeItem('bnplSelection');
        setShippingFormData(null);
        clearCart();
        navigateTo('order-confirmation');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4]">
      {/* Header */}
      <div className="shrink-0 bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 z-10">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#3D8A75]" />
          <p className="text-[#102542] text-lg font-medium">Borrower Fact Sheet</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-8">Scroll the table to read all disclosures; accept below to continue</p>
      </div>

      {/* Scrollable: disclosures only */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-5 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
          {DISCLOSURES.map((item, i) => (
            <div
              key={i}
              className={`px-4 py-2.5 flex gap-3 ${i < DISCLOSURES.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-xs font-semibold text-[#3D8A75] w-24 flex-shrink-0 pt-0.5">{item.label}</span>
              <span className="text-sm text-gray-700 leading-relaxed">{item.value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pinned footer: consent + errors + actions */}
      <div className="shrink-0 border-t border-gray-200 bg-white/95 backdrop-blur-md px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] space-y-3 shadow-[0_-4px_24px_rgba(16,37,66,0.08)]">
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 bg-white/70 backdrop-blur-sm border-2 border-[#3D8A75]/30 rounded-xl p-4 cursor-pointer hover:border-[#3D8A75]/60 transition-colors"
        >
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#3D8A75] flex-shrink-0"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            I have read and fully understood the Borrower Fact Sheet. I accept all BNPL terms, disclosures, and
            conditions outlined above.
          </span>
        </motion.label>

        {!accepted && (
          <p className="text-xs text-gray-400 text-center -mt-1">You must accept the terms to place your order</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('payment-method')}
            className="flex-1 h-12 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!accepted || loading}
            onClick={handleConfirm}
            className={`flex-1 h-12 rounded-xl font-medium transition-all ${
              accepted && !loading
                ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white hover:shadow-lg hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              'Confirm & Place Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
