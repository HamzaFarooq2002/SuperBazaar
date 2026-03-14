import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart } from 'lucide-react';

export function SplashScreen() {
  const { navigateTo } = useContext(AppContext);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [showTap, setShowTap] = useState(false);

  useEffect(() => {
    const tapTimer = setTimeout(() => {
      if (!authLoading && isAuthenticated && user) {
        const target =
          user.userType === 'customer'
            ? 'customer-dashboard'
            : user.userType === 'supplier'
            ? 'supplier-dashboard'
            : 'dashboard';
        navigateTo(target);
      } else {
        setShowTap(true);
      }
    }, 2000);

    return () => {
      clearTimeout(tapTimer);
    };
  }, [authLoading, isAuthenticated, user]);

  const handleTap = () => {
    if (!authLoading && isAuthenticated && user) {
      const target =
        user.userType === 'customer'
          ? 'customer-dashboard'
          : user.userType === 'supplier'
          ? 'supplier-dashboard'
          : 'dashboard';
      navigateTo(target);
    } else {
      navigateTo('onboard-intro');
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0e1f3a] to-[#357968] cursor-pointer"
      onClick={handleTap}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-block mb-6 relative"
        >
          {/* Shopping cart - Bigger and Light Green */}
          <div className="relative">
            <ShoppingCart className="w-32 h-32 text-[#90EE90]" strokeWidth={2.5} />
            
            {/* Credit card standing vertically inside shopping cart */}
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5, type: "spring" }}
              className="absolute top-6 left-1/2 -translate-x-1/2"
            >
              {/* Credit card - vertical orientation */}
              <div className="relative w-10 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-lg shadow-xl border border-white/30">
                {/* Card chip */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-3 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-sm"></div>
                
                {/* Card lines */}
                <div className="absolute bottom-3 left-1 right-1 space-y-1">
                  <div className="h-0.5 bg-white/40 rounded"></div>
                  <div className="h-0.5 bg-white/40 rounded w-3/4"></div>
                  <div className="h-0.5 bg-white/40 rounded w-1/2"></div>
                </div>
                
                {/* Card shine effect */}
                <motion.div
                  animate={{ y: [-30, 60] }}
                  transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-lg"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 50%)' }}
                ></motion.div>
              </div>
            </motion.div>
          </div>

          {/* Glow effect */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-[#90EE90]/20 blur-2xl -z-10"
          ></motion.div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white mb-2"
        >
          Super Bazaar
        </motion.h1>

        {/* Main Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-3"
        >
          <p className="text-white text-lg tracking-wide">
            Smart Retail Starts Here
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[#CDD7D6]"
        >
          Empowering Pakistani MSMEs
        </motion.p>

        {/* Tap to continue */}
        {showTap && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/80"
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}