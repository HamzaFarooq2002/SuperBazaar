import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { AppContext } from '../App';
import { useCart } from '../hooks/useCart';
import api from '../services/api';

export function BNPLPlanSelection() {
  const { navigateTo } = useContext(AppContext);
  const { totalPrice } = useCart();
  const [eligibility, setEligibility] = useState<any>(null);
  const [selectedTenure, setSelectedTenure] = useState<number | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.bnpl
      .getEligibility({ cartTotal: totalPrice })
      .then((res) => setEligibility(res.data))
      .catch(() => setEligibility(null))
      .finally(() => setLoading(false));
  }, [totalPrice]);

  const plans = useMemo(() => {
    const day7 = Number(eligibility?.rates?.day7 ?? 0);
    const day14 = Number(eligibility?.rates?.day14 ?? 0);
    return [7, 14].map((days) => {
      const rate = days === 7 ? day7 : day14;
      const markupAmount = Math.round(totalPrice * rate);
      return {
        days,
        rate,
        markupAmount,
        totalPayable: totalPrice + markupAmount,
        dueDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      };
    });
  }, [eligibility, totalPrice]);

  const canContinue = selectedTenure !== null && consent;

  return (
    <div className="min-h-[100dvh] h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4]">
      {/* Header */}
      <div className="shrink-0 bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('payment-method')}
            className="text-[#102542] flex items-center gap-1"
            aria-label="Back to payment method"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542] text-lg font-medium">Choose Pay Later Plan</p>
        </div>
        <p className="text-xs text-gray-500 mt-2 ml-9">Scroll plans if needed; consent stays below</p>
      </div>

      {/* Scrollable: tier + plan cards only */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-5 pb-4">
        {eligibility?.tier && (
          <div className="inline-flex items-center gap-2 bg-[#102542]/10 rounded-full px-4 py-1.5 mb-5">
            <span className="text-xs font-medium text-[#102542]">Your tier:</span>
            <span className="text-xs font-bold text-[#3D8A75]">{eligibility.tier}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan, i) => {
              const selected = selectedTenure === plan.days;
              return (
                <motion.button
                  key={plan.days}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedTenure(plan.days)}
                  className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                    selected
                      ? 'border-[#3D8A75] bg-white shadow-md'
                      : 'border-gray-200 bg-white/60 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[#102542] font-semibold text-base">Pay in {plan.days} days</p>
                    {selected && <CheckCircle className="w-5 h-5 text-[#3D8A75] flex-shrink-0" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Markup rate</span>
                      <span className="text-[#102542] font-medium">{(plan.rate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Markup amount</span>
                      <span className="text-[#102542] font-medium">PKR {plan.markupAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total payable</span>
                      <span className="text-[#102542] font-semibold">PKR {plan.totalPayable.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Due date</span>
                      <span className="text-[#102542]">
                        {plan.dueDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 bg-red-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-red-600">
                      Late fee: 5% of outstanding principal after 3 days overdue (non-compounding)
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pinned footer: consent (when loaded) + actions */}
      <div className="shrink-0 border-t border-gray-200 bg-white/95 backdrop-blur-md px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] space-y-3 shadow-[0_-4px_24px_rgba(16,37,66,0.08)]">
        {!loading && (
          <>
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex items-start gap-3 bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl p-4 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#3D8A75] flex-shrink-0"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I consent to eligibility assessment for SuperBazaar Pay Later and acknowledge that final approval is
                subject to policy thresholds.
              </span>
            </motion.label>

            {!canContinue && (
              <p className="text-xs text-gray-400 text-center -mt-1">
                {!selectedTenure ? 'Select a plan above to continue' : 'Check the consent box to continue'}
              </p>
            )}
          </>
        )}

        {loading && <p className="text-xs text-gray-500 text-center">Loading your plans…</p>}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('payment-method')}
            className="flex-1 h-12 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!canContinue || loading}
            onClick={() => {
              sessionStorage.setItem('bnplSelection', JSON.stringify({ tenureDays: selectedTenure }));
              navigateTo('bnpl-fact-sheet');
            }}
            className={`flex-1 h-12 rounded-xl font-medium transition-all ${
              canContinue && !loading
                ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white hover:shadow-lg hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
