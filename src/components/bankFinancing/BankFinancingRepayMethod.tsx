import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { ArrowLeft, Wallet, Building2 } from 'lucide-react';

export function BankFinancingRepayMethod() {
  const { navigateTo } = useContext(AppContext);
  const { user, refreshUser } = useAuth();
  const [selected, setSelected] = useState<'wallet' | 'pbb' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const appId = sessionStorage.getItem('repayAppId') || '';
  const idx = Number(sessionStorage.getItem('repayInstallmentIdx') || '0');
  const amount = Number(sessionStorage.getItem('repayAmount') || '0');

  const handleWalletPay = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.bankFinancing.repay(appId, { installmentIndex: idx, amount, paymentMethod: 'wallet' });
      sessionStorage.setItem('repayResult', JSON.stringify(res.data));
      await refreshUser();
      navigateTo('bank-financing-repay-success');
    } catch (err: any) {
      setError(err?.error?.data?.message || err?.error?.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePBBPay = async () => {
    sessionStorage.setItem('pbbIntent', 'bank_financing_repay');
    sessionStorage.setItem('pbbApplicationId', appId);
    sessionStorage.setItem('pbbInstallmentIdx', String(idx));
    sessionStorage.setItem('pbbAmount', String(amount));
    navigateTo('pbb-bank-select');
  };

  const methods = [
    {
      id: 'wallet' as const,
      icon: Wallet,
      title: 'Pay from Wallet',
      description: `Wallet balance: PKR ${(user?.walletBalance || 0).toLocaleString()}`,
      available: (user?.walletBalance || 0) >= amount,
      note: (user?.walletBalance || 0) < amount ? 'Insufficient wallet balance' : null
    },
    {
      id: 'pbb' as const,
      icon: Building2,
      title: 'Pay by Bank',
      description: 'Direct debit via your linked bank account',
      available: true,
      note: null,
      ctaLabel: 'Continue to Bank Login'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-36">
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('bank-financing-repay')} className="text-[#102542]"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-[16px] font-semibold text-[#102542]">Choose Payment Method</h1>
        </div>
      </div>

      <div className="px-6 pt-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-5 text-white mb-5">
          <p className="text-white/70 text-sm">Payment Amount</p>
          <p className="text-[28px] font-bold">PKR {amount.toLocaleString()}</p>
        </motion.div>

        <div className="space-y-3 mb-5">
          {methods.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => m.available && setSelected(m.id)}
              className={`bg-white/50 border rounded-2xl p-5 cursor-pointer transition-all ${!m.available ? 'opacity-50 cursor-not-allowed' : selected === m.id ? 'ring-2 ring-[#3D8A75] border-transparent bg-white/70' : 'border-white/60 hover:bg-white/70'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#102542] to-[#3D8A75] flex items-center justify-center flex-shrink-0">
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[#102542] font-medium">{m.title}</p>
                  <p className="text-gray-500 text-sm">{m.description}</p>
                  {m.note && <p className="text-red-500 text-xs mt-0.5">{m.note}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4"><p className="text-red-600 text-sm">{error}</p></div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button
          onClick={selected === 'wallet' ? handleWalletPay : handlePBBPay}
          disabled={!selected || loading}
          className={`w-full h-12 rounded-xl text-white font-medium transition-all ${selected && !loading ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c]' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {loading ? 'Processing...' : selected === 'pbb' ? 'Continue to Bank Login' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
}
