import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import api from '../services/api';
import { ArrowLeft, TrendingUp, TrendingDown, Info, Share2, Download, RefreshCcw } from 'lucide-react';

export function CreditScoreResult() {
  const { navigateTo } = useContext(AppContext);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creditData, setCreditData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadCreditScore = async () => {
    try {
      const response = await api.credit.getCreditScore();
      if (response.success) {
        setCreditData(response.data);
      }
    } catch (error) {
      console.error('Failed to load credit score:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCreditScore();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCreditScore();
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

  const factorsList = [
    {
      title: 'Payment History',
      score: Math.round(factors.paymentHistory || 0),
      maxScore: 35,
      status: (factors.paymentHistory || 0) >= 30 ? 'excellent' : (factors.paymentHistory || 0) >= 20 ? 'good' : (factors.paymentHistory || 0) >= 10 ? 'fair' : 'needs-work',
      icon: TrendingUp,
      detail: factors.paymentHistory >= 30 ? 'Excellent KYC and payment record' : 'Complete KYC verification to improve'
    },
    {
      title: 'Account Age',
      score: Math.round(factors.accountAge || 0),
      maxScore: 15,
      status: (factors.accountAge || 0) >= 12 ? 'excellent' : (factors.accountAge || 0) >= 8 ? 'good' : (factors.accountAge || 0) >= 4 ? 'fair' : 'needs-work',
      icon: Info,
      detail: factors.accountAge >= 12 ? 'Well-established account' : 'Account age contributes to your score over time'
    },
    {
      title: 'Transaction Volume',
      score: Math.round(factors.transactionVolume || 0),
      maxScore: 25,
      status: (factors.transactionVolume || 0) >= 20 ? 'excellent' : (factors.transactionVolume || 0) >= 12 ? 'good' : (factors.transactionVolume || 0) >= 6 ? 'fair' : 'needs-work',
      icon: (factors.transactionVolume || 0) >= 12 ? TrendingUp : TrendingDown,
      detail: factors.transactionVolume >= 12 ? 'Strong transaction history' : 'Increase completed transactions to improve'
    },
    {
      title: 'Credit Utilization',
      score: Math.round(factors.creditUtilization || 0),
      maxScore: 25,
      status: (factors.creditUtilization || 0) >= 20 ? 'excellent' : (factors.creditUtilization || 0) >= 12 ? 'good' : (factors.creditUtilization || 0) >= 6 ? 'fair' : 'needs-work',
      icon: TrendingUp,
      detail: 'Based on your credit usage patterns'
    }
  ];

  const recommendations = creditScore >= 700
    ? ['Maintain your excellent payment history', 'Consider increasing transaction volume', 'Your credit limit is well-positioned']
    : [
        'Complete KYC verification to boost your score',
        'Increase your transaction volume with regular purchases',
        'Maintain consistent activity on the platform',
        'Build credit history over time'
      ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden pb-24">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/30 backdrop-blur-sm border-b border-white/40 h-[60px] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('dashboard')}>
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

        {/* Score Factors */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mb-6">
          <h3 className="text-[16px] text-[#102542] font-medium mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            {factorsList.map((factor, index) => {
              const percentage = factor.maxScore > 0 ? Math.round((factor.score / factor.maxScore) * 100) : 0;
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
                        factor.status === 'excellent' ? 'bg-[#3D8A75]/20' :
                        factor.status === 'good' ? 'bg-[#38a829]/20' :
                        factor.status === 'fair' ? 'bg-[#f59e0b]/20' :
                        'bg-[#ef4444]/20'
                      }`}>
                        <factor.icon className={`w-4 h-4 ${
                          factor.status === 'excellent' ? 'text-[#3D8A75]' :
                          factor.status === 'good' ? 'text-[#38a829]' :
                          factor.status === 'fair' ? 'text-[#f59e0b]' :
                          'text-[#ef4444]'
                        }`} />
                      </div>
                      <p className="text-[13px] text-[#102542] font-medium">{factor.title}</p>
                    </div>
                    <span className="text-[14px] text-[#102542] font-medium">{percentage}%</span>
                  </div>
                  
                  <div className="bg-white/50 rounded-full h-[6px] overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        factor.status === 'excellent' ? 'bg-[#3D8A75]' :
                        factor.status === 'good' ? 'bg-[#38a829]' :
                        factor.status === 'fair' ? 'bg-[#f59e0b]' :
                        'bg-[#ef4444]'
                      }`}
                    />
                  </div>

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
                <p className="text-[12px] text-[#102542] opacity-80 leading-relaxed">{rec}</p>
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
