import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, CreditCard, Phone } from 'lucide-react';
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

export function OnboardCNIC() {
  const { navigateTo } = useContext(AppContext);
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');

  const formatCNIC = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
  };

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNIC(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 13) {
      setCnic(formatted);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      setPhone(numbers);
    }
  };

  const isValid = cnic.replace(/\D/g, '').length === 13 && phone.length === 11;

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      <StatusBar />

      {/* Progress Bar */}
      <div className="absolute bg-[#f6f6f6] h-[61px] left-0 top-[49px] w-full">
        <div className="flex items-center justify-between px-4 pt-5">
          <p className="text-[12px] text-black opacity-60 tracking-[-0.12px]">
            Step 3 of 7 • Verification
          </p>
          <div className="bg-[#e1f4e3] h-[22px] rounded-[21px] px-3 flex items-center gap-1">
            <div className="w-4 h-3 overflow-hidden">
              <img alt="" className="w-full h-full object-cover" src={imgRectangle4} />
            </div>
            <span className="text-[#38a829] text-[11px] font-extralight tracking-[-0.11px]">30%</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigateTo('onboard-usertype')}
        className="absolute left-6 top-[140px] z-20"
      >
        <ArrowLeft className="w-6 h-6 text-black" />
      </button>

      {/* Content */}
      <div className="pt-[180px] px-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-[24px] text-black tracking-[-0.24px] mb-2">Verify Your Identity</h2>
          <p className="text-[16px] text-black opacity-40 leading-relaxed">
            Enter your CNIC and phone number for verification
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5"
        >
          {/* CNIC Input */}
          <div>
            <label className="block text-[13px] text-black opacity-60 mb-2 ml-1">
              CNIC Number (13 digits)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <CreditCard className="w-5 h-5 text-[#3D8A75]" />
              </div>
              <input
                type="text"
                placeholder="12345-6789012-3"
                value={cnic}
                onChange={handleCnicChange}
                className="w-full h-[50px] pl-12 pr-4 rounded-[10px] border border-[#e0e0e0] text-[15px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-[13px] text-black opacity-60 mb-2 ml-1">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Phone className="w-5 h-5 text-[#3D8A75]" />
              </div>
              <input
                type="tel"
                placeholder="03001234567"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full h-[50px] pl-12 pr-4 rounded-[10px] border border-[#e0e0e0] text-[15px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
              />
            </div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#e1f4e3] rounded-[10px] p-4 mt-6"
          >
            <p className="text-[12px] text-[#102542] leading-relaxed">
              <span className="font-semibold">🔒 Secure Verification:</span> Your information will be verified with NADRA and kept completely confidential.
            </p>
          </motion.div>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => {
            if (isValid) {
              navigateTo('onboard-otp');
            }
          }}
          disabled={!isValid}
          className={`w-full h-[43px] rounded-[10px] text-white font-medium text-[15px] tracking-[0.6px] transition-all mt-8 ${
            isValid 
              ? 'bg-[#3D8A75] hover:bg-[#2d6b5c]' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continue to Verification
        </motion.button>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}
