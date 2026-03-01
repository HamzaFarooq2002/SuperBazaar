import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import svgPaths from "../imports/svg-pwbb4wldqn";
import imgLogo from "figma:asset/92375b66cc5f6db228cbba4fabc2bd6032c970de.png";

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

export function OnboardSignup() {
  const { navigateTo } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Generate a unique phone placeholder (will be updated in CNIC step later)
      const uniquePhone = '+92' + Date.now().toString().slice(-10);
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: uniquePhone,
        userType: 'customer',
        businessName: name.trim() + "'s Business",
        businessAddress: 'Pakistan'
      });
      navigateTo('onboard-usertype');
    } catch (err: any) {
      setError(err?.error?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden">
      <StatusBar />

      {/* Progress Bar */}
      <div className="absolute bg-white/30 backdrop-blur-sm border-b border-white/40 h-[61px] left-0 top-[49px] w-full">
        <div className="flex items-center justify-center pt-5">
          <p className="text-[12px] text-[#102542] opacity-80 tracking-[-0.12px]">
            Step 1 of 7 • Account
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[130px] px-6">
        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h2 className="text-[24px] text-[#102542] tracking-[-0.24px] mb-2">Welcome to SuperBazaar</h2>
          <p className="text-[11px] text-[#102542] opacity-70 tracking-[-0.11px]">
            Create your account or sign in to continue
          </p>
        </motion.div>

        {/* Tab Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative bg-white/40 backdrop-blur-sm h-[29px] rounded-[99px] mb-6 border border-white/50"
        >
          <div 
            className={`absolute bg-white/80 backdrop-blur-md h-[21px] rounded-[99px] top-[4px] w-[calc(50%-8px)] transition-all duration-300 shadow-sm ${
              activeTab === 'signup' ? 'left-[4px]' : 'left-[calc(50%+4px)]'
            }`}
          />
          <div className="flex h-full relative z-10">
            <button
              onClick={() => setActiveTab('signup')}
              className="flex-1 text-[11px] text-[#102542] font-medium"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setActiveTab('login');
                navigateTo('login');
              }}
              className="flex-1 text-[11px] text-[#102542] font-medium"
            >
              Login
            </button>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <p className="text-[16px] font-semibold text-[#102542] mb-1">Create an account</p>
            <p className="text-[14px] text-[#102542] opacity-80">Enter your details to sign up for this app</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-[8px] text-[13px] mb-2">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[40px] px-4 py-2 rounded-[8px] bg-white/50 backdrop-blur-sm border border-white/60 text-[14px] text-[#102542] placeholder:text-[#102542]/50 focus:outline-none focus:ring-2 focus:ring-[#3D8A75] focus:bg-white/70 transition-all"
          />

          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[40px] px-4 py-2 rounded-[8px] bg-white/50 backdrop-blur-sm border border-white/60 text-[14px] text-[#102542] placeholder:text-[#102542]/50 focus:outline-none focus:ring-2 focus:ring-[#3D8A75] focus:bg-white/70 transition-all"
          />

          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[40px] px-4 py-2 rounded-[8px] bg-white/50 backdrop-blur-sm border border-white/60 text-[14px] text-[#102542] placeholder:text-[#102542]/50 focus:outline-none focus:ring-2 focus:ring-[#3D8A75] focus:bg-white/70 transition-all"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] h-[43px] rounded-[10px] text-white font-medium text-[15px] tracking-[0.6px] transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {loading ? 'Creating Account...' : 'Continue'}
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 my-6"
        >
          <div className="flex-1 h-px bg-[#102542]/20" />
          <p className="text-[14px] text-[#102542]/60">or</p>
          <div className="flex-1 h-px bg-[#102542]/20" />
        </motion.div>

        {/* Social Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button className="w-full bg-white/60 backdrop-blur-sm h-[40px] rounded-[8px] flex items-center justify-center gap-2 border border-white/70 hover:bg-white/80 hover:scale-[1.02] transition-all">
            <div className="w-5 h-5">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g clipPath="url(#clip0_26_144)">
                  <path d={svgPaths.p33b7ccc0} fill="var(--fill-0, #4285F4)" />
                  <path d={svgPaths.p15123a40} fill="var(--fill-0, #34A853)" />
                  <path d={svgPaths.p28bf8e80} fill="var(--fill-0, #FBBC05)" />
                  <path d={svgPaths.p1e563600} fill="var(--fill-0, #EB4335)" />
                </g>
                <defs>
                  <clipPath id="clip0_26_144">
                    <rect fill="white" height="20" width="20" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span className="text-[14px] text-[#102542] font-medium">Continue with Google</span>
          </button>
        </motion.div>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[12px] text-[#102542]/60 text-center mt-6"
        >
          By clicking continue, you agree to our{' '}
          <span className="text-[#102542] font-medium">Terms of Service</span> and{' '}
          <span className="text-[#102542] font-medium">Privacy Policy</span>
        </motion.p>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-[#102542]/40 bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}