import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Banknote, Shield, Lock, TrendingUp, CreditCard, CheckCircle } from 'lucide-react';

export function OpenBankingJourney() {
  const { navigateTo } = useContext(AppContext);
  const [shareBankData, setShareBankData] = useState(true);
  const [shareTransactions, setShareTransactions] = useState(true);
  const [shareCreditScore, setShareCreditScore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Connect your business bank',
      description: 'Link your account securely so we can verify cashflow and balances in real time.',
      icon: Banknote
    },
    {
      id: 2,
      title: 'Authorize data sharing',
      description: 'Choose what you share. We only use the data needed to recommend better financing.',
      icon: Lock
    },
    {
      id: 3,
      title: 'Analyze cashflow',
      description: 'We review receipts, invoices, and payment patterns to understand your business performance.',
      icon: TrendingUp
    },
    {
      id: 4,
      title: 'Unlock tailored credit',
      description: 'Receive custom BNPL and working capital offers based on your verified business profile.',
      icon: CreditCard
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#f4faf7] pb-24">
      <div className="bg-white px-6 pt-12 pb-4 border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-[#102542]">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-[18px] font-bold text-[#121417]">Open Banking Journey</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] bg-gradient-to-br from-[#102542] to-[#3D8A75] p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-3xl bg-white/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[13px] uppercase tracking-[0.24em] text-white/80 mb-2">Business Finance</p>
              <h2 className="text-[24px] font-bold">Power your business with Open Banking</h2>
              <p className="text-[14px] text-white/80 mt-3 leading-6">
                Connect your business bank, unlock smarter credit, and get BNPL offers tailored to your cashflow.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h2 className="text-[18px] font-bold text-[#121417]">How it works</h2>
          <div className="grid gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#3D8A75]/10 text-[#3D8A75] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#102542]">{`Step ${step.id}`}</p>
                      <h3 className="text-[16px] font-bold text-[#121417] mt-1">{step.title}</h3>
                      <p className="text-[14px] text-[#61758a] mt-2 leading-6">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <h2 className="text-[18px] font-bold text-[#121417] mb-4">Your Open Banking settings</h2>
          {[
            { label: 'Share bank data', value: shareBankData, setter: setShareBankData },
            { label: 'Share transaction history', value: shareTransactions, setter: setShareTransactions },
            { label: 'Share credit score', value: shareCreditScore, setter: setShareCreditScore }
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100">
              <div>
                <p className="text-[14px] font-medium text-[#121417]">{item.label}</p>
                <p className="text-[12px] text-[#61758a]">Opt in to improve your funding offers.</p>
              </div>
              <button
                onClick={() => item.setter(!item.value)}
                className={`relative w-[48px] h-[28px] rounded-full transition-colors ${item.value ? 'bg-[#3D8A75]' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white transition-transform ${item.value ? 'translate-x-[20px]' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-3xl bg-[#3D8A75]/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#3D8A75]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#121417]">Why businesses choose open banking</h3>
              <p className="text-[14px] text-[#61758a] mt-2 leading-6">
                Open Banking gives lenders the visibility they need to approve credit faster and with better terms for growing businesses.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowModal(true)}
          className="w-full h-[52px] rounded-[14px] bg-gradient-to-r from-[#102542] to-[#3D8A75] text-white text-[16px] font-semibold shadow-lg hover:opacity-95 transition-all"
        >
          Start the Open Banking Journey
        </motion.button>
      </div>

      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[rgba(0,0,0,0.35)] flex items-end justify-center px-4 pb-6">
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="w-full max-w-xl bg-white rounded-[24px] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-[18px] font-bold text-[#121417]">Authorize Open Banking</h2>
              <p className="text-[13px] text-[#61758a] mt-2">Grant secure access to your business bank for a faster credit journey.</p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <button
                onClick={() => { setShowModal(false); navigateTo('credit-score-generating'); }}
                className="w-full h-[48px] rounded-[14px] bg-[#3D8A75] text-white text-[15px] font-semibold hover:bg-[#2d6b5c] transition-all"
              >
                Authorize and Continue
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full h-[48px] rounded-[14px] border border-gray-200 text-[#102542] text-[15px] font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
