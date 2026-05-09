import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, TrendingUp, TrendingDown, Info, Share2, Download, RefreshCcw } from 'lucide-react';

const BNPL_MIN_SCORE = 620;

export function CreditScoreResult() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creditData, setCreditData] = useState<any>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [txCount, setTxCount] = useState(0);
  const [bnplEligibility, setBnplEligibility] = useState<any>(null);

  const loadCreditScore = async () => {
    setError('');
    try {
      const cached = sessionStorage.getItem('creditScoreData');
      if (cached) {
        setCreditData(JSON.parse(cached));
        sessionStorage.removeItem('creditScoreData');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await api.credit.getCreditScore();
      if (response.success && response.data) {
        setCreditData(response.data);
      } else {
        setError('No credit score found. Please generate one first.');
      }

      const txRes = await api.users.getTransactions();
      const txns = txRes?.data?.transactions || txRes?.data || [];
      setTxCount((Array.isArray(txns) ? txns : []).filter((t: any) => t.status === 'completed').length);
    } catch (err: any) {
      console.error('Failed to load credit score:', err);
      setError(err?.error?.message || 'Failed to load credit score');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCreditScore();
  }, []);

  useEffect(() => {
    if (user?.userType !== 'customer') return;
    api.bnpl.getEligibility().then((res) => setBnplEligibility(res.data)).catch(() => setBnplEligibility(null));
  }, [user?.userType]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      const response = await api.credit.generateCreditScore();
      if (response.success && response.data) {
        setCreditData(response.data);
      }
    } catch (err: any) {
      setError('Failed to refresh score. Is the scoring service running?');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500">Calculating your credit score...</p>
        </div>
      </div>
    );
  }

  if (error && !creditData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex items-center justify-center px-6">
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-8 text-center max-w-sm w-full">
          <Info className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-[#102542] text-lg mb-2">Unable to Load Credit Score</h3>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button onClick={() => { setLoading(true); loadCreditScore(); }} className="px-6 py-3 bg-[#3D8A75] text-white rounded-xl hover:bg-[#2d6b5c] transition-colors">
            Try Again
          </button>
          <button onClick={() => navigateTo(homeDashboard)} className="block mx-auto mt-3 text-[#3D8A75] text-sm">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const creditScore = creditData?.creditScore?.score || 500;
  const maxScore = 850;
  const scorePercentage = Math.round((creditScore / maxScore) * 100);
  const suggestedLimit = creditData?.suggestedCreditLimit || 0;
  const factors = creditData?.creditScore?.factors || {};

  const getScoreStatus = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: '#3D8A75', emoji: '🎉' };
    if (score >= 650) return { label: 'Good', color: '#38a829', emoji: '✅' };
    if (score >= 550) return { label: 'Fair', color: '#f59e0b', emoji: '⚠️' };
    return { label: 'Needs Improvement', color: '#ef4444', emoji: '📊' };
  };

  const status = getScoreStatus(creditScore);
  const isBnplEligible = bnplEligibility?.eligible ?? creditScore >= BNPL_MIN_SCORE;
  const isMerchant = user?.userType === 'merchant';
  const isCustomer = user?.userType === 'customer';

  const accountAgeMonths = user?.createdAt ? Math.max(0, Math.floor((Date.now() - new Date(user.createdAt as any).getTime()) / (1000 * 60 * 60 * 24 * 30))) : 0;
  const paymentHistoryTier =
    user?.kycStatus === 'verified' && txCount >= 10 ? 'Good' :
    user?.kycStatus === 'verified' && txCount >= 3 ? 'Average' : 'Needs work';
  const accountAgeTier = accountAgeMonths >= 24 ? 'Established' : accountAgeMonths >= 6 ? 'Growing' : 'New';
  const txVolumeTier = txCount >= 20 ? 'Good' : txCount >= 8 ? 'Average' : 'Low';
  const utilizationRatio = Math.max(0, Math.min(1, Number(factors.creditUtilization || 0)));
  const utilizationTier = utilizationRatio > 0 && utilizationRatio <= 0.6 ? 'Good' : utilizationRatio <= 0.85 ? 'Average' : 'High';
  const paymentHistoryProgress = user?.kycStatus === 'verified' ? Math.min(100, Math.round((txCount / 10) * 100)) : 0;
  const accountAgeProgress = Math.min(100, Math.round((accountAgeMonths / 24) * 100));
  const txVolumeProgress = Math.min(100, Math.round((txCount / 20) * 100));
  const utilizationProgress =
    utilizationRatio === 0
      ? 0
      : utilizationRatio <= 0.6
      ? Math.min(100, Math.round((utilizationRatio / 0.6) * 100))
      : Math.max(0, Math.round(100 - ((utilizationRatio - 0.6) / 0.4) * 100));

  const factorsList = [
    {
      title: 'Payment History',
      metric: `${txCount} completed transactions`,
      status: paymentHistoryTier,
      fill: paymentHistoryProgress,
      icon: TrendingUp,
      healthyTarget: 'Verified KYC + 10+ completed transactions',
      detail: user?.kycStatus === 'verified' ? 'Verified KYC and consistent repayments improve this.' : 'KYC verification is pending.'
    },
    {
      title: 'Account Age',
      metric: `${accountAgeMonths} month${accountAgeMonths === 1 ? '' : 's'} old`,
      status: accountAgeTier,
      fill: accountAgeProgress,
      icon: Info,
      healthyTarget: '24+ months account age',
      detail: 'Older and consistently active accounts are preferred.'
    },
    {
      title: 'Transaction Volume',
      metric: `${txCount} completed transaction${txCount === 1 ? '' : 's'}`,
      status: txVolumeTier,
      fill: txVolumeProgress,
      icon: txCount >= 8 ? TrendingUp : TrendingDown,
      healthyTarget: '20+ completed transactions',
      detail: 'More completed transactions strengthen credit confidence.'
    },
    {
      title: 'Credit Utilization',
      metric: `${Math.round(utilizationRatio * 100)}% utilized`,
      status: utilizationTier,
      fill: utilizationProgress,
      icon: TrendingUp,
      healthyTarget: 'Maintain 30% to 60% utilization',
      detail: 'Balanced utilization is preferred over very high usage.'
    }
  ];

  const needsKycVerification = user?.kycStatus !== 'verified';
  const recommendations = creditScore >= 700
    ? ['Maintain your excellent payment history', 'Consider increasing transaction volume', 'Your credit limit is well-positioned']
    : [
        ...(needsKycVerification ? ['Complete KYC verification to boost your score'] : []),
        'Increase your transaction volume with regular purchases',
        'Maintain consistent activity on the platform',
        'Build credit history over time'
      ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden pb-24">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/30 backdrop-blur-sm border-b border-white/40 h-[60px] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo(homeDashboard)}>
            <ArrowLeft className="w-6 h-6 text-[#102542]" />
          </button>
          <h1 className="text-[18px] text-[#102542]">Your Credit Score</h1>
        </div>
        <button 
          onClick={() => navigateTo('credit-score-share')}
          className="p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all"
        >
          <Share2 className="w-5 h-5 text-[#102542]" />
        </button>
      </div>

      {/* Content */}
      <div className="pt-[80px] px-6">
        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="bg-gradient-to-br from-[#3D8A75] to-[#102542] rounded-[20px] p-6 mb-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute w-[200px] h-[200px] rounded-full bg-white -top-10 -right-10" />
            <div className="absolute w-[150px] h-[150px] rounded-full bg-white -bottom-10 -left-10" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
            >
              <span className="text-[16px]">{status.emoji}</span>
              <span className="text-[13px] text-white font-medium">{status.label}</span>
            </motion.div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[14px] text-white/80 mb-1">Your Business Score</p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-[56px] text-white leading-none">{creditScore}</span>
                  <span className="text-[20px] text-white/60">/ {maxScore}</span>
                </motion.div>
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="relative w-[80px] h-[80px]"
              >
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="35" stroke="white" strokeOpacity="0.2" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="40" cy="40" r="35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: scorePercentage / 100 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[16px] text-white font-medium">{scorePercentage}%</span>
                </div>
              </motion.div>
            </div>

            {/* Credit Limit */}
            <div className="bg-white/10 rounded-xl p-3 mb-3">
              <p className="text-[12px] text-white/70 mb-1">Suggested Credit Limit</p>
              <p className="text-[20px] text-white font-bold">PKR {suggestedLimit.toLocaleString()}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/60">
                Last updated: {creditData?.creditScore?.lastCalculated 
                  ? new Date(creditData.creditScore.lastCalculated).toLocaleDateString('en-PK') 
                  : new Date().toLocaleDateString('en-PK')}
              </p>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors"
              >
                <RefreshCcw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <button 
            onClick={() => navigateTo('credit-score-share')}
            className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[12px] p-3 hover:bg-white/70 transition-all"
          >
            <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center mx-auto mb-2">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <p className="text-[10px] text-[#102542] font-medium">Share</p>
          </button>

          <button className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[12px] p-3 hover:bg-white/70 transition-all">
            <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center mx-auto mb-2">
              <Download className="w-4 h-4 text-white" />
            </div>
            <p className="text-[10px] text-[#102542] font-medium">Download</p>
          </button>

          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[12px] p-3 hover:bg-white/70 transition-all"
          >
            <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center mx-auto mb-2">
              <Info className="w-4 h-4 text-white" />
            </div>
            <p className="text-[10px] text-[#102542] font-medium">Details</p>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[12px] p-4 mb-6"
        >
          <p className="text-[13px] text-[#102542] font-medium mb-2">Loan access thresholds</p>
          <p className="text-[12px] text-[#102542] opacity-70 mb-3">
            {isMerchant
              ? `Bank financing unlocks at score 650+ with verified KYC. Pricing is bank-issued: KIBOR + spread by tier.`
              : isCustomer
              ? `BNPL unlocks at score ${BNPL_MIN_SCORE}+ with verified KYC and transaction history.`
              : 'Credit products are role-based and score-gated.'}
          </p>
          <div className="text-[12px] text-[#102542] space-y-1 mb-3">
            {isMerchant && <p>{(creditScore >= 650) ? '✓' : '•'} Bank financing eligibility: {(creditScore >= 650) ? 'Eligible' : 'Not eligible yet'}</p>}
            {isCustomer && <p>{isBnplEligible ? '✓' : '•'} BNPL eligibility: {isBnplEligible ? 'Eligible' : 'Not eligible yet'}</p>}
            {isCustomer && (
              <>
                <p>7-day markup: Excellent 0%, Good 5%, Fair 10%</p>
                <p>14-day markup: Excellent 0%, Good 10%, Fair 20%</p>
              </>
            )}
          </div>
          <button
            onClick={() => navigateTo(isCustomer ? 'customer-marketplace' : 'bank-financing-dashboard')}
            disabled={(isMerchant && !(creditScore >= 650)) || (isCustomer && !isBnplEligible)}
            className={`w-full h-10 rounded-lg text-sm font-medium transition-colors ${
              (isMerchant && (creditScore >= 650)) || (isCustomer && isBnplEligible)
                ? 'bg-[#3D8A75] text-white hover:bg-[#2d6b5c]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {(isMerchant && (creditScore >= 650)) || (isCustomer && isBnplEligible)
              ? isCustomer ? 'Shop with Pay Later' : 'View Bank Financing'
              : 'Improve score to unlock credit'}
          </button>
        </motion.div>

        {/* Score Factors */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mb-6">
          <h3 className="text-[16px] text-[#102542] font-medium mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            {factorsList.map((factor, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[12px] p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center ${
                        factor.status === 'Good' || factor.status === 'Established' ? 'bg-[#3D8A75]/20' :
                        factor.status === 'Average' || factor.status === 'Growing' ? 'bg-[#f59e0b]/20' :
                        'bg-[#ef4444]/20'
                      }`}>
                        <factor.icon className={`w-4 h-4 ${
                          factor.status === 'Good' || factor.status === 'Established' ? 'text-[#3D8A75]' :
                          factor.status === 'Average' || factor.status === 'Growing' ? 'text-[#f59e0b]' :
                          'text-[#ef4444]'
                        }`} />
                      </div>
                      <p className="text-[13px] text-[#102542] font-medium">{factor.title}</p>
                    </div>
                    <span className="text-[12px] text-[#102542] font-medium">{factor.status}</span>
                  </div>
                  <p className="text-[11px] text-[#102542] opacity-75 mb-2">{factor.metric}</p>
                  
                  <div className="bg-white/50 rounded-full h-[6px] overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, Math.min(100, factor.fill))}%` }}
                      transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        factor.status === 'Good' || factor.status === 'Established' ? 'bg-[#3D8A75]' :
                        factor.status === 'Average' || factor.status === 'Growing' ? 'bg-[#f59e0b]' :
                        'bg-[#ef4444]'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#102542] opacity-60 mb-1">
                    <span>Current progress: {Math.max(0, Math.min(100, factor.fill))}%</span>
                    <span>Healthy target</span>
                  </div>
                  <p className="text-[10px] text-[#102542] opacity-70 mb-1">{factor.healthyTarget}</p>

                  {showDetails && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[11px] text-[#102542] opacity-70 leading-relaxed"
                    >
                      {factor.detail}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <h3 className="text-[16px] text-[#102542] font-medium mb-3">How to Improve</h3>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="flex items-start gap-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-[10px] p-3"
              >
                <div className="w-[18px] h-[18px] rounded-full bg-[#3D8A75] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px]">{index + 1}</span>
                </div>
                {rec === 'Complete KYC verification to boost your score' && needsKycVerification ? (
                  <button
                    onClick={() => navigateTo('onboard-cnic')}
                    className="text-[12px] text-[#3D8A75] underline text-left leading-relaxed"
                  >
                    {rec}
                  </button>
                ) : (
                  <p className="text-[12px] text-[#102542] opacity-80 leading-relaxed">{rec}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-[#102542]/40 bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}
