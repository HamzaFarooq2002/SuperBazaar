import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AppContext } from '../../App';
import { useCart } from '../../hooks/useCart';
import api from '../../services/api';
import { DELIVERY_FEE } from '../../config/pricing';
import { BankBrandTile } from './bankBrands';
import { FacilitatorChip } from './FacilitatorChip';

const getReasonText = (reason: any) =>
  typeof reason === 'string' ? reason : reason?.message || reason?.code || 'Policy check failed';

export function BankFinancingSelection() {
  const { navigateTo } = useContext(AppContext);
  const { items, totalPrice } = useCart();
  const [eligibility, setEligibility] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(true);

  const requestedAmount = useMemo(() => totalPrice + DELIVERY_FEE, [totalPrice]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const productIds = items.map((item: any) => item.productId).filter(Boolean).join(',');
        const res = await api.bankFinancing.getEligibility({ requestedAmount, productIds });
        setEligibility(res.data);
      } catch {
        setEligibility({
          eligible: false,
          reasons: [{ code: 'eligibility_check_failed', message: 'We could not check bank financing eligibility. Please try again.' }],
          banks: []
        });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [requestedAmount, items]);

  const handleContinue = () => {
    if (!selectedBank || !eligibility?.eligible) return;
    sessionStorage.setItem(
      'bankFinancingDraft',
      JSON.stringify({
        selectedBank,
        requestedAmount,
        productIds: items.map((item: any) => item.productId).filter(Boolean),
        items,
        eligibility
      })
    );
    navigateTo('bank-financing-consent');
  };

  const banks: string[] = eligibility?.banks || [];
  const hasActive = !!eligibility?.activeApplication;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex flex-col">
      {/* Sticky glass header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigateTo('payment-method')}
            className="text-[#102542] flex items-center gap-1"
            aria-label="Back to payment method"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542] text-lg font-medium">Stock Now Pay Later</p>
        </div>
        <FacilitatorChip />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-32">
        {/* Hero amount card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-6 mb-5 text-white shadow-lg"
        >
          <p className="text-white/70 text-xs mb-1">Requested financing amount</p>
          <p className="text-[28px] font-bold tracking-[-0.36px]">PKR {requestedAmount.toLocaleString()}</p>
          <p className="text-white/70 text-xs mt-1">Includes PKR {DELIVERY_FEE.toLocaleString()} delivery fee</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Eligibility summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={`rounded-2xl border p-4 mb-4 backdrop-blur-md ${
                eligibility?.eligible
                  ? 'border-green-200 bg-green-50/80'
                  : 'border-red-200 bg-red-50/80'
              }`}
            >
              <div className="flex items-start gap-2">
                {eligibility?.eligible ? (
                  <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-[#102542] mb-1">
                    {eligibility?.eligible ? 'You can apply' : 'Not eligible to apply right now'}
                  </p>
                  {eligibility?.eligible ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 bg-[#102542]/10 rounded-full px-3 py-1">
                        <span className="text-[11px] text-[#102542]">Tier:</span>
                        <span className="text-[11px] font-bold text-[#3D8A75]">{eligibility.tier}</span>
                      </span>
                      <span className="text-[11px] text-green-800">Final terms are issued by your selected bank</span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs text-gray-700">
                      {(eligibility?.reasons || [{ message: 'Policy check failed' }]).map((reason: any, index: number) => (
                        <p key={`${getReasonText(reason)}-${index}`}>• {getReasonText(reason)}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Active application notice */}
            {hasActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="rounded-2xl border border-[#3D8A75]/30 bg-[#3D8A75]/10 backdrop-blur-md p-4 mb-4"
              >
                <div className="flex items-start gap-3">
                  <BankBrandTile bank={eligibility.activeApplication.selectedBank} size={40} />
                  <div className="flex-1">
                    <p className="text-[#102542] font-semibold text-sm mb-0.5">You already have an active application</p>
                    <p className="text-[12px] text-[#102542]/70 mb-2">
                      {eligibility.activeApplication.selectedBank} ·{' '}
                      {eligibility.activeApplication.applicationStatus}
                      {eligibility.activeApplication.approvedAmount
                        ? ` · PKR ${Number(eligibility.activeApplication.approvedAmount).toLocaleString()}`
                        : ''}
                    </p>
                    <button
                      onClick={() => navigateTo('bank-financing-dashboard')}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-[#3D8A75] text-white text-xs font-medium hover:bg-[#2d6b5c] transition-colors"
                    >
                      View active application
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Facility info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-blue-100 bg-blue-50/70 backdrop-blur-md p-3 mb-5"
            >
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  Facility range: PKR {Number(eligibility?.minOrderAmount || 500).toLocaleString()} to PKR{' '}
                  {Number(eligibility?.maxOrderAmount || 500000).toLocaleString()}. Bank pricing is based on 3M KIBOR
                  plus your tier and the bank's spread.
                </p>
              </div>
            </motion.div>

            {/* Bank list */}
            <p className="text-[#102542] font-medium mb-3">Choose your bank</p>
            <div className="space-y-3 mb-6">
              {banks.length === 0 && (
                <p className="text-sm text-gray-500">No partner banks available right now.</p>
              )}
              {banks.map((bank: string, index: number) => {
                const selected = selectedBank === bank;
                const disabled = !eligibility?.eligible;
                return (
                  <motion.button
                    key={bank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + index * 0.05 }}
                    onClick={() => !disabled && setSelectedBank(bank)}
                    disabled={disabled}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all flex items-center gap-3 ${
                      selected
                        ? 'border-[#3D8A75] bg-white shadow-md'
                        : disabled
                        ? 'border-gray-200 bg-white/40 opacity-60 cursor-not-allowed'
                        : 'border-gray-200 bg-white/60 hover:border-gray-300 hover:bg-white/80'
                    }`}
                  >
                    <BankBrandTile bank={bank} size={44} />
                    <div className="flex-1">
                      <p className="text-[#102542] font-semibold text-[15px]">{bank}</p>
                      <p className="text-[11px] text-gray-500">Lender · final terms issued by the bank</p>
                    </div>
                    {selected && <CheckCircle className="w-5 h-5 text-[#3D8A75] flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Unverified suppliers warning */}
            {eligibility?.unverifiedSupplierIds?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-yellow-200 bg-yellow-50/80 backdrop-blur-md p-3 mb-4"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs text-yellow-800">
                    <p className="mb-2 font-medium">Some cart items are from unverified suppliers</p>
                    <p className="mb-2">Remove these items to proceed with bank financing.</p>
                    <button onClick={() => navigateTo('shopping-cart')} className="text-[#3D8A75] underline font-medium">
                      Back to cart
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-4 flex gap-3">
        <button
          onClick={() => navigateTo('payment-method')}
          className="flex-1 h-12 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedBank || !eligibility?.eligible}
          className={`flex-1 h-12 rounded-xl font-medium transition-all ${
            selectedBank && eligibility?.eligible
              ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white hover:shadow-lg hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
