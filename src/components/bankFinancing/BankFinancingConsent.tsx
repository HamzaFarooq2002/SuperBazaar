import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, FileText, ScrollText, UserCheck, Receipt, Building2 } from 'lucide-react';
import { AppContext } from '../../App';
import { BankBrandTile } from './bankBrands';
import { FacilitatorChip } from './FacilitatorChip';

const SHARED_DATA_ITEMS = [
  { icon: Receipt, label: 'Marketplace transaction history' },
  { icon: ScrollText, label: 'Order details and supplier verification' },
  { icon: FileText, label: 'KYC profile and CNIC information' },
  { icon: UserCheck, label: 'Credit score and risk tier' },
  { icon: Building2, label: 'Business name and address' }
];

export function BankFinancingConsent() {
  const { navigateTo } = useContext(AppContext);
  const [checked, setChecked] = useState(false);
  const draft = JSON.parse(sessionStorage.getItem('bankFinancingDraft') || '{}');
  const bank = draft?.selectedBank || '';
  const amount = Number(draft?.requestedAmount || 0);

  const handleContinue = () => {
    if (!checked) return;
    navigateTo('bank-financing-offer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] flex flex-col">
      {/* Sticky glass header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigateTo('bank-financing-select')}
            className="text-[#102542] flex items-center gap-1"
            aria-label="Back to bank selection"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-[#102542] text-lg font-medium">Data-sharing consent</p>
        </div>
        <FacilitatorChip bank={bank} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-32">
        {/* Bank + amount summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <BankBrandTile bank={bank} size={56} />
            <div className="flex-1">
              <p className="text-[11px] text-gray-500 mb-0.5">Lender</p>
              <p className="text-[#102542] font-semibold">{bank || 'Bank not selected'}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-end justify-between">
            <p className="text-[11px] text-gray-500">Requested amount</p>
            <p className="text-[#102542] text-[20px] font-bold tracking-[-0.24px]">PKR {amount.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Lender disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-[#3D8A75]/30 bg-[#3D8A75]/10 backdrop-blur-md p-4 mb-4"
        >
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3D8A75] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[#102542] font-semibold text-sm mb-1">SuperBazaar is not the lender</p>
              <p className="text-xs text-[#102542]/75 leading-relaxed">
                {bank || 'The selected bank'} reviews this application and decides the markup, tenure, and processing fee.
                SuperBazaar only facilitates by sharing the data you authorize below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* What we share */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4 shadow-sm"
        >
          <p className="text-[#102542] font-semibold text-sm mb-3">What we will share with {bank || 'the bank'}</p>
          <div className="space-y-2.5">
            {SHARED_DATA_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#3D8A75]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#3D8A75]" />
                </div>
                <p className="text-sm text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Full consent text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-5 mb-4 shadow-sm text-xs text-gray-700 leading-relaxed"
        >
          <p className="text-[#102542] font-semibold text-sm mb-2">Authorization</p>
          <p>
            I authorize SuperBazaar to share my marketplace transaction data, order details, credit score, KYC profile,
            business information, and supplier/order verification data with my selected bank for evaluating my Stock Now
            Pay Later financing application. I understand SuperBazaar is not the lender and the selected bank may
            independently approve, reject, or modify financing terms.
          </p>
        </motion.div>

        {/* Consent checkbox */}
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-4 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#3D8A75]"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            I give consent to share my data with {bank || 'the selected bank'} for this application.
          </span>
        </motion.label>

        {!checked && (
          <p className="text-xs text-gray-400 text-center mt-3">Tick the consent box to continue</p>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-4 flex gap-3">
        <button
          onClick={() => navigateTo('bank-financing-select')}
          className="flex-1 h-12 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!checked}
          className={`flex-1 h-12 rounded-xl font-medium transition-all ${
            checked
              ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] text-white hover:shadow-lg hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit application
        </button>
      </div>
    </div>
  );
}
