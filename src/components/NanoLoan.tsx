import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext, Screen } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, Wallet, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { NanoConsentModal } from './credit/NanoConsentModal';

export function NanoLoan() {
  const { navigateTo } = useContext(AppContext);
  const { user, refreshUser } = useAuth();
  const [loanAmount, setLoanAmount] = useState(50000);

  const homeDashboard: Screen =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approved, setApproved] = useState(false);
  const [disbursedAmount, setDisbursedAmount] = useState(0);
  const [creditScore, setCreditScore] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [tier, setTier] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [tenureOptions, setTenureOptions] = useState<any[]>([]);
  const [consentOpen, setConsentOpen] = useState(false);

  const minLoan = 10000;
  const maxLoan = tier?.maxAmount || 25000;
  const minTxns = 3;

  React.useEffect(() => {
    const loadEligibility = async () => {
      setLoadingData(true);
      setError('');
      try {
        await refreshUser();
        const [scoreRes, txRes, tierRes] = await Promise.all([
          api.credit.getCreditScore(),
          api.users.getTransactions(),
          api.credit.getNanoTiers()
        ]);

        const score = scoreRes?.data?.creditScore?.score || 0;
        const txns = txRes?.data?.transactions || [];
        setCreditScore(score);
        setTxCount(txns.filter((t: any) => t.status === 'completed').length);

        const apiTiers = tierRes?.data?.tiers || [];
        setTiers(apiTiers);
        setTenureOptions(tierRes?.data?.tenureOptions || []);
        const eligibleTier = [...apiTiers].reverse().find((t: any) => score >= t.minScore) || null;
        setTier(eligibleTier);
        const allowedMax = eligibleTier?.maxAmount || 25000;
        setLoanAmount((prev) => Math.min(Math.max(prev, minLoan), allowedMax));
      } catch (err: any) {
        setError(err?.error?.message || 'Unable to load nano loan eligibility');
      } finally {
        setLoadingData(false);
      }
    };
    loadEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loanDetails = tier
    ? {
        tenure: tenureOptions?.[0]?.months || 2,
        interest: (tier.serviceChargeRate || 0) * 100,
        monthlyPayment: Math.round((loanAmount * (1 + (tier.serviceChargeRate || 0))) / (tenureOptions?.[0]?.months || 2))
      }
    : null;

  const benefits = [
    { icon: TrendingUp, title: 'Tiered Limits', desc: 'Higher score unlocks larger working-capital limits' },
    { icon: Wallet, title: '0% Compounding Rates', desc: 'No hidden charges' },
    { icon: Clock, title: 'Business Tenure', desc: 'Short-term installments for inventory cycles' },
    { icon: CheckCircle, title: 'Transparent Terms', desc: 'Rate, tier, and repayment are shown before approval' }
  ];

  const handleApply = async () => {
    if (user?.userType !== 'merchant') {
      setError('Nano loans are exclusively available to merchants.');
      return;
    }
    if (user?.kycStatus !== 'verified') {
      setError('Verified KYC is required for nano loans.');
      return;
    }
    if (txCount < minTxns) {
      setError(`Build transaction history first. Minimum ${minTxns} completed transactions required.`);
      return;
    }
    if (!tier) {
      setError('Your current credit score does not meet nano-loan tier requirements.');
      return;
    }
    if (loanAmount < minLoan || loanAmount > maxLoan) {
      setError(`Please select an amount between PKR ${minLoan.toLocaleString()} and PKR ${maxLoan.toLocaleString()}`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.credit.applyNanoLoan({
        requestedAmount: loanAmount,
        tenureMonths: tenureOptions?.[0]?.months || 2,
        consent_acknowledged: true,
        consent_payload: {
          requestedAmount: loanAmount,
          serviceChargeRate: tier?.serviceChargeRate || 0,
          serviceChargeAmount: loanAmount * (tier?.serviceChargeRate || 0)
        }
      });
      if (response.success) {
        setDisbursedAmount(response.data?.disbursedAmount || loanAmount);
        setApproved(true);
      } else {
        setError(response.error?.message || 'Loan application failed');
      }
    } catch (err: any) {
      setError(err?.error?.message || err?.message || 'Failed to apply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (approved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 text-center max-w-sm w-full"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-[#102542] text-[22px] mb-2">Loan Approved!</h2>
          <p className="text-gray-600 mb-6">Funds have been disbursed to your SuperBazaar wallet.</p>
          <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-5 text-white mb-6">
            <p className="text-white/80 text-sm mb-1">Disbursed Amount</p>
            <p className="text-white text-[32px]">PKR {disbursedAmount.toLocaleString()}</p>
            <p className="text-white/60 text-xs mt-2">Added to your wallet balance</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigateTo(homeDashboard)}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white font-medium hover:shadow-lg transition-all"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigateTo('payments-main')}
              className="w-full h-12 rounded-xl bg-white border border-gray-200 text-[#102542] font-medium hover:bg-gray-50 transition-all"
            >
              Track Loan
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (user?.userType !== 'merchant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
        <div className="bg-white/80 border border-white/60 rounded-2xl p-6 max-w-sm text-center">
          <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <p className="text-[#102542] mb-2">Nano loans are merchant-only</p>
          <p className="text-gray-500 text-sm mb-4">Customers should use BNPL during checkout when eligible.</p>
          <button onClick={() => navigateTo(homeDashboard)} className="w-full h-11 rounded-xl bg-[#3D8A75] text-white">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigateTo(homeDashboard)}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-6" />
        </div>
        <h2 className="text-white mb-2">Merchant Nano Loan</h2>
        <p className="text-white/80 text-sm">Working-capital tiers based on credit score and repayment behavior</p>
      </div>

      <div className="px-6 mt-6">
        {loadingData && (
          <div className="text-center py-4 text-gray-500 text-sm">Checking eligibility...</div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loan Amount Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-6 mb-6"
        >
          <p className="text-[#102542] mb-2">Select Loan Amount</p>
          <p className="text-gray-600 text-xs mb-4">
            Score: {creditScore || '--'} | KYC: {user?.kycStatus || '--'} | Completed transactions: {txCount}
          </p>
          <div className="text-center mb-6">
            <p className="text-[#3D8A75] text-[40px] mb-2">PKR {loanAmount.toLocaleString()}</p>
            {loanDetails && <p className="text-gray-500 text-sm">Monthly Payment: PKR {loanDetails.monthlyPayment.toLocaleString()}</p>}
          </div>
          {maxLoan > minLoan ? (
            <input
              type="range"
              min={minLoan}
              max={maxLoan}
              step={1000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D8A75]"
            />
          ) : (
            <div className="w-full rounded-lg bg-[#102542]/5 border border-[#102542]/10 p-3 text-center text-xs text-[#102542]">
              Fixed amount for current tier: PKR {maxLoan.toLocaleString()}
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>PKR {minLoan.toLocaleString()}</span>
            <span>PKR {maxLoan.toLocaleString()}</span>
          </div>
          {!tier && (
            <p className="text-amber-600 text-xs mt-3">
              Verified KYC alone is not enough. Build transaction history to unlock Tier 1 nano loans.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-6"
        >
          <p className="text-[#102542] mb-3">Nano Loan Tiers</p>
          <div className="space-y-2 text-xs text-gray-700">
            {tiers.map((t) => (
              <div key={t.key} className={`rounded-lg p-2 ${tier?.key === t.key ? 'bg-[#e1f4e3]' : 'bg-white/60'}`}>
                <p className="text-[#102542]">
                  {t.tier}: score {t.minScore}+ | up to PKR {t.maxAmount.toLocaleString()} | {(t.serviceChargeRate * 100).toFixed(2)}% service charge
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-600 mt-3">
            Last 3 tiers are elite tiers: score requirements increase sharply and unlock premium nano-loan limits.
          </p>
        </motion.div>

        {/* Loan Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-6"
        >
          <p className="text-[#102542] mb-4">Loan Details</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Loan Amount</span>
              <span className="text-[#102542]">PKR {loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Repayment Tenure</span>
              <span className="text-[#102542]">{loanDetails?.tenure || '--'} months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Interest Rate</span>
              <span className="text-green-600">{loanDetails?.interest || '--'}%</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-[#102542]">Monthly Payment</span>
              <span className="text-[#3D8A75] text-[18px]">PKR {(loanDetails?.monthlyPayment || 0).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-6"
        >
          <p className="text-[#102542] mb-4">Why Choose Nano Loan?</p>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-[#e1f4e3] flex items-center justify-center mb-2">
                  <benefit.icon className="w-6 h-6 text-[#3D8A75]" />
                </div>
                <p className="text-[#102542] text-sm mb-1">{benefit.title}</p>
                <p className="text-gray-500 text-xs">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Eligibility */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-4 mb-6 ${tier ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}
        >
          <div className="flex items-start gap-3">
            {tier ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />}
            <div>
              <p className={`${tier ? 'text-green-800' : 'text-amber-800'} mb-1`}>
                {tier ? `Eligible for ${tier.label}` : 'Not eligible yet'}
              </p>
              <p className={`${tier ? 'text-green-700' : 'text-amber-700'} text-sm`}>
                {tier
                  ? `You can borrow up to PKR ${tier.maxAmount.toLocaleString()} on your current tier.`
                  : 'Build more completed transactions to unlock Tier 1 nano loan access.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 mb-4"
        >
          <p className="text-gray-600 text-xs leading-relaxed">
            By applying for this loan, you agree to our Terms & Conditions. The loan will be disbursed to your Super Bazaar wallet instantly upon approval. Monthly installments will be auto-debited from your linked account.
          </p>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/60 px-6 py-4">
        <button
          onClick={handleApply}
          disabled={loading}
          className={`w-full h-12 rounded-xl text-white font-medium hover:shadow-lg transition-all ${
            loading || !tier || txCount < minTxns || user?.kycStatus !== 'verified'
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#102542] to-[#3D8A75]'
          }`}
        >
          {loading ? 'Processing...' : 'Apply for Nano Loan'}
        </button>
      </div>
      <NanoConsentModal open={consentOpen} onClose={() => setConsentOpen(false)} onAccept={() => setConsentOpen(false)} payload={{ serviceChargeRate: tier?.serviceChargeRate }} />
    </div>
  );
}
