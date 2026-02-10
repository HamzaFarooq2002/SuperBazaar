import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import api from '../services/api';
import { ArrowLeft, Check, Home, Receipt, Wallet, User, Inbox } from 'lucide-react';

export function SNPLDetails() {
  const { navigateTo } = useContext(AppContext);
  const [autoRepayment, setAutoRepayment] = React.useState(false);
  const [creditLine, setCreditLine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSNPLDetails = async () => {
      try {
        const response = await api.credit.getCreditLines();
        if (response.success) {
          const lines = response.data?.creditLines || response.data || [];
          const snpl = lines.find((cl: any) => cl.type === 'snpl' && (cl.status === 'approved' || cl.status === 'active'));
          setCreditLine(snpl || null);
        }
      } catch (error) {
        console.error('Failed to load SNPL details:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSNPLDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#3D8A75] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (!creditLine) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
          <button onClick={() => navigateTo('payments-main')} className="mb-6 flex items-center gap-2">
            <ArrowLeft className="w-6 h-6 text-[#102542]" />
          </button>
          <h2 className="text-[#102542] text-[18px] font-bold text-center">Loan Details</h2>
        </div>
        <div className="px-6 py-16 text-center">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">No active SNPL loan</p>
          <p className="text-gray-400 text-sm mb-4">Purchase stock from the marketplace to apply for SNPL</p>
          <button onClick={() => navigateTo('marketplace')} className="px-6 py-3 bg-[#3D8A75] text-white rounded-xl">
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const installments = creditLine.installments || [];
  const totalAmount = creditLine.principalAmount || 0;
  const paidAmount = installments.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + i.amount, 0);
  const remainingBalance = totalAmount - paidAmount;
  const nextInstallment = installments.find((i: any) => i.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <button 
          onClick={() => navigateTo('payments-main')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6 text-[#102542]" />
        </button>
        <h2 className="text-[#102542] text-[18px] font-bold text-center">Loan Details</h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Loan Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-[22px] font-bold text-[#102542]">Loan Summary</h3>
          
          {/* Remaining Balance */}
          <div className="glass rounded-2xl p-6 bg-gray-50">
            <p className="text-[14px] text-[#102542] mb-2">Remaining Balance</p>
            <p className="text-[28px] font-bold text-[#102542]">PKR {remainingBalance.toLocaleString()}</p>
          </div>

          {/* Next Payment & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 border border-gray-200">
              <p className="text-[14px] text-[#102542] mb-2">Next Payment</p>
              <p className="text-[24px] font-bold text-[#102542]">
                PKR {(nextInstallment?.amount || 0).toLocaleString()}
              </p>
            </div>
            <div className="glass rounded-2xl p-4 border border-gray-200">
              <p className="text-[14px] text-[#102542] mb-2">Due Date</p>
              <p className="text-[20px] font-bold text-[#102542]">
                {nextInstallment?.dueDate 
                  ? new Date(nextInstallment.dueDate).toLocaleDateString('en-PK', { month: 'long', day: 'numeric', year: 'numeric' })
                  : '--'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Payment Schedule */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-[18px] font-bold text-[#102542] mb-4">Payment Schedule</h3>
          <div className="space-y-4">
            {installments.map((installment: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1">
                  {installment.status === 'paid' ? (
                    <div className="w-6 h-6 rounded-full bg-[#3D8A75] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1 pb-6 border-l-2 border-gray-200 pl-4 -ml-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[16px] font-bold text-[#102542]">
                      Installment {index + 1}
                    </p>
                    <p className="text-[14px] font-bold text-[#102542]">
                      PKR {(installment.amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <p className={`text-[14px] ${installment.status === 'paid' ? 'text-[#3D8A75]' : 'text-gray-500'}`}>
                    {installment.status === 'paid' 
                      ? 'Paid' 
                      : installment.dueDate 
                        ? `Due ${new Date(installment.dueDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}`
                        : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Automatic Repayments */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <h3 className="text-[18px] font-bold text-[#102542] mb-4">Automatic Repayments</h3>
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#102542]">Enable Automatic Repayments</p>
            <button
              onClick={() => setAutoRepayment(!autoRepayment)}
              className={`w-14 h-8 rounded-full transition-colors relative ${autoRepayment ? 'bg-[#3D8A75]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${autoRepayment ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => navigateTo('dashboard')} className="flex flex-col items-center gap-1">
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
