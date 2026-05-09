import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { BankVerifiedBadge } from '../common/BankVerifiedBadge';
import { ArrowLeft, CheckCircle, User, Building2, Phone, CreditCard, Hash } from 'lucide-react';

export function OpenBankingReview() {
  const { navigateTo } = useContext(AppContext);
  const { refreshUser } = useAuth();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consentShare, setConsentShare] = useState(false);
  const [consentTransactions, setConsentTransactions] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('pendingAutofetch');
    if (raw) {
      try { setMatch(JSON.parse(raw)); } catch { navigateTo('onboard-cnic'); }
    } else {
      navigateTo('onboard-cnic');
    }
  }, []);

  const handleConfirm = async () => {
    if (!match) return;
    setLoading(true);
    setError('');
    try {
      await api.openBanking.confirm({ matchId: match.matchId, consentShareBankData: consentShare, consentShareTransactions: consentTransactions });
      await refreshUser();
      sessionStorage.removeItem('pendingAutofetch');
      navigateTo('onboard-complete');
    } catch (err: any) {
      const field = err?.error?.data?.field;
      const msg = err?.error?.data?.message || err?.error?.message || 'Confirmation failed. Please try manual signup.';
      setError(msg);
      if (field === 'cnic' || field === 'phone') {
        setTimeout(() => { sessionStorage.removeItem('pendingAutofetch'); navigateTo('onboard-cnic'); }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!match) return null;

  const fields = [
    { icon: User, label: 'Full Name', value: match.name },
    ...(match.businessName ? [{ icon: Building2, label: 'Business Name', value: match.businessName }] : []),
    { icon: Phone, label: 'Mobile Number', value: match.phoneMasked },
    { icon: CreditCard, label: 'IBAN', value: match.ibanMasked },
    { icon: Hash, label: 'CNIC', value: match.cnicMasked },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden">
      <div className="bg-white/30 backdrop-blur-sm border-b border-white/40 px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('onboard-openbanking-autofetch')} className="text-[#102542]"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-[18px] font-semibold text-[#102542]">Review Your Details</h1>
        </div>
      </div>

      <div className="px-6 pt-6 pb-36">
        {/* Bank verified badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-6">
          <BankVerifiedBadge bankName={match.bankName} className="mb-3" />
          <p className="text-[13px] text-[#102542]/70 text-center">Your details were fetched from {match.bankName}. Please review before confirming.</p>
        </motion.div>

        {/* Fields */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-5 mb-4 space-y-4">
          {fields.map((f, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#3D8A75]/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-[#3D8A75]" />
              </div>
              <div>
                <p className="text-[11px] text-[#102542]/50 mb-0.5">{f.label}</p>
                <p className="text-[14px] text-[#102542] font-medium">{f.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Credit score chip */}
        {match.creditScore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-gradient-to-r from-[#102542] to-[#3D8A75] rounded-xl p-4 mb-4 text-white flex items-center justify-between">
            <span className="text-sm text-white/80">Credit Score (bank-verified)</span>
            <span className="text-[22px] font-bold">{match.creditScore}</span>
          </motion.div>
        )}

        {/* Consent checkboxes */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white/50 border border-white/60 rounded-xl p-4 mb-4 space-y-3">
          <p className="text-[12px] font-medium text-[#102542] mb-2">Data Sharing Consent</p>
          {[
            { label: 'Share bank account data for verification', state: consentShare, set: setConsentShare },
            { label: 'Share transaction history for credit scoring', state: consentTransactions, set: setConsentTransactions }
          ].map((c, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={c.state} onChange={(e) => c.set(e.target.checked)} className="mt-0.5 accent-[#3D8A75] w-4 h-4" />
              <span className="text-[12px] text-[#102542]/70 leading-relaxed">{c.label}</span>
            </label>
          ))}
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={() => { sessionStorage.removeItem('pendingAutofetch'); navigateTo('onboard-cnic'); }}
              className="w-full h-9 rounded-lg border border-red-300 text-red-700 text-sm font-medium bg-white hover:bg-red-50 transition-colors"
            >
              Enter details manually instead
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`w-full h-12 rounded-xl text-white font-medium text-[15px] transition-all ${!loading ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] hover:shadow-lg' : 'bg-gray-300'}`}
        >
          {loading ? 'Confirming...' : 'Confirm & Continue'}
        </button>
        <button onClick={() => { sessionStorage.removeItem('pendingAutofetch'); navigateTo('onboard-cnic'); }} className="w-full mt-3 h-10 rounded-xl border border-gray-200 bg-white text-[13px] text-[#102542]/70 hover:text-[#102542] hover:bg-gray-50 transition-colors">
          Not my details — Enter manually
        </button>
      </div>
    </div>
  );
}
