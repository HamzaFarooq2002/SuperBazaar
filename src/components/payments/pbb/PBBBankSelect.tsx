import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../../App';
import { useAuth } from '../../../hooks/useAuth';
import { usePaymentSession } from '../../../contexts/PaymentSessionContext';
import api from '../../../services/api';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const BANKS = [
  { code: 'HBL', name: 'HBL', fullName: 'Habib Bank Limited', logo: '/bank-logos/hbl.png', color: '#006747' },
  { code: 'NBP', name: 'NBP', fullName: 'National Bank of Pakistan', logo: null, color: '#003087' },
  { code: 'UBL', name: 'UBL', fullName: 'United Bank Limited', logo: '/bank-logos/ubl.png', color: '#c8102e' },
  { code: 'FAYSAL', name: 'Faysal', fullName: 'Faysal Bank', logo: null, color: '#005670' },
  { code: 'JS', name: 'JS Bank', fullName: 'JS Bank', logo: '/bank-logos/jsbank.png', color: '#e31837' },
  { code: 'ALLIED', name: 'Allied', fullName: 'Allied Bank', logo: '/bank-logos/abl.png', color: '#1a3c6e' },
  { code: 'ALFALAH', name: 'Alfalah', fullName: 'Bank Alfalah', logo: '/bank-logos/alfalah.png', color: '#009b4e' },
  { code: 'MCB', name: 'MCB', fullName: 'MCB Bank', logo: '/bank-logos/mcb.png', color: '#cc0000' },
];

export function PBBBankSelect() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const { session, setSession } = usePaymentSession();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const autoBankCode = (user as any)?.openBanking?.bankCode;
    if (autoBankCode && BANKS.find((b) => b.code === autoBankCode)) {
      setSelected(autoBankCode);
    }
  }, [user]);

  // Hydrate context from sessionStorage (fixes intent/orderDraft mismatch when React state lags navigation)
  useEffect(() => {
    const storedIntent = sessionStorage.getItem('pbbIntent');
    const amt = Number(sessionStorage.getItem('pbbAmount') || '0');
    if (storedIntent === 'bank_financing_repay') {
      setSession((prev) =>
        prev.intent === 'bank_financing_repay'
          ? prev
          : { ...prev, intent: 'bank_financing_repay', amount: amt || prev.amount }
      );
      return;
    }
    const draftRaw = sessionStorage.getItem('pbbOrderDraft');
    if (!draftRaw) return;
    try {
      const orderDraft = JSON.parse(draftRaw);
      setSession((prev) => ({
        ...prev,
        intent: 'order',
        orderDraft,
        amount: amt || prev.amount || Number(orderDraft.totalAmount) || 0,
      }));
    } catch {
      /* ignore */
    }
  }, [setSession]);

  const resolvedIntent =
    session.intent === 'bank_financing_repay' ||
    sessionStorage.getItem('pbbIntent') === 'bank_financing_repay'
      ? 'bank_financing_repay'
      : 'order';

  const backScreen = resolvedIntent === 'bank_financing_repay' ? 'bank-financing-repay-method' : 'payment-method';

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const bankObj = BANKS.find((b) => b.code === selected)!;
      const payload: any = { intent: resolvedIntent, bankCode: selected };
      if (resolvedIntent === 'order') {
        let orderDraft = session.orderDraft;
        if (!orderDraft) {
          try {
            const raw = sessionStorage.getItem('pbbOrderDraft');
            if (raw) orderDraft = JSON.parse(raw);
          } catch {
            orderDraft = null;
          }
        }
        if (!orderDraft) {
          setError('Your checkout session expired. Please go back and choose Pay by Bank again.');
          setLoading(false);
          return;
        }
        payload.orderDraft = orderDraft;
      } else {
        payload.applicationId = sessionStorage.getItem('pbbApplicationId');
        payload.installmentIndex = Number(sessionStorage.getItem('pbbInstallmentIdx') || '0');
        payload.amount = Number(sessionStorage.getItem('pbbAmount') || '0');
      }
      const res = await api.pbb.initiate(payload);
      setSession((prev) => ({ ...prev, sessionId: res.data.sessionId, pbbId: res.data.pbbId, selectedBank: selected, selectedBankName: bankObj.fullName, status: 'initiated', amount: res.data.amount }));
      navigateTo('pbb-login');
    } catch (err: any) {
      setError(err?.error?.message || 'Failed to connect to bank. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-32">
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo(backScreen as any)} className="text-[#102542]"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-[16px] font-semibold text-[#102542]">Select Your Bank</h1>
        </div>
      </div>

      <div className="px-6 pt-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-4 text-white mb-5">
          <p className="text-white/70 text-sm">Pay via Bank</p>
          <p className="text-[24px] font-bold">PKR {(session.amount || Number(sessionStorage.getItem('pbbAmount') || 0)).toLocaleString()}</p>
        </motion.div>

        {(user as any)?.openBanking?.autoFetched && (
          <div className="bg-[#e1f4e3] border border-[#3D8A75]/30 rounded-xl p-3 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#3D8A75] flex-shrink-0" />
            <p className="text-[12px] text-[#3D8A75]">Your {(user as any).openBanking.bankName} account is pre-selected based on your Open Banking setup.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          {BANKS.map((bank, i) => (
            <motion.div key={bank.code} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(bank.code)}
              className={`bg-white/50 border rounded-xl p-4 cursor-pointer transition-all text-center ${selected === bank.code ? 'ring-2 ring-[#3D8A75] border-transparent bg-white/80' : 'border-white/60 hover:bg-white/70'}`}
            >
              {bank.logo ? (
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="h-8 mx-auto mb-2 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                    if (next) next.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-10 h-8 rounded mx-auto mb-2 items-center justify-center"
                style={{ backgroundColor: bank.color, display: bank.logo ? 'none' : 'flex' }}
              >
                <span className="text-white text-[9px] font-bold leading-none">{bank.code.slice(0, 3)}</span>
              </div>
              <p className="text-[#102542] text-[12px] font-medium">{bank.name}</p>
              {selected === bank.code && <CheckCircle className="w-4 h-4 text-[#3D8A75] mx-auto mt-1" />}
            </motion.div>
          ))}
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3"><p className="text-red-600 text-sm">{error}</p></div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button onClick={handleContinue} disabled={!selected || loading}
          className={`w-full h-12 rounded-xl text-white font-medium transition-all ${selected && !loading ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c]' : 'bg-gray-300 cursor-not-allowed'}`}>
          {loading ? 'Connecting...' : `Continue with ${BANKS.find(b => b.code === selected)?.name || 'Bank'}`}
        </button>
      </div>
    </div>
  );
}
