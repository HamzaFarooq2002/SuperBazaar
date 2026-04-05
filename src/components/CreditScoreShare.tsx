import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import api from '../services/api';
import { ArrowLeft, Building2, User, CheckCircle2, Shield, Lock } from 'lucide-react';

export function CreditScoreShare() {
  const { navigateTo } = useContext(AppContext);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [shareType, setShareType] = useState<'full' | 'summary'>('summary');
  const [consentGiven, setConsentGiven] = useState(false);
  const [creditScore, setCreditScore] = useState<number>(0);

  useEffect(() => {
    const loadScore = async () => {
      try {
        const response = await api.credit.getCreditScore();
        if (response.success) {
          setCreditScore(response.data?.creditScore?.score || 0);
        }
      } catch (error) {
        console.error('Failed to load credit score:', error);
      }
    };
    loadScore();
  }, []);

  const potentialRecipients = [
    {
      id: 'supplier-1',
      name: 'Mehran Wholesale Co.',
      type: 'supplier',
      description: 'Your primary supplier',
      logo: '🏪'
    },
    {
      id: 'supplier-2',
      name: 'Karachi Trading House',
      type: 'supplier',
      description: 'Pending SNPL request',
      logo: '📦'
    },
    {
      id: 'bank-1',
      name: 'Bank Alfalah',
      type: 'lender',
      description: 'For loan application',
      logo: '🏦'
    },
    {
      id: 'partner-1',
      name: 'Business Partner - Ahmed Khan',
      type: 'partner',
      description: 'Investment opportunity',
      logo: '🤝'
    }
  ];

  const toggleRecipient = (id: string) => {
    setSelectedRecipients(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleShare = () => {
    if (selectedRecipients.length > 0 && consentGiven) {
      navigateTo('credit-score-result');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] overflow-hidden pb-24">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/30 backdrop-blur-sm border-b border-white/40 h-[60px] flex items-center px-6 z-10">
        <button onClick={() => navigateTo('credit-score-result')} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-[#102542]" />
        </button>
        <h1 className="text-[18px] text-[#102542]">Share Credit Score</h1>
      </div>

      {/* Content */}
      <div className="pt-[80px] px-6">
        {/* Info Banner with real score */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#3D8A75]/20 to-[#102542]/20 backdrop-blur-sm border border-[#3D8A75]/30 rounded-[16px] p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-[#3D8A75] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-[#102542] font-medium mb-1">
                Share with Confidence
              </p>
              <p className="text-[11px] text-[#102542] opacity-70 leading-relaxed">
                Your credit score ({creditScore > 0 ? creditScore : '...'}/850) can help you unlock better SNPL terms and loan rates. Choose who to share with below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Share Type Selection */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <p className="text-[14px] text-[#102542] font-medium mb-3">What to share?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShareType('summary')}
              className={`p-4 rounded-[12px] border transition-all ${
                shareType === 'summary'
                  ? 'bg-[#3D8A75]/20 border-[#3D8A75] ring-2 ring-[#3D8A75]/50'
                  : 'bg-white/50 backdrop-blur-md border-white/60 hover:bg-white/70'
              }`}
            >
              <div className="text-center">
                <p className="text-[13px] text-[#102542] font-medium mb-1">Summary</p>
                <p className="text-[10px] text-[#102542] opacity-70">Score & rating only</p>
              </div>
            </button>
            <button
              onClick={() => setShareType('full')}
              className={`p-4 rounded-[12px] border transition-all ${
                shareType === 'full'
                  ? 'bg-[#3D8A75]/20 border-[#3D8A75] ring-2 ring-[#3D8A75]/50'
                  : 'bg-white/50 backdrop-blur-md border-white/60 hover:bg-white/70'
              }`}
            >
              <div className="text-center">
                <p className="text-[13px] text-[#102542] font-medium mb-1">Full Report</p>
                <p className="text-[10px] text-[#102542] opacity-70">Detailed breakdown</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Recipients Selection */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
          <p className="text-[14px] text-[#102542] font-medium mb-3">Select Recipients</p>
          <div className="space-y-3">
            {potentialRecipients.map((recipient, index) => (
              <motion.button
                key={recipient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => toggleRecipient(recipient.id)}
                className={`w-full p-4 rounded-[12px] border transition-all ${
                  selectedRecipients.includes(recipient.id)
                    ? 'bg-[#3D8A75]/10 border-[#3D8A75] ring-2 ring-[#3D8A75]/50'
                    : 'bg-white/50 backdrop-blur-md border-white/60 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-[45px] h-[45px] rounded-full bg-gradient-to-br from-[#3D8A75] to-[#102542] flex items-center justify-center text-[20px]">
                      {recipient.logo}
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] text-[#102542] font-medium">{recipient.name}</p>
                      <p className="text-[11px] text-[#102542] opacity-60">{recipient.description}</p>
                    </div>
                  </div>
                  <div className={`w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedRecipients.includes(recipient.id)
                      ? 'border-[#3D8A75] bg-[#3D8A75]'
                      : 'border-[#102542]/30 bg-white'
                  }`}>
                    {selectedRecipients.includes(recipient.id) && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Consent Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-6">
          <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[12px] p-4">
            <div className="flex items-start gap-3 mb-3">
              <Lock className="w-5 h-5 text-[#3D8A75] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] text-[#102542] font-medium mb-2">Privacy & Consent</p>
                <p className="text-[11px] text-[#102542] opacity-70 leading-relaxed mb-3">
                  By sharing your credit score, you authorize selected recipients to view your {shareType === 'full' ? 'detailed credit report' : 'credit score summary'} for 30 days. You can revoke access anytime from Settings.
                </p>
              </div>
            </div>
            <button
              onClick={() => setConsentGiven(!consentGiven)}
              className="flex items-center gap-3 w-full"
            >
              <div className={`w-[24px] h-[24px] rounded-[6px] border-2 flex items-center justify-center transition-all ${
                consentGiven ? 'border-[#3D8A75] bg-[#3D8A75]' : 'border-[#102542]/30 bg-white'
              }`}>
                {consentGiven && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <p className="text-[12px] text-[#102542] text-left">
                I authorize sharing my credit score with selected recipients
              </p>
            </button>
          </div>
        </motion.div>

        {/* Share Summary */}
        {selectedRecipients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#3D8A75]/10 to-[#102542]/10 backdrop-blur-sm border border-[#3D8A75]/30 rounded-[12px] p-4 mb-6"
          >
            <p className="text-[12px] text-[#102542] opacity-70 mb-1">Sharing with:</p>
            <p className="text-[14px] text-[#102542] font-medium">
              {selectedRecipients.length} recipient{selectedRecipients.length > 1 ? 's' : ''} • {shareType === 'full' ? 'Full Report' : 'Summary Only'}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={handleShare}
            disabled={selectedRecipients.length === 0 || !consentGiven}
            className={`w-full h-[50px] rounded-[12px] text-white font-medium text-[16px] transition-all ${
              selectedRecipients.length > 0 && consentGiven
                ? 'bg-gradient-to-r from-[#3D8A75] to-[#2d6b5c] shadow-lg hover:shadow-xl hover:scale-[1.02]'
                : 'bg-white/30 backdrop-blur-sm text-[#102542]/40 cursor-not-allowed'
            }`}
          >
            {selectedRecipients.length === 0 
              ? 'Select Recipients to Continue'
              : !consentGiven
              ? 'Please Provide Consent'
              : `Share with ${selectedRecipients.length} Recipient${selectedRecipients.length > 1 ? 's' : ''}`
            }
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => navigateTo('credit-score-result')}
            className="w-full h-[50px] rounded-[12px] bg-white/50 backdrop-blur-md border border-white/60 text-[#102542] font-medium text-[16px] hover:bg-white/70 transition-all"
          >
            Cancel
          </motion.button>
        </div>

        {/* Info Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-6 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-[#3D8A75]" />
          <p className="text-[11px] text-[#102542] opacity-60">Bank-grade encryption • Revoke anytime</p>
        </motion.div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-[#102542]/40 bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}
