import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle } from 'lucide-react';

export function SuccessScreen() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard =
    user?.userType === 'customer'
      ? 'customer-dashboard'
      : user?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102542] to-[#3D8A75] flex items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-white" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white mb-4"
        >
          Success!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[#CDD7D6] mb-8 max-w-sm mx-auto"
        >
          Your application has been submitted successfully.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigateTo('payments-main')}
            className="w-full max-w-xs py-4 rounded-xl bg-white text-[#102542] transition-all hover:bg-white/90"
          >
            View Payments
          </button>
          <button
            onClick={() => navigateTo(homeDashboard)}
            className="w-full max-w-xs py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white/30"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
