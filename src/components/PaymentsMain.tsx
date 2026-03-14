import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, FileText, TrendingUp, CreditCard, Home, Receipt, Wallet, User, Inbox } from 'lucide-react';

export function PaymentsMain() {
  const { navigateTo } = useContext(AppContext);
  const { user: authUser } = useAuth();
  const homeDashboard =
    authUser?.userType === 'customer'
      ? 'customer-dashboard'
      : authUser?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';
  const [activeTab, setActiveTab] = useState<'snpl' | 'bnpl'>('snpl');
  const [creditLines, setCreditLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCreditLines = async () => {
      try {
        const response = await api.credit.getCreditLines();
        if (response.success) {
          setCreditLines(response.data?.creditLines || response.data || []);
        }
      } catch (error) {
        console.error('Failed to load credit lines:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCreditLines();
  }, []);

  const snplLines = creditLines.filter((cl: any) => cl.type === 'snpl');
  const bnplLines = creditLines.filter((cl: any) => cl.type === 'bnpl');
  const activeSNPL = snplLines.find((cl: any) => cl.status === 'approved' || cl.status === 'active');
  const activeBNPL = bnplLines.find((cl: any) => cl.status === 'approved' || cl.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <button 
          onClick={() => navigateTo(homeDashboard)}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white text-[24px] font-bold mb-2">Payments</h2>
        <p className="text-white/80 text-[14px]">Manage your loans and credit</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('snpl')}
            className={`flex-1 py-4 text-[14px] font-medium transition-colors relative ${
              activeTab === 'snpl' ? 'text-[#3D8A75]' : 'text-gray-500'
            }`}
          >
            SNPL
            {activeTab === 'snpl' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D8A75]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bnpl')}
            className={`flex-1 py-4 text-[14px] font-medium transition-colors relative ${
              activeTab === 'bnpl' ? 'text-[#3D8A75]' : 'text-gray-500'
            }`}
          >
            BNPL
            {activeTab === 'bnpl' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D8A75]"
              />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'snpl' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : activeSNPL ? (
              <>
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-[#102542]">Stocknow Paylater</h3>
                    <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[12px]">
                      {activeSNPL.status === 'approved' ? 'Active' : activeSNPL.status}
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('snpl-details')}
                    className="w-full bg-gradient-to-r from-[#102542] to-[#3D8A75] text-white py-4 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    View Loan Details
                  </button>
                </div>

                {/* Quick Stats from real data */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-4">
                    <p className="text-[12px] text-gray-500 mb-1">Next Payment</p>
                    <p className="text-[20px] font-bold text-[#102542]">
                      PKR {(activeSNPL.nextPaymentAmount || 0).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {activeSNPL.nextPaymentDate 
                        ? `Due ${new Date(activeSNPL.nextPaymentDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}`
                        : '--'}
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-4">
                    <p className="text-[12px] text-gray-500 mb-1">Remaining</p>
                    <p className="text-[20px] font-bold text-[#102542]">
                      PKR {(activeSNPL.principalAmount - (activeSNPL.repayments?.reduce((s: number, r: any) => s + r.amount, 0) || 0)).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {activeSNPL.installments?.filter((i: any) => i.status === 'pending').length || 0} payments left
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-1">No active SNPL loans</p>
                <p className="text-gray-400 text-xs">Purchase stock from the marketplace to apply for SNPL</p>
                <button
                  onClick={() => navigateTo('marketplace')}
                  className="mt-3 px-4 py-2 bg-[#3D8A75] text-white rounded-xl text-sm hover:bg-[#2d6b5c] transition-colors"
                >
                  Go to Marketplace
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'bnpl' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-[#102542]">Buy Now, Pay Later</h3>
                <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[12px]">
                  Available
                </div>
              </div>
              <p className="text-[14px] text-gray-600 mb-6">
                Split your purchases into 4 interest-free installments.
              </p>
              <button
                onClick={() => navigateTo('bnpl-application')}
                className="w-full bg-[#3D8A75] text-white py-4 rounded-xl hover:bg-[#2d6b5c] transition-colors"
              >
                Apply for BNPL
              </button>
            </div>

            {/* Active BNPL loans */}
            {bnplLines.length > 0 && (
              <div>
                <h3 className="text-[16px] font-bold text-[#102542] mb-3">Active BNPL Loans</h3>
                {bnplLines.map((bl: any, index: number) => (
                  <div key={bl._id || index} className="glass rounded-2xl p-4 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[14px] font-bold text-[#102542]">PKR {(bl.principalAmount || 0).toLocaleString()}</p>
                      <span className={`text-[11px] px-2 py-1 rounded-full ${
                        bl.status === 'closed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {bl.status === 'closed' ? 'PAID' : 'ACTIVE'}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-500">
                      {bl.installments?.filter((i: any) => i.status === 'pending').length || 0} installments remaining
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 glass rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-[14px] text-[#102542]">No fees or interest</p>
              </div>
              <div className="flex items-center gap-3 p-4 glass rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-[14px] text-[#102542]">First payment in 30 days</p>
              </div>
              <div className="flex items-center gap-3 p-4 glass rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-[14px] text-[#102542]">Instant approval</p>
              </div>
            </div>
          </motion.div>
        )}
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
          <button className="flex flex-col items-center gap-1">
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
