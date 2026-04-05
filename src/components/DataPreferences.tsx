import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft } from 'lucide-react';

export function DataPreferences() {
  const { navigateTo } = useContext(AppContext);
  const [shareBankData, setShareBankData] = useState(false);
  const [shareTransactionHistory, setShareTransactionHistory] = useState(false);
  const [shareCreditScore, setShareCreditScore] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const dataOptions = [
    {
      id: 'bank',
      title: 'Share Bank Data',
      description: 'Allows access to account balances and transaction details.',
      value: shareBankData,
      onChange: setShareBankData
    },
    {
      id: 'transactions',
      title: 'Share Transaction History',
      description: 'Provides a detailed history of all transactions.',
      value: shareTransactionHistory,
      onChange: setShareTransactionHistory
    },
    {
      id: 'credit',
      title: 'Share Credit Score',
      description: 'Enables access to creditworthiness assessment.',
      value: shareCreditScore,
      onChange: setShareCreditScore
    }
  ];

  const handleSavePreferences = () => {
    setShowAuthModal(true);
  };

  const handleAuthorize = () => {
    setShowAuthModal(false);
    navigateTo('open-banking-journey');
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-2 border-b border-gray-100">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigateTo('settings')}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-[#121417]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#121417]">Consent Management</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        <h2 className="text-[22px] font-bold text-[#121417] mb-6">Data Sharing Preferences</h2>

        {/* Data Options */}
        <div className="space-y-4">
          {dataOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white min-h-[72px] py-2 px-4 flex items-center justify-between"
            >
              <div className="flex-1 pr-4">
                <h3 className="text-[16px] font-medium text-[#121417] mb-1">
                  {option.title}
                </h3>
                <p className="text-[14px] text-[#61758a] leading-[21px]">
                  {option.description}
                </p>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => option.onChange(!option.value)}
                className={`relative w-[51px] h-[31px] rounded-[15.5px] transition-colors ${
                  option.value ? 'bg-[#3D8A75]' : 'bg-[#f0f2f5]'
                }`}
              >
                <div
                  className={`absolute top-[2px] w-[27px] h-[27px] rounded-[13.5px] bg-white shadow-[0px_3px_8px_0px_rgba(0,0,0,0.15)] transition-transform ${
                    option.value ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 px-4"
        >
          <button
            onClick={handleSavePreferences}
            className="w-full h-[48px] bg-[#3D8A75] hover:bg-[#2d6b5c] text-white text-[16px] font-bold rounded-[8px] transition-colors"
          >
            Save Preferences
          </button>
        </motion.div>
      </div>

      {/* Authorization Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[rgba(20,20,20,0.4)] flex items-end"
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-white w-full rounded-t-[20px] pb-5"
          >
            {/* Handle Bar */}
            <div className="h-[20px] flex items-center justify-center pt-3">
              <div className="w-[36px] h-[4px] rounded-[2px] bg-[#dbe0e5]" />
            </div>

            {/* Content */}
            <div className="px-4 pt-5">
              <h2 className="text-[22px] font-bold text-[#121417] text-center mb-2">
                Authorize via Open Banking
              </h2>
              <p className="text-[16px] text-[#121417] text-center mb-6 px-4">
                To proceed, please authorize through our secure Open Banking partner.
              </p>

              {/* Authorize Button */}
              <button
                onClick={handleAuthorize}
                className="w-full h-[48px] bg-[#3D8A75] hover:bg-[#2d6b5c] text-white text-[16px] font-bold rounded-[8px] transition-colors"
              >
                Authorize
              </button>

              {/* Cancel */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full mt-3 text-[14px] text-[#61758a] hover:text-[#121417] transition-colors"
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
