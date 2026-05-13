import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Calendar, TrendingUp, FileText, Wallet } from 'lucide-react';
import { AppContext } from '../../App';
import { useOrder } from '../../hooks/useOrder';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { BankBrandTile, getBankBrand } from './bankBrands';
import { FacilitatorChip } from './FacilitatorChip';
import { generateRepaymentSchedulePreview } from '../../utils/bankFinancingSchedule';
import { FLAT_MARKUP_DISCLOSURE_TEXT } from '../../config/bankFinancingDisplay';

const buildSchedulePreview = (application: any, selectedTenure: number) => {
  if (!application || !selectedTenure) return { markupAmount: 0, totalRepayable: 0, schedule: [] as any[] };
  return generateRepaymentSchedulePreview({
    approvedAmount: Number(application.approvedAmount || 0),
    annualMarkupRatePercent: Number(application.annualMarkupRate || 0),
    tenureDays: Number(selectedTenure),
    processingFee: Number(application.processingFee || 0)
  });
};

const formatDateShort = (date: Date) =>
  date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

export function BankFinancingOffer() {
  const { navigateTo } = useContext(AppContext);
  const { shippingFormData, setCurrentOrder, setShippingFormData } = useOrder();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [selectedTenure, setSelectedTenure] = useState<number>(0);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (accepted) return;
    const run = async () => {
      const draft = JSON.parse(sessionStorage.getItem('bankFinancingDraft') || '{}');
      if (!draft?.selectedBank) {
        navigateTo('bank-financing-select');
        return;
      }
      try {
        const res = await api.bankFinancing.apply({
          selectedBank: draft.selectedBank,
          requestedAmount: draft.requestedAmount,
          productIds: draft.productIds || [],
          consentGiven: true
        });
        const app = res.data.application;
        setApplication(app);
        setSelectedTenure(app?.tenureOptionsDays?.[0] || 0);
      } catch (err: any) {
        const failureData = err?.error?.data?.data;
        if (failureData?.tier === 'Poor' || failureData?.reasonCodes?.includes?.('score_below_threshold')) {
          sessionStorage.setItem('bankFinancingRejected', JSON.stringify(failureData));
          navigateTo('bank-financing-rejected');
          return;
        }
        setError(err?.error?.data?.message || err?.error?.message || 'Could not load the bank offer. Please go back and try again.');
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick countdown every minute
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const offerPreview = useMemo(() => buildSchedulePreview(application, selectedTenure), [application, selectedTenure]);

  const expiry = useMemo(() => {
    if (!application?.offerExpiry) return null;
    const expiryMs = new Date(application.offerExpiry).getTime();
    const diffMs = expiryMs - now;
    if (diffMs <= 0) return { expired: true, label: 'Offer expired' };
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const urgent = diffMs < 6 * 60 * 60 * 1000;
    return {
      expired: false,
      urgent,
      label: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    };
  }, [application?.offerExpiry, now]);

  const handleAccept = async () => {
    if (!application?._id || !checked || !selectedTenure) return;
    const draft = JSON.parse(sessionStorage.getItem('bankFinancingDraft') || '{}');
    setLoading(true);
    setError('');
    try {
      const res = await api.bankFinancing.accept(application._id, {
        selectedTenureDays: selectedTenure,
        offerAccepted: true,
        items: draft.items || [],
        shippingAddress: {
          recipientName: shippingFormData?.name || '',
          phone: shippingFormData?.phone || user?.phone || '',
          street: shippingFormData?.address || '',
          city: shippingFormData?.city || 'Karachi',
          state: shippingFormData?.area || '',
          postalCode: '75500',
          country: 'Pakistan'
        }
      });
      setAccepted(true);
      setCurrentOrder(res.data.order);
      sessionStorage.removeItem('bankFinancingDraft');
      setShippingFormData(null);
      clearCart();
      navigateTo('order-confirmation');
    } catch (err: any) {
      setError(err?.error?.data?.message || err?.error?.message || 'Could not accept the bank offer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!application?._id || loading) return;
    setLoading(true);
    setError('');
    try {
      await api.bankFinancing.decline(application._id);
      sessionStorage.removeItem('bankFinancingDraft');
      navigateTo('payment-method');
    } catch (err: any) {
      setError(err?.error?.data?.message || err?.error?.message || 'Could not decline the bank offer.');
    } finally {
      setLoading(false);
    }
  };

  if (!application && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
        <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-6 text-center max-w-sm">
          <AlertTriangle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
          <p className="text-[#102542] font-semibold mb-2">Bank offer unavailable</p>
          <p className="text-sm text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigateTo('bank-financing-select')}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white font-medium hover:shadow-lg"
          >
            Back to bank selection
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const brand = getBankBrand(application.selectedBank);
  const installmentCount = offerPreview.schedule.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex flex-col">
      {/* Sticky header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigateTo('bank-financing-consent')}
            className="text-[#102542] flex items-center gap-1"
            aria-label="Back to consent"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542] text-lg font-medium">Bank financing offer</p>
        </div>
        <FacilitatorChip bank={application.selectedBank} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-32">
        {/* Hero approved amount card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-4 text-white shadow-lg relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, #102542 0%, ${brand.color} 100%)` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <BankBrandTile bank={application.selectedBank} size={44} />
              <div>
                <p className="text-white/70 text-[11px]">Lender</p>
                <p className="text-white font-semibold">{application.selectedBank}</p>
              </div>
            </div>
            {expiry && (
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium ${
                  expiry.expired
                    ? 'bg-red-500/30 text-white border border-red-300/40'
                    : expiry.urgent
                    ? 'bg-yellow-400/25 text-white border border-yellow-300/40'
                    : 'bg-white/15 text-white border border-white/30'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {expiry.expired ? 'Expired' : `${expiry.label} left`}
              </div>
            )}
          </div>
          <p className="text-white/70 text-xs mb-1">Approved amount</p>
          <p className="text-[32px] font-bold tracking-[-0.48px] leading-none">PKR {Number(application.approvedAmount || 0).toLocaleString()}</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1">
            <span className="text-[11px] text-white/80">Tier:</span>
            <span className="text-[11px] font-bold text-white">{application.merchantRiskTier}</span>
          </div>
        </motion.div>

        {/* Tenure selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#3D8A75]" />
            <p className="text-[#102542] font-semibold text-sm">Choose tenure</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(application.tenureOptionsDays || []).map((days: number) => {
              const preview = buildSchedulePreview(application, days);
              const selected = selectedTenure === days;
              return (
                <button
                  key={days}
                  onClick={() => setSelectedTenure(days)}
                  className={`text-left rounded-xl border-2 p-3 transition-all ${
                    selected ? 'border-[#3D8A75] bg-white shadow-md' : 'border-gray-200 bg-white/60 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-[#102542] font-semibold">{days} days</p>
                    {selected && <CheckCircle className="w-4 h-4 text-[#3D8A75] mt-0.5" />}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Total repayable</p>
                  <p className="text-[#102542] text-sm font-semibold">PKR {preview.totalRepayable.toLocaleString()}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Flat markup disclosure */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-[#102542]/5 border border-[#102542]/15 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-[#3D8A75] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#102542] leading-relaxed">{FLAT_MARKUP_DISCLOSURE_TEXT}</p>
          </div>
        </motion.div>

        {/* Pricing breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#3D8A75]" />
            <p className="text-[#102542] font-semibold text-sm">How {application.selectedBank} priced this offer</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">3M KIBOR</span>
              <span className="text-[#102542]">{Number(application.kibor3mPercent || 0).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bank spread</span>
              <span className="text-[#102542]">+ {Number(application.spreadPercent || 0).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between border-t border-gray-200/60 pt-2">
              <span className="text-gray-500 font-medium">Annual markup rate</span>
              <span className="text-[#102542] font-semibold">{Number(application.annualMarkupRate || 0).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Processing fee</span>
              <span className="text-[#102542]">PKR {Number(application.processingFee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between bg-[#3D8A75]/10 rounded-lg px-3 py-2 mt-2">
              <span className="text-[#102542] font-semibold">Cost for {selectedTenure} days</span>
              <span className="text-[#102542] font-bold">
                PKR {(offerPreview.markupAmount + Number(application.processingFee || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Repayment timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#3D8A75]" />
              <p className="text-[#102542] font-semibold text-sm">Your repayment plan</p>
            </div>
            <span className="text-[11px] text-gray-500">{installmentCount} installment{installmentCount > 1 ? 's' : ''}</span>
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            {installmentCount > 1 && (
              <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#3D8A75] via-[#3D8A75]/40 to-gray-200" />
            )}
            <div className="space-y-4">
              {offerPreview.schedule.map((row: any, index: number) => {
                const isNext = index === 0;
                return (
                  <div key={index} className="relative flex gap-4">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          isNext
                            ? 'bg-gradient-to-br from-[#3D8A75] to-[#2d6b5c] text-white shadow-md'
                            : 'bg-white border-2 border-gray-300 text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div
                      className={`flex-1 rounded-xl p-3 ${
                        isNext ? 'bg-[#3D8A75]/10 border border-[#3D8A75]/30' : 'bg-gray-50 border border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="text-[#102542] font-semibold text-sm">PKR {row.totalDue.toLocaleString()}</p>
                          <p className="text-[11px] text-gray-500">Due {formatDateShort(new Date(row.dueDate))}</p>
                        </div>
                        {isNext && (
                          <span className="text-[10px] font-bold text-[#3D8A75] bg-white rounded-full px-2 py-0.5 border border-[#3D8A75]/30">
                            FIRST
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-600 mt-2">
                        <div>
                          <p className="text-gray-400">Principal</p>
                          <p className="font-medium text-gray-700">PKR {row.principalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Markup</p>
                          <p className="font-medium text-gray-700">PKR {row.markupAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Fee</p>
                          <p className="font-medium text-gray-700">PKR {row.processingFeeAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200/60 flex justify-between items-baseline">
            <span className="text-sm text-gray-500">Total repayable</span>
            <span className="text-[#102542] text-lg font-bold">PKR {offerPreview.totalRepayable.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Late payment policy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-yellow-200 bg-yellow-50/80 backdrop-blur-md p-3 mb-4"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-yellow-900 mb-0.5">Late payment policy</p>
              <p className="text-[11px] text-yellow-800 leading-relaxed">{application.latePaymentPolicy}</p>
            </div>
          </div>
        </motion.div>

        {/* Acceptance text + checkbox */}
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-start gap-3 bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-4 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#3D8A75]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-[#3D8A75]" />
              <span className="text-[#102542] font-semibold text-sm">I accept this bank-issued offer</span>
            </div>
            <span className="text-xs text-gray-600 leading-relaxed">
              I have read and understood that this is a bank-issued financing offer. SuperBazaar is not the lender.
              I accept {application.selectedBank}'s markup rate, tenure, processing fee, repayment schedule, and
              late payment policy.
            </span>
          </div>
        </motion.label>

        {!checked && !error && (
          <p className="text-xs text-gray-400 text-center mt-3">Tick the consent box to accept this offer</p>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-md p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-4 flex gap-3">
        <button
          onClick={handleDecline}
          disabled={loading}
          className="flex-1 h-12 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          disabled={!checked || loading || expiry?.expired}
          className={`flex-1 h-12 rounded-xl font-medium transition-all ${
            checked && !loading && !expiry?.expired
              ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white hover:shadow-lg hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing…' : 'Accept offer'}
        </button>
      </div>
    </div>
  );
}
