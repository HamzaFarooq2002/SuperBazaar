import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, TrendingUp, TrendingDown, Info, Share2, Download, RefreshCcw } from 'lucide-react';

export function CreditScoreResult() {
  const { navigateTo } = useContext(AppContext);
  const [showDetails, setShowDetails] = useState(false);

  const creditScore = 742; // Good score
  const maxScore = 900;
  const scorePercentage = (creditScore / maxScore) * 100;

  const getScoreStatus = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: '#3D8A75', emoji: '🎉' };
    if (score >= 650) return { label: 'Good', color: '#38a829', emoji: '✅' };
    if (score >= 550) return { label: 'Fair', color: '#f59e0b', emoji: '⚠️' };
    return { label: 'Needs Improvement', color: '#ef4444', emoji: '📊' };
  };

  const status = getScoreStatus(creditScore);

  const factors = [
    {
      title: 'Payment History',
      score: 95,
      status: 'excellent',
      icon: TrendingUp,
      detail: 'No missed payments in the last 12 months'
    },
    {
      title: 'Credit Utilization',
      score: 78,
      status: 'good',
      icon: TrendingUp,
      detail: 'Using 32% of available credit'
    },
    {
      title: 'Business Age',
      score: 65,
      status: 'fair',
      icon: Info,
      detail: '2 years in business'
    },
    {
      title: 'Recent Inquiries',
      score: 45,
      status: 'needs-work',
      icon: TrendingDown,
      detail: '5 credit checks in last 3 months'
    }
  ];

  const recommendations = [
    'Reduce credit utilization below 30% to improve score',
    'Continue maintaining excellent payment history',
    'Space out credit applications over time',
    'Consider diversifying credit types'
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
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute w-[200px] h-[200px] rounded-full bg-white -top-10 -right-10" />
            <div className="absolute w-[150px] h-[150px] rounded-full bg-white -bottom-10 -left-10" />
          </div>

          <div className="relative z-10">
            {/* Status Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
            >
              <span className="text-[16px]">{status.emoji}</span>
              <span className="text-[13px] text-white font-medium">{status.label}</span>
            </motion.div>

            {/* Score Display */}
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

              {/* Circular Progress */}
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="relative w-[80px] h-[80px]"
              >
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="white"
                    strokeOpacity="0.2"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: scorePercentage / 100 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[16px] text-white font-medium">{Math.round(scorePercentage)}%</span>
                </div>
              </motion.div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/60">
                Last updated: {new Date().toLocaleDateString('en-PK')}
              </p>
              <button className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors">
                <RefreshCcw className="w-3 h-3" />
                Refresh
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-6"
        >
          <h3 className="text-[16px] text-[#102542] font-medium mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            {factors.map((factor, index) => (
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
                  <span className="text-[14px] text-[#102542] font-medium">{factor.score}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="bg-white/50 rounded-full h-[6px] overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.score}%` }}
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
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
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
                <p className="text-[12px] text-[#102542] opacity-80 leading-relaxed">
                  {rec}
                </p>
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
