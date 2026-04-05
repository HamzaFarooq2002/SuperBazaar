import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, Fingerprint, CheckCircle2 } from 'lucide-react';
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

export function OnboardBiometric() {
  const { navigateTo, userType } = useContext(AppContext);
  const { refreshUser } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleBiometric = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setTimeout(async () => {
        try {
          await api.auth.submitKYC({ fingerprintVerified: true });
          await refreshUser();
        } catch (err: any) {
          setError(err?.error?.message || 'Unable to save biometric status');
        }
        // Customers skip documents and go to congratulations
        if (userType === 'customer') {
          navigateTo('onboard-congratulations');
        } else {
          navigateTo('onboard-documents');
        }
      }, 1500);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      <StatusBar />

      {/* Progress Bar */}
      <div className="absolute bg-[#f6f6f6] h-[61px] left-0 top-[49px] w-full">
        <div className="flex items-center justify-between px-4 pt-5">
          <p className="text-[12px] text-black opacity-60 tracking-[-0.12px]">
            Step 5 of 7 • Biometric
          </p>
          <div className="bg-[#e1f4e3] h-[22px] rounded-[21px] px-3 flex items-center gap-1">
            <div className="w-4 h-3 overflow-hidden">
              <img alt="" className="w-full h-full object-cover" src={imgRectangle4} />
            </div>
            <span className="text-[#38a829] text-[11px] font-extralight tracking-[-0.11px]">60%</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigateTo('onboard-otp')}
        className="absolute left-6 top-[140px] z-20"
      >
        <ArrowLeft className="w-6 h-6 text-black" />
      </button>

      {/* Content */}
      <div className="pt-[180px] px-6 pb-24 flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-[24px] text-black tracking-[-0.24px] mb-2">Biometric Verification</h2>
          <p className="text-[16px] text-black opacity-40 leading-relaxed px-8">
            Secure your account with fingerprint authentication
          </p>
        </motion.div>

        {/* Fingerprint Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
          className="relative mb-12"
        >
          <motion.div
            animate={isVerifying ? {
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: isVerifying ? Infinity : 0
            }}
            className={`w-40 h-40 rounded-full flex items-center justify-center ${
              isVerified ? 'bg-[#3D8A75]' : 'bg-gradient-to-br from-[#102542] to-[#3D8A75]'
            }`}
          >
            {isVerified ? (
              <CheckCircle2 className="w-20 h-20 text-white" />
            ) : (
              <Fingerprint className="w-20 h-20 text-white" />
            )}
          </motion.div>

          {/* Pulsing rings */}
          {!isVerified && (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 rounded-full border-4 border-[#3D8A75]"
              />
              <motion.div
                animate={{
                  scale: [1, 1.8],
                  opacity: [0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5
                }}
                className="absolute inset-0 rounded-full border-4 border-[#3D8A75]"
              />
            </>
          )}
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          {isVerified ? (
            <p className="text-[18px] text-[#3D8A75] font-semibold">
              ✓ Verified Successfully!
            </p>
          ) : isVerifying ? (
            <p className="text-[18px] text-[#102542] font-medium">
              Verifying...
            </p>
          ) : (
            <p className="text-[16px] text-black opacity-60">
              Touch the sensor to authenticate
            </p>
          )}
        </motion.div>

        {/* Action Button */}
        {!isVerified && !isVerifying && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleBiometric}
            className="w-full h-[43px] rounded-[10px] bg-[#3D8A75] text-white font-medium text-[15px] tracking-[0.6px] hover:bg-[#2d6b5c] transition-colors"
          >
            Verify Biometric
          </motion.button>
        )}

        {/* Skip Button */}
        {!isVerified && !isVerifying && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={async () => {
              try {
                await api.auth.submitKYC({ fingerprintVerified: false });
                await refreshUser();
              } catch (err: any) {
                setError(err?.error?.message || 'Unable to save biometric status');
              }
              navigateTo(userType === 'customer' ? 'onboard-congratulations' : 'onboard-documents');
            }}
            className="mt-4 text-[14px] text-black opacity-60 hover:opacity-100 transition-opacity"
          >
            Skip for now
          </motion.button>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
        )}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}