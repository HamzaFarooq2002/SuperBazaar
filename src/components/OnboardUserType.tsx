import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, Package, Store, User } from 'lucide-react';
import svgPaths from "../imports/svg-2pthmw0ane";
import imgRectangle4 from "figma:asset/a9f37960141116dc132cdcd04169283a98871cc6.png";

function StatusBar() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip top-0 w-full z-10">
      <div className="absolute h-[11.336px] right-[14.67px] top-[17.33px] w-[66.661px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 12">
          <g>
            <g>
              <path d={svgPaths.p284dc240} opacity="0.35" stroke="var(--stroke-0, black)" />
              <path d={svgPaths.p3b01f0e0} fill="var(--fill-0, black)" opacity="0.4" />
              <path d={svgPaths.p11b4bf10} fill="var(--fill-0, black)" />
            </g>
            <path d={svgPaths.pc434800} fill="var(--fill-0, black)" />
            <path d={svgPaths.p28a9ed00} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
      <div className="absolute h-[21px] left-[21px] top-[12px] w-[54px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 21">
          <g>
            <g>
              <path d={svgPaths.p24372f50} fill="var(--fill-0, black)" />
              <path d={svgPaths.p3aa84e00} fill="var(--fill-0, black)" />
              <path d={svgPaths.p2e6b3780} fill="var(--fill-0, black)" />
              <path d={svgPaths.p12b0b900} fill="var(--fill-0, black)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export function OnboardUserType() {
  const { navigateTo, setUserType } = useContext(AppContext);
  const { refreshUser } = useAuth();
  const [selectedType, setSelectedType] = useState<'supplier' | 'business' | 'customer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userTypes = [
    {
      id: 'supplier' as const,
      icon: Package,
      title: "I'm a Supplier",
      description: 'I want to supply products to businesses through verified marketplace orders',
      benefits: ['Reach more buyers', 'Manage Orders'],
      color: 'from-[#102542] to-[#3D8A75]'
    },
    {
      id: 'business' as const,
      icon: Store,
      title: "I'm a Business Owner",
      description: 'I want to source products with business loans and access business loans',
      benefits: ['Find Suppliers', 'Get More Loans'],
      color: 'from-[#3D8A75] to-[#102542]'
    },
    {
      id: 'customer' as const,
      icon: User,
      title: "I'm a Customer",
      description: 'I want to buy products and pay via installments and access nano loans',
      benefits: ['Get Cashback', 'Get Nano Loans'],
      color: 'from-[#102542] to-[#3D8A75]'
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden">
      <StatusBar />

      {/* Progress Bar */}
      <div className="absolute bg-white/30 backdrop-blur-sm border-b border-white/40 h-[61px] left-0 top-[49px] w-full">
        <div className="flex items-center justify-between px-4 pt-5">
          <p className="text-[12px] text-[#102542] opacity-80 tracking-[-0.12px]">
            Step 2 of 7 • User Type
          </p>
          <div className="bg-[#3D8A75]/20 backdrop-blur-sm border border-[#3D8A75]/30 h-[22px] rounded-[21px] px-3 flex items-center gap-1">
            <div className="w-4 h-3 overflow-hidden">
              <img alt="" className="w-full h-full object-cover" src={imgRectangle4} />
            </div>
            <span className="text-[#3D8A75] text-[11px] font-extralight tracking-[-0.11px]">10%</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigateTo('onboard-signup')}
        className="absolute left-6 top-[140px] z-20"
      >
        <ArrowLeft className="w-6 h-6 text-[#102542]" />
      </button>

      {/* Content */}
      <div className="pt-[180px] px-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <h2 className="text-[24px] text-[#102542] tracking-[-0.24px] mb-2">Tell us about yourself</h2>
          <p className="text-[16px] text-[#102542] opacity-70 leading-relaxed mb-6">
            This helps us customize your experience
          </p>
        </motion.div>

        {/* User Type Cards */}
        <div className="space-y-4 mb-6">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.15 }}
              onClick={() => setSelectedType(type.id)}
              className={`bg-white/50 backdrop-blur-md border border-white/60 rounded-[10px] p-4 cursor-pointer transition-all hover:bg-white/70 hover:scale-[1.02] ${
                selectedType === type.id ? 'ring-2 ring-[#3D8A75] bg-white/70' : ''
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-[45px] h-[45px] rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-[#102542] font-medium tracking-[0.52px] mb-1">
                    {type.title}
                  </p>
                  <p className="text-[12px] text-[#102542] opacity-70 tracking-[0.48px] leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 ml-14">
                {type.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-[9px] h-[9px] rounded-full bg-[#3D8A75]" />
                    <span className="text-[10px] text-[#102542] opacity-70 italic tracking-[0.4px]">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verification Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 backdrop-blur-md border border-white/60 h-[43px] rounded-[10px] flex items-center justify-center mb-6"
        >
          <p className="text-[13px] text-[#102542] tracking-[-0.13px]">
            <span className="font-bold">✨</span> Complete verification to unlock exclusive benefits
          </p>
        </motion.div>

        {/* Continue Button */}
        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={async () => {
            if (!selectedType) return;
            setError('');
            setLoading(true);
            try {
              // Map UI type to backend: 'business' -> 'merchant'
              const apiUserType = selectedType === 'business' ? 'merchant' : selectedType;
              await api.users.updateProfile({ userType: apiUserType });
              await refreshUser();
              setUserType?.(selectedType);
              navigateTo('onboard-cnic');
            } catch (err: any) {
              setError(err?.error?.message || 'Failed to update profile. Please try again.');
            } finally {
              setLoading(false);
            }
          }}
          disabled={!selectedType || loading}
          className={`w-full h-[43px] rounded-[10px] text-white font-medium text-[15px] tracking-[0.6px] transition-all ${
            selectedType && !loading
              ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] hover:shadow-lg hover:scale-[1.02]' 
              : 'bg-white/30 backdrop-blur-sm text-[#102542]/40 cursor-not-allowed'
          }`}
        >
          {loading ? 'Updating...' : 'Continue'}
        </motion.button>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-[#102542]/40 bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}