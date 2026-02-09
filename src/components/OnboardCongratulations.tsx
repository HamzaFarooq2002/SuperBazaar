import React, { useContext, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { PartyPopper } from 'lucide-react';

export function OnboardCongratulations() {
  const { navigateTo } = useContext(AppContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('onboard-complete');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#102542] to-[#3D8A75] flex items-center justify-center">
      {/* Confetti-like circles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 0.5,
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: ['#CDD7D6', '#e1f4e3', '#90EE90', 'white'][Math.floor(Math.random() * 4)]
          }}
        />
      ))}

      <div className="relative z-10 text-center px-6">
        {/* Party Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <PartyPopper className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Hurray Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-white text-[48px] tracking-[-0.48px] mb-4">
            Hurray! 🎉
          </h1>
        </motion.div>

        {/* Congratulations Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-white text-[28px] tracking-[-0.28px]">
            Congratulations!
          </h2>
          <p className="text-white/90 text-[18px] leading-relaxed max-w-[300px] mx-auto">
            You have completed the onboarding journey
          </p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-2 mt-12"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 rounded-full bg-white"
            />
          ))}
        </motion.div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-white/30 bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}