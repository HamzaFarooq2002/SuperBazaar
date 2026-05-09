import React, { useContext, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../App';
import api from '../../services/api';
import { ArrowLeft, Phone, CreditCard, Search, X } from 'lucide-react';

export function OpenBankingAutoFetch() {
  const { navigateTo } = useContext(AppContext);
  const [inputType, setInputType] = useState<'phone' | 'iban'>('phone');
  const [phone, setPhone] = useState('');
  const [iban, setIban] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    timerRef.current = null;
    countdownRef.current = null;
    setCountdown(null);
  };

  const startFallbackTimer = (normalizedPhone: string) => {
    setCountdown(3);
    let count = 3;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearTimers();
        if (normalizedPhone) sessionStorage.setItem('autofetchFallbackPhone', normalizedPhone);
        navigateTo('onboard-cnic');
      }
    }, 1000);
  };

  const handleGoManual = () => {
    clearTimers();
    if (phone) sessionStorage.setItem('autofetchFallbackPhone', phone);
    navigateTo('onboard-cnic');
  };

  const handleLookup = async () => {
    clearTimers();
    setError('');
    setLoading(true);
    try {
      const payload = inputType === 'phone' ? { phone } : { iban };
      const res = await api.openBanking.lookup(payload);
      sessionStorage.setItem('pendingAutofetch', JSON.stringify(res.data));
      navigateTo('onboard-openbanking-review');
    } catch (err: any) {
      const code = err?.error?.data?.code || '';
      if (code === 'NO_MATCH' || err?.error?.status === 404) {
        setError("We couldn't find your bank records. Please complete manual signup below.");
        startFallbackTimer(inputType === 'phone' ? phone : '');
      } else {
        setError(err?.error?.data?.message || err?.error?.message || 'Lookup failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const strippedPhone = phone.replace(/\D/g, '');
  const isValid = inputType === 'phone'
    ? strippedPhone.length >= 10 && strippedPhone.length <= 12
    : iban.replace(/\s/g, '').length >= 24;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-white/40 px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('onboard-cnic')} className="text-[#102542]">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[18px] font-semibold text-[#102542]">Auto-fill from Bank</h1>
        </div>
      </div>

      <div className="px-6 pt-8 pb-32">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-5 text-white mb-6">
            <Search className="w-8 h-8 text-white/80 mb-3" />
            <h2 className="text-[20px] font-bold mb-1">Connect Your Bank</h2>
            <p className="text-white/80 text-sm leading-relaxed">Enter your registered phone number or IBAN to auto-fill your verification details.</p>
          </div>

          {/* Input type toggle */}
          <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-1 flex mb-5">
            <button
              onClick={() => setInputType('phone')}
              className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all ${inputType === 'phone' ? 'bg-white text-[#102542] shadow-sm' : 'text-[#102542]/60'}`}
            >
              Phone Number
            </button>
            <button
              onClick={() => setInputType('iban')}
              className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all ${inputType === 'iban' ? 'bg-white text-[#102542] shadow-sm' : 'text-[#102542]/60'}`}
            >
              IBAN
            </button>
          </div>

          {inputType === 'phone' ? (
            <div>
              <label className="block text-[13px] text-[#102542] opacity-60 mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3D8A75]" />
                <input
                  type="tel"
                  placeholder="+92 300 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-[50px] pl-12 pr-4 rounded-[10px] border border-[#e0e0e0] bg-white text-[15px] text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[13px] text-[#102542] opacity-60 mb-2">IBAN (24 characters)</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3D8A75]" />
                <input
                  type="text"
                  placeholder="PK36 HABB 0000 0011 2345 6701"
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  className="w-full h-[50px] pl-12 pr-4 rounded-[10px] border border-[#e0e0e0] bg-white text-[15px] text-[#102542] focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                />
              </div>
            </div>
          )}

          {/* Error + countdown */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm mb-2">{error}</p>
              {countdown !== null && (
                <p className="text-amber-600 text-xs font-medium">Switching to manual signup in {countdown}s...</p>
              )}
              <button onClick={handleGoManual} className="mt-2 text-[#3D8A75] text-sm font-medium underline">
                Switch to manual signup now
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-[#e1f4e3] rounded-[10px] p-4 mb-6">
          <p className="text-[12px] text-[#102542] leading-relaxed">
            <span className="font-semibold">🔒 Secure Lookup:</span> We only use your details to pre-fill your verification form. No data is stored without your consent.
          </p>
        </motion.div>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button
          onClick={handleLookup}
          disabled={!isValid || loading}
          className={`w-full h-12 rounded-xl text-white font-medium text-[15px] transition-all ${isValid && !loading ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {loading ? 'Searching...' : 'Find My Bank Records'}
        </button>
        <button onClick={handleGoManual} className="w-full mt-3 h-10 rounded-xl border border-gray-200 bg-white text-[13px] text-[#102542]/70 hover:text-[#102542] hover:bg-gray-50 transition-colors">
          Skip — Enter manually instead
        </button>
      </div>
    </div>
  );
}
