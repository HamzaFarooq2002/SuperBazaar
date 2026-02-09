import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { TrendingUp, Shield } from 'lucide-react';
import svgPaths from "../imports/svg-wlq7du9dx6";

function StatusBar() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip top-0 w-full z-10">
      <div className="absolute h-[11.336px] right-[14.67px] top-[17.33px] w-[66.661px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 12">
          <g id="Right Side">
            <g id="Battery">
              <path d={svgPaths.p284dc240} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, #E1F4E3)" />
              <path d={svgPaths.p3b01f0e0} fill="var(--fill-0, #E1F4E3)" id="Combined Shape" opacity="0.4" />
              <path d={svgPaths.p11b4bf10} fill="var(--fill-0, #E1F4E3)" id="Rectangle_2" />
            </g>
            <path d={svgPaths.pc434800} fill="var(--fill-0, #E1F4E3)" id="Wifi" />
            <path d={svgPaths.p28a9ed00} fill="var(--fill-0, #E1F4E3)" id="Mobile Signal" />
          </g>
        </svg>
      </div>
      <div className="absolute h-[21px] left-[21px] top-[12px] w-[54px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 21">
          <g id="Time">
            <g id="9:41">
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

export function OnboardIntro() {
  const { navigateTo } = useContext(AppContext);

  const features = [
    {
      icon: TrendingUp,
      title: 'Supply Now, Pay Later',
      description: 'Access inventory without upfront payment. Flexible repayment terms.'
    },
    {
      icon: Shield,
      title: 'Credit Scoring & Loans',
      description: 'Build your credit score and access business loans through open banking.'
    }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#102542] to-[#3D8A75]">
      {/* Status Bar */}
      <StatusBar />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-6 pt-32 pb-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-[#e1f4e3] mb-4 text-[36px] tracking-[-0.36px]">SuperBazaar</h1>
          <p className="text-[#e1f4e3] text-[16px] leading-[1.5]">Empowering SMEs & Suppliers</p>
        </motion.div>

        {/* Features */}
        <div className="w-full space-y-4 flex-1 flex flex-col justify-center max-w-[333px]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
              className="relative rounded-[10px] overflow-hidden"
            >
              {/* Glass effect background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-80"></div>
              <div className="absolute inset-0 border border-white/[0.18] rounded-[10px]"></div>
              
              <div className="relative p-4 flex items-start gap-3">
                <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#CDD7D6] to-white flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-[#102542]" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-[14px] tracking-[0.56px] mb-1">{feature.title}</p>
                  <p className="text-white text-[12px] tracking-[0.48px] leading-[1.5]">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Get Started Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full max-w-[333px]"
        >
          <button
            onClick={() => navigateTo('onboard-signup')}
            className="w-full bg-white h-[43px] rounded-[10px] text-[#3D8A75] font-medium text-[15px] tracking-[0.6px] hover:bg-white/90 transition-colors"
          >
            Get Started
          </button>
          <p className="text-white/80 text-[10px] text-center mt-3 tracking-[0.4px]">
            Join thousands of businesses growing with SuperBazaar
          </p>
        </motion.div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}