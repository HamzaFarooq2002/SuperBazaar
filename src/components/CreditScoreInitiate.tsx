import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Shield, TrendingUp, FileText, Clock } from 'lucide-react';

export function CreditScoreInitiate() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard = user?.userType === 'customer' ? 'customer-dashboard' : 'dashboard';

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analysis',
      description: 'Get your score in seconds'
    },
    {
      icon: FileText,
      title: 'Detailed Report',
      description: 'Comprehensive credit breakdown'
    },
    {
      icon: Clock,
      title: 'Always Updated',
      description: 'Refresh anytime you need'
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/30 backdrop-blur-sm border-b border-white/40 h-[60px] flex items-center px-6 z-10">
        <button
          onClick={() => navigateTo(homeDashboard)}
          className="mr-4"
        >
          <ArrowLeft className="w-6 h-6 text-[#102542]" />
        </button>
        <h1 className="text-[18px] text-[#102542]">Credit Score</h1>
      </div>

      {/* Content */}
      <div className="pt-[80px] px-6 pb-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] mb-4 shadow-lg"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-[28px] text-[#102542] mb-2">
            Check Your Business Credit Score
          </h2>
          <p className="text-[14px] text-[#102542] opacity-70 leading-relaxed max-w-[300px] mx-auto">
            Understand your creditworthiness and unlock better financing opportunities
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#3D8A75]/10 backdrop-blur-sm border border-[#3D8A75]/30 rounded-[16px] p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-[#3D8A75]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[20px]">💡</span>
            </div>
            <div>
              <p className="text-[13px] text-[#102542] font-medium mb-1">
                Why Check Your Credit Score?
              </p>
              <p className="text-[11px] text-[#102542] opacity-70 leading-relaxed">
                A good credit score helps you get better loan terms, higher credit limits, and builds trust with suppliers offering SNPL.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[12px] p-4 hover:bg-white/70 transition-all"
            >
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center mb-2">
                <feature.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-[12px] text-[#102542] font-medium mb-1">
                {feature.title}
              </p>
              <p className="text-[10px] text-[#102542] opacity-60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* What We'll Check */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <p className="text-[13px] text-[#102542] font-medium mb-3">
            What we'll analyze:
          </p>
          <div className="space-y-2">
            {[
              'Payment history & transaction patterns',
              'Business registration details',
              'Outstanding loans & credit utilization',
              'Supplier relationships & SNPL usage'
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-2"
              >
                <div className="w-[18px] h-[18px] rounded-full bg-[#3D8A75] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[12px] text-[#102542] opacity-70">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-[12px] p-4 mb-6"
        >
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-[#3D8A75] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#102542] opacity-70 leading-relaxed">
              <span className="font-medium text-[#102542]">Your privacy is protected.</span> We use bank-grade encryption and never share your data without explicit consent.
            </p>
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          onClick={() => navigateTo('credit-score-generating')}
          className="w-full h-[50px] rounded-[12px] bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white font-medium text-[16px] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          Generate My Credit Score
        </motion.button>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-[11px] text-[#102542] opacity-60 text-center mt-4"
        >
          By continuing, you consent to credit analysis as per our{' '}
          <span className="text-[#3D8A75] font-medium">Terms of Service</span>
        </motion.p>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-[#102542]/40 bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}
