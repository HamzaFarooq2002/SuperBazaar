import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { CheckCircle, TrendingUp, Award } from 'lucide-react';
import svgPaths from "../imports/svg-wlq7du9dx6";

function StatusBar() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip top-0 w-full z-10">
      <div className="absolute h-[11.336px] right-[14.67px] top-[17.33px] w-[66.661px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 12">
          <g>
            <g>
              <path d={svgPaths.p284dc240} opacity="0.35" stroke="var(--stroke-0, #E1F4E3)" />
              <path d={svgPaths.p3b01f0e0} fill="var(--fill-0, #E1F4E3)" opacity="0.4" />
              <path d={svgPaths.p11b4bf10} fill="var(--fill-0, #E1F4E3)" />
            </g>
            <path d={svgPaths.pc434800} fill="var(--fill-0, #E1F4E3)" />
            <path d={svgPaths.p28a9ed00} fill="var(--fill-0, #E1F4E3)" />
          </g>
        </svg>
      </div>
      <div className="absolute h-[21px] left-[21px] top-[12px] w-[54px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 21">
          <g>
            <g>
              <path d={svgPaths.p24372f50} fill="var(--fill-0, #E1F4E3)" />
              <path d={svgPaths.p3aa84e00} fill="var(--fill-0, #E1F4E3)" />
              <path d={svgPaths.p2e6b3780} fill="var(--fill-0, #E1F4E3)" />
              <path d={svgPaths.p12b0b900} fill="var(--fill-0, #E1F4E3)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export function OnboardComplete() {
  const { navigateTo, userType } = useContext(AppContext);

  const verifications = userType === 'customer'
    ? [
        { text: 'Identity verified with NADRA', icon: CheckCircle },
        { text: 'Mobile number confirmed', icon: CheckCircle },
        { text: 'Account security enabled', icon: CheckCircle }
      ]
    : [
        { text: 'Identity verified with NADRA', icon: CheckCircle },
        { text: 'Mobile number confirmed', icon: CheckCircle },
        { text: 'Business documents verified', icon: CheckCircle }
      ];

  const benefits = userType === 'customer' 
    ? [
        { text: 'Shop products and pay in installments', icon: TrendingUp },
        { text: 'Access instant nano loans up to PKR 50,000', icon: Award }
      ]
    : [
        { text: 'Browse suppliers and get SNPL terms', icon: TrendingUp },
        { text: 'Build your credit score with every transaction', icon: Award }
      ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#102542] to-[#3D8A75]">
      <StatusBar />

      {/* Content */}
      <div className="relative z-10 px-6 pt-24 pb-8 flex flex-col min-h-screen">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-3"
        >
          <h1 className="text-[#e1f4e3] text-[20px] font-semibold tracking-[-0.2px] leading-[1.5]">
            Welcome To SuperBazaar
          </h1>
          <p className="text-[#e1f4e3] text-[16px] leading-[1.5] mt-2">
            Your account is ready
          </p>
        </motion.div>

        {/* Rewards Card */}
        {userType !== 'customer' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative mx-auto w-full max-w-[280px] mb-6 rounded-[20px] overflow-hidden"
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute inset-0 border border-white/20 rounded-[20px]"></div>
            
            <div className="relative p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-6 h-6 text-white">
                  <Award className="w-full h-full" />
                </div>
                <p className="text-white text-[15px] font-bold tracking-[0.6px]">
                  Your Rewards
                </p>
              </div>
              
              <h2 className="text-white text-[32px] font-semibold tracking-[1.28px] leading-[1.5] mb-1">
                40%
              </h2>
              
              <p className="text-white text-[11px] font-semibold tracking-[0.44px] leading-[1.5] mb-4">
                SNPL Discount Unlocked
              </p>
              
              <div className="h-px bg-white/30 mb-4"></div>
              
              {/* Verification Items */}
              <div className="space-y-3">
                {verifications.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-[10px] h-[10px] rounded-full bg-[#90EE90] flex-shrink-0"></div>
                    <p className="text-[#e1f4e3] text-[11px] font-medium tracking-[0.44px] leading-[1.5] text-left">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Benefits */}
        <div className="space-y-3 mb-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="relative rounded-[10px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-[0.74]"></div>
              <div className="relative px-4 py-4 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-[#e1f4e3] text-[12px] font-medium tracking-[0.48px] leading-[1.5]">
                  {benefit.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Go to Dashboard Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={() => navigateTo(userType === 'customer' ? 'customer-dashboard' : 'dashboard')}
          className="w-full bg-white h-[43px] rounded-[10px] text-[#3D8A75] font-medium text-[15px] tracking-[0.6px] hover:bg-white/90 transition-colors mt-auto"
        >
          Go to Dashboard
        </motion.button>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-white/30 bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}