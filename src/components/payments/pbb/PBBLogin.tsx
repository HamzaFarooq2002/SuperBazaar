import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../../App';
import { usePaymentSession } from '../../../contexts/PaymentSessionContext';
import api from '../../../services/api';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';

export function PBBLogin() {
  const { navigateTo } = useContext(AppContext);
  const { session, setSession } = usePaymentSession();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    (api.users as any).getHealthConfig?.().then((res: any) => {
      setDemoMode(res?.data?.pbbDemoMode === true || res?.pbbDemoMode === true);
    }).catch(() => {});
  }, []);

  const handleAuth = async () => {
    if (pin.length !== 5 || !session.sessionId) return;
    setLoading(true);
    setError('');
    try {
      await api.pbb.auth(session.sessionId, { pin });
      setSession((prev) => ({ ...prev, status: 'authed' }));
      navigateTo('pbb-confirm');
    } catch (err: any) {
      const code = err?.error?.data?.code || '';
      const remaining = err?.error?.data?.data?.attemptsRemaining;
      if (remaining !== undefined) setAttemptsLeft(remaining);
      if (code === 'ACCOUNT_LOCKED') {
        setSession((prev) => ({ ...prev, status: 'failed', failureReason: 'Account locked' }));
        navigateTo('pbb-failure');
        return;
      }
      setError(err?.error?.data?.message || err?.error?.message || 'Incorrect PIN.');
    } finally {
      setLoading(false);
    }
  };

  if (!session.sessionId) { navigateTo('pbb-bank-select'); return null; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4]">
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('pbb-bank-select')} className="text-[#102542]"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-[16px] font-semibold text-[#102542]">{session.selectedBankName || 'Bank'} Login</h1>
        </div>
      </div>

      <div className="px-6 pt-10 pb-32">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#102542] to-[#3D8A75] flex items-center justify-center mb-4">
            <Lock className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-[20px] font-bold text-[#102542] mb-1">Enter Your PIN</h2>
          <p className="text-[#102542]/60 text-sm">Enter your {session.selectedBankName} internet banking PIN to authorize this payment.</p>
          {demoMode && <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2"><p className="text-blue-700 text-xs">Demo mode: use PIN <strong>12345</strong></p></div>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="block text-[13px] text-[#102542]/60 mb-2 ml-1">5-Digit PIN</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3D8A75]" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              autoComplete="one-time-code"
              placeholder="• • • • •"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 5))}
              style={{ WebkitTextSecurity: showPin ? 'none' : 'disc' } as React.CSSProperties}
              className="w-full h-[56px] pl-12 pr-12 rounded-[12px] border border-[#e0e0e0] bg-white text-[20px] text-[#102542] text-center tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
            />
            <button onClick={() => setShowPin(!showPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}{attemptsLeft < 3 && ` (${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining)`}</p>}
        </motion.div>

        <div className="mt-8">
          <p className="text-[11px] text-[#102542]/50 text-center">Your PIN is encrypted and never stored by SuperBazaar.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button onClick={handleAuth} disabled={pin.length !== 5 || loading}
          className={`w-full h-12 rounded-xl text-white font-medium transition-all ${pin.length === 5 && !loading ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c]' : 'bg-gray-300 cursor-not-allowed'}`}>
          {loading ? 'Verifying...' : 'Verify PIN'}
        </button>
      </div>
    </div>
  );
}
