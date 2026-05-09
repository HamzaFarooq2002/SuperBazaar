import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, Home, Receipt, Wallet, User, Inbox, ChevronRight } from 'lucide-react';
import { BankBrandTile } from './bankFinancing/bankBrands';

const bankStatusLabel = (status: string) => ({
  OFFER_PENDING: 'Awaiting your acceptance',
  OFFER_ACCEPTED: 'Accepted, awaiting bank disbursement',
  DISBURSED: 'Bank disbursed',
  REPAYING: 'Repayment active',
  CLOSED: 'Closed',
  REJECTED: 'Rejected by bank policy',
  OFFER_DECLINED: 'Offer declined',
  OFFER_EXPIRED: 'Offer expired'
}[status] || status || 'Unknown');

export function PaymentsMain() {
  const { navigateTo } = useContext(AppContext);
  const { user: authUser } = useAuth();
  const homeDashboard =
    authUser?.userType === 'customer'
      ? 'customer-dashboard'
      : authUser?.userType === 'supplier'
      ? 'supplier-dashboard'
      : 'dashboard';

  const [creditLines, setCreditLines] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bank_financing' | 'bnpl' | 'nano'>(
    authUser?.userType === 'customer' ? 'bnpl' : 'bank_financing'
  );

  const isMerchant = authUser?.userType === 'merchant';
  const isCustomer = authUser?.userType === 'customer';

  useEffect(() => {
    const load = async () => {
      try {
        const [creditRes, appRes] = await Promise.all([
          api.credit.getCreditLines(),
          isMerchant ? api.bankFinancing.list() : Promise.resolve({ success: true, data: { applications: [] } })
        ]);
        if (creditRes.success) setCreditLines(creditRes.data?.creditLines || creditRes.data || []);
        if ((appRes as any).success) setApplications((appRes as any).data?.applications || []);
      } catch {
        setCreditLines([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isMerchant]);

  const nanoLines = creditLines.filter((cl: any) => cl.type === 'nano');
  const bnplLines = creditLines.filter((cl: any) => cl.type === 'bnpl');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <button onClick={() => navigateTo(homeDashboard)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white text-[24px] font-bold mb-2">Payments</h2>
        <p className="text-white/80 text-[14px]">Manage financing and repayments</p>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {(isMerchant
            ? [
                { id: 'bank_financing' as const, label: 'Bank Financing' },
                { id: 'nano' as const, label: 'Nano Loan' }
              ]
            : isCustomer
            ? [{ id: 'bnpl' as const, label: 'BNPL' }]
            : []
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-[14px] font-medium transition-colors relative ${activeTab === tab.id ? 'text-[#3D8A75]' : 'text-gray-500'}`}
            >
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D8A75]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : isMerchant && activeTab === 'bank_financing' ? (
          <div className="space-y-3">
            <button
              onClick={() => navigateTo('bank-financing-dashboard')}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white text-sm font-medium flex items-center justify-between px-4 hover:shadow-lg hover:scale-[1.01] transition-all"
            >
              <span>Open Bank Financing Dashboard</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            {applications.length > 0 ? applications.map((app: any) => (
              <button
                key={app._id}
                onClick={() => navigateTo('bank-financing-dashboard')}
                className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <BankBrandTile bank={app.selectedBank} size={44} />
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-[#102542]">{app.selectedBank}</p>
                  <p className="text-[11px] text-gray-500">{bankStatusLabel(app.applicationStatus)}</p>
                  <p className="text-[12px] text-[#102542] mt-1">
                    PKR {Number(app.approvedAmount || 0).toLocaleString()}
                    {Number(app.totalRepayable) > 0 && (
                      <span className="text-gray-500"> · Total repayable PKR {Number(app.totalRepayable).toLocaleString()}</span>
                    )}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            )) : (
              <div className="text-center py-8 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl">
                <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-700 text-sm font-medium mb-1">No bank financing yet</p>
                <p className="text-gray-500 text-xs mb-3">Apply during checkout to finance your stock purchase via bank.</p>
                <button
                  onClick={() => navigateTo('marketplace')}
                  className="px-4 h-10 rounded-xl bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white text-sm font-medium hover:shadow-lg transition-all"
                >
                  Go to Marketplace
                </button>
              </div>
            )}
          </div>
        ) : isMerchant && activeTab === 'nano' ? (
          <div className="space-y-4">
            {nanoLines.length > 0 ? nanoLines.map((line: any) => (
              <div key={line._id} className="glass rounded-2xl p-4">
                <p className="text-[14px] font-bold text-[#102542]">PKR {(line.principalAmount || 0).toLocaleString()}</p>
                <p className="text-[12px] text-gray-500">{line.status}</p>
              </div>
            )) : <p className="text-sm text-gray-500">No active nano loans</p>}
            <button onClick={() => navigateTo('nano-loan')} className="w-full py-3 rounded-xl bg-[#102542] text-white text-sm">Check Nano Loan Tiers</button>
          </div>
        ) : isCustomer && activeTab === 'bnpl' ? (
          <div className="space-y-4">
            <button onClick={() => navigateTo('paylater-dashboard')} className="w-full py-3 rounded-xl bg-[#102542] text-white text-sm">Open Pay Later Dashboard</button>
            {bnplLines.length === 0 && <p className="text-sm text-gray-500">No active BNPL loans</p>}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No credit products for this account type</p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => navigateTo(homeDashboard)} className="flex flex-col items-center gap-1"><Home className="w-6 h-6 text-gray-400" /><span className="text-[11px] text-gray-400">Home</span></button>
          <button onClick={() => navigateTo('order-tracking')} className="flex flex-col items-center gap-1"><Receipt className="w-6 h-6 text-gray-400" /><span className="text-[11px] text-gray-400">Orders</span></button>
          <button className="flex flex-col items-center gap-1"><Wallet className="w-6 h-6 text-[#3D8A75]" /><span className="text-[11px] text-[#3D8A75]">Payments</span></button>
          <button onClick={() => navigateTo('profile')} className="flex flex-col items-center gap-1"><User className="w-6 h-6 text-gray-400" /><span className="text-[11px] text-gray-400">Profile</span></button>
        </div>
      </div>
    </div>
  );
}
