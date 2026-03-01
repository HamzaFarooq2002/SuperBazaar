import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, CheckCircle, Calendar, Shield, Home, Receipt, Wallet, User } from 'lucide-react';

export function BNPLApproved() {
  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const homeDashboard = user?.userType === 'customer' ? 'customer-dashboard' : 'dashboard';
  const [latestBNPL, setLatestBNPL] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestBNPL = async () => {
      try {
        const response = await api.credit.getCreditLines();
        if (response.success) {
          const lines = response.data?.creditLines || response.data || [];
          const bnplLines = lines.filter((cl: any) => cl.type === 'bnpl');
          if (bnplLines.length > 0) {
            setLatestBNPL(bnplLines[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load BNPL data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLatestBNPL();
  }, []);

  const loanAmount = latestBNPL?.principalAmount || 0;
  const installmentCount = latestBNPL?.installments?.length || 4;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500">Loading approval details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigateTo('payments-main')}
            className="flex items-center justify-center w-12 h-12"
          >
            <X className="w-6 h-6 text-[#121417]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#121417]">Loan Approval</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Hero Message */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <h2 className="text-[28px] font-bold text-[#121417] mb-2">
            Congratulations! You're Approved.
          </h2>
        </motion.div>

        {/* Celebration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative h-[247px] rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1703379943328-bfe13999c988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBjZWxlYnJhdGlvbiUyMGdyYWRpZW50fGVufDF8fHx8MTc2Mzc2NzExM3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Celebration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="relative h-full flex flex-col justify-between p-6">
            <div className="flex-1 flex items-center justify-center">
              <motion.h3
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[48px] font-extrabold text-white"
              >
                HOORAY
              </motion.h3>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1"
            >
              <p className="text-[14px] text-white">Loan Amount</p>
              <p className="text-[24px] font-bold text-white">PKR {loanAmount.toLocaleString()}</p>
              <p className="text-[16px] font-medium text-white">{installmentCount} Interest-Free Installments</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Installment Details */}
        {latestBNPL?.installments && latestBNPL.installments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h3 className="text-[16px] font-bold text-[#121417] mb-3">Payment Schedule</h3>
            <div className="space-y-2">
              {latestBNPL.installments.map((inst: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                  <span className="text-[14px] text-[#121417]">Installment {i + 1}</span>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-[#121417]">PKR {(inst.amount || 0).toLocaleString()}</p>
                    <p className="text-[11px] text-gray-500">
                      {inst.dueDate ? new Date(inst.dueDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }) : '--'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-4 bg-[#f0f5f2] rounded-xl p-4">
            <div className="w-10 h-10 bg-[#f0f5f2] rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#3D8A75]" />
            </div>
            <p className="text-[16px] text-[#121417]">No Fees</p>
          </div>
          <div className="flex items-center gap-4 bg-[#f0f5f2] rounded-xl p-4">
            <div className="w-10 h-10 bg-[#f0f5f2] rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#3D8A75]" />
            </div>
            <p className="text-[16px] text-[#121417]">First payment due in 30 days</p>
          </div>
          <div className="flex items-center gap-4 bg-[#f0f5f2] rounded-xl p-4">
            <div className="w-10 h-10 bg-[#f0f5f2] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#3D8A75]" />
            </div>
            <p className="text-[16px] text-[#121417]">Secure</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigateTo('payments-main')}
          className="w-full h-12 bg-[#3D8A75] hover:bg-[#2d6b5c] text-white text-[16px] font-bold rounded-xl transition-colors mb-3"
        >
          Accept Offer & Continue
        </motion.button>
        <button
          onClick={() => navigateTo('payments-main')}
          className="w-full text-[14px] text-[#3D8A75] hover:text-[#2d6b5c] transition-colors"
        >
          See Full Terms
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => navigateTo(homeDashboard)} className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Home</span>
          </button>
          <button onClick={() => navigateTo('order-tracking')} className="flex flex-col items-center gap-1">
            <Receipt className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Orders</span>
          </button>
          <button onClick={() => navigateTo('payments-main')} className="flex flex-col items-center gap-1">
            <Wallet className="w-6 h-6 text-[#3D8A75]" />
            <span className="text-[11px] text-[#3D8A75]">Payments</span>
          </button>
          <button onClick={() => navigateTo('profile')} className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
