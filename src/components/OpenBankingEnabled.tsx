import React, { useContext, useMemo } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle2 } from 'lucide-react';

export function OpenBankingEnabled() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';

  const consents = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('openBankingConsents');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const consentItems = [
    { key: 'shareBankData', label: 'Bank balances and account profile' },
    { key: 'shareTransactions', label: 'Transaction history and cashflow data' },
    { key: 'shareCreditScore', label: 'Credit score sharing with partners' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 py-12 text-white">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-[24px] font-bold text-center mb-2">Open Banking Enabled</h1>
        <p className="text-center text-white/80 text-[14px] mb-6">
          Your account is now connected. Banking insights will improve your credit analysis and loan decisions.
        </p>

        <div className="bg-white/10 rounded-2xl p-4 mb-6">
          <h2 className="text-[14px] font-semibold mb-3">Approved Data Sharing</h2>
          <div className="space-y-2">
            {consentItems.map((item) => (
              <p key={item.key} className="text-[12px] text-white/90">
                {consents?.[item.key] ? '✓' : '•'} {item.label}
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigateTo('credit-score-generating')}
          className="w-full h-12 rounded-xl bg-white text-[#102542] font-semibold mb-3"
        >
          Recalculate Credit Score
        </button>
        <button
          onClick={() => navigateTo(homeDashboard)}
          className="w-full h-12 rounded-xl border border-white/30 text-white font-semibold"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
