import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import api from '../services/api';
import { ArrowLeft, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function OpenBankingConsent() {
  const { navigateTo } = useContext(AppContext);
  const [shareBankData, setShareBankData] = useState(true);
  const [shareTransactions, setShareTransactions] = useState(true);
  const [shareCreditScore, setShareCreditScore] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canContinue = shareBankData || shareTransactions || shareCreditScore;

  const handleAuthorize = async () => {
    if (!canContinue) {
      setError('Select at least one data sharing option to continue.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await api.users.setOpenBanking({
        enabled: true,
        shareBankData,
        shareTransactions,
        shareCreditScore
      });
      sessionStorage.setItem(
        'openBankingConsents',
        JSON.stringify({ shareBankData, shareTransactions, shareCreditScore })
      );
      navigateTo('open-banking-processing');
    } catch (err: any) {
      setError(err?.error?.message || 'Unable to enable open banking right now.');
    } finally {
      setSaving(false);
    }
  };

  const options = [
    {
      key: 'bank',
      label: 'Bank balances and account profile',
      description: 'Helps verify business health for larger limits.',
      value: shareBankData,
      setter: setShareBankData
    },
    {
      key: 'transactions',
      label: 'Transaction history for cashflow analysis',
      description: 'Improves confidence in repayment consistency.',
      value: shareTransactions,
      setter: setShareTransactions
    },
    {
      key: 'credit',
      label: 'Credit score sharing with financing partners',
      description: 'Can improve approval speed and pricing decisions.',
      value: shareCreditScore,
      setter: setShareCreditScore
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4faf7] pb-24">
      <div className="bg-white px-6 pt-12 pb-4 border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button onClick={() => navigateTo('open-banking-journey')} className="flex items-center gap-2 text-[#102542]">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-[18px] font-bold text-[#121417]">Open Banking Consent</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 pt-6 space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#3D8A75] mt-0.5" />
            <div>
              <h2 className="text-[16px] font-bold text-[#121417]">Choose what to share</h2>
              <p className="text-[13px] text-[#61758a] mt-1">You stay in control and can change these permissions later.</p>
            </div>
          </div>

          {options.map((item) => (
            <div
              key={item.key}
              className={`py-3 px-3 rounded-xl border mb-2 ${item.value ? 'border-[#3D8A75]/40 bg-[#3D8A75]/5' : 'border-gray-100 bg-white'}`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={() => item.setter(!item.value)}
                  className="mt-1 h-4 w-4 accent-[#3D8A75]"
                />
                <div>
                  <p className="text-[14px] text-[#121417]">{item.label}</p>
                  <p className="text-[12px] text-[#61758a] mt-1">{item.description}</p>
                </div>
              </label>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#3D8A75] mt-0.5" />
            <h3 className="text-[15px] font-bold text-[#121417]">What you get by enabling Open Banking</h3>
          </div>
          <p className="text-[13px] text-[#61758a] leading-6 mb-3">
            Faster loan decisions, financing limits based on actual cashflow, and stronger score confidence.
          </p>
          <p className="text-[13px] text-[#3D8A75] font-medium">
            Opting in can improve your credit score profile by adding trusted financial signals.
          </p>
        </motion.div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-600 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            {error}
          </div>
        )}

        <button
          onClick={handleAuthorize}
          disabled={saving}
          className={`w-full h-[50px] rounded-[14px] text-white text-[15px] font-semibold transition-all ${
            saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-[#102542] to-[#3D8A75] hover:opacity-95'
          }`}
        >
          {saving ? 'Authorizing...' : 'Authorize Open Banking'}
        </button>
      </div>
    </div>
  );
}
