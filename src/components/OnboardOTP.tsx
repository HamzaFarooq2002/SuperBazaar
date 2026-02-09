import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, MessageSquare } from 'lucide-react';
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

export function OnboardOTP() {
  const { navigateTo, userType } = useContext(AppContext);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      <StatusBar />

      {/* Progress Bar */}
      <div className="absolute bg-[#f6f6f6] h-[61px] left-0 top-[49px] w-full">
        <div className="flex items-center justify-between px-4 pt-5">
          <p className="text-[12px] text-black opacity-60 tracking-[-0.12px]">
            Step 4 of 7 • OTP Verification
          </p>
          <div className="bg-[#e1f4e3] h-[22px] rounded-[21px] px-3 flex items-center gap-1">
            <div className="w-4 h-3 overflow-hidden">
              <img alt="" className="w-full h-full object-cover" src={imgRectangle4} />
            </div>
            <span className="text-[#38a829] text-[11px] font-extralight tracking-[-0.11px]">45%</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigateTo('onboard-cnic')}
        className="absolute left-6 top-[140px] z-20"
      >
        <ArrowLeft className="w-6 h-6 text-black" />
      </button>

      {/* Content */}
      <div className="pt-[180px] px-6 pb-24">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#102542] to-[#3D8A75] flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-[24px] text-black tracking-[-0.24px] mb-2">Enter OTP Code</h2>
          <p className="text-[16px] text-black opacity-40 leading-relaxed">
            We've sent a 6-digit code to
          </p>
          <p className="text-[15px] text-[#3D8A75] font-medium mt-1">+92 300 1234567</p>
        </motion.div>

        {/* OTP Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3 mb-6"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-[24px] font-semibold rounded-[10px] border-2 border-[#e0e0e0] focus:border-[#3D8A75] focus:outline-none transition-colors"
            />
          ))}
        </motion.div>

        {/* Timer and Resend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          {timer > 0 ? (
            <p className="text-[14px] text-black opacity-60">
              Resend code in <span className="text-[#3D8A75] font-semibold">{timer}s</span>
            </p>
          ) : (
            <button className="text-[14px] text-[#3D8A75] font-semibold">
              Resend OTP
            </button>
          )}
        </motion.div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            if (isComplete) {
              navigateTo('onboard-biometric');
            }
          }}
          disabled={!isComplete}
          className={`w-full h-[43px] rounded-[10px] text-white font-medium text-[15px] tracking-[0.6px] transition-all ${
            isComplete 
              ? 'bg-[#3D8A75] hover:bg-[#2d6b5c]' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Verify OTP
        </motion.button>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}