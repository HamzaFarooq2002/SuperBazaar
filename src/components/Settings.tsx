import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  Shield, 
  CreditCard,
  HelpCircle,
  FileText,
  Database
} from 'lucide-react';

export function Settings() {
  const { navigateTo } = useContext(AppContext);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: Lock, label: 'Change Password', action: () => setShowPasswordModal(true) },
        { icon: CreditCard, label: 'Payment Methods', action: () => navigateTo('payments') },
        { icon: Shield, label: 'Privacy & Security', action: () => setShowHelpModal(true) },
        { icon: Database, label: 'Data Preferences', action: () => navigateTo('data-preferences') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', toggle: true, value: notifications, onChange: setNotifications },
        { icon: Moon, label: 'Dark Mode', toggle: true, value: darkMode, onChange: setDarkMode },
        { icon: Shield, label: 'Biometric Login', toggle: true, value: biometric, onChange: setBiometric },
        { icon: Globe, label: 'Language', action: () => setShowLanguageModal(true) },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: () => setShowHelpModal(true) },
        { icon: FileText, label: 'Terms & Conditions', action: () => setShowHelpModal(true) },
        { icon: FileText, label: 'Privacy Policy', action: () => setShowHelpModal(true) },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-8">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="mb-6 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Settings</h2>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="glass rounded-3xl p-6 shadow-lg"
          >
            <h3 className="text-[#102542] mb-4">{section.title}</h3>
            
            <div className="space-y-3">
              {section.items.map((item, index) => (
                <div key={index}>
                  {item.toggle ? (
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#CDD7D6] flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-[#102542]" />
                        </div>
                        <span className="text-[#102542]">{item.label}</span>
                      </div>
                      <button
                        onClick={() => item.onChange?.(!item.value)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${
                          item.value ? 'bg-[#3D8A75]' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                            item.value ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={item.action}
                      className="w-full flex items-center justify-between py-3 hover:bg-white/50 rounded-xl px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#CDD7D6] flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-[#102542]" />
                        </div>
                        <span className="text-[#102542]">{item.label}</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  {index < section.items.length - 1 && (
                    <div className="border-b border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App Version */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500 py-4"
        >
          <p>SuperBazaar v1.0.0</p>
          <p className="text-xs mt-1">© 2025 All rights reserved</p>
        </motion.div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowPasswordModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-[20px] font-bold text-[#102542] mb-4">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 bg-[#3D8A75] text-white rounded-xl hover:bg-[#2d6b5c]"
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowLanguageModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-[20px] font-bold text-[#102542] mb-4">Select Language</h3>
            <div className="space-y-2">
              {['English', 'Urdu', 'اردو'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setShowLanguageModal(false)}
                  className="w-full px-4 py-3 text-left rounded-xl hover:bg-gray-100 text-[#102542]"
                >
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Help/Info Modal */}
      {showHelpModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowHelpModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-[20px] font-bold text-[#102542] mb-4">Coming Soon</h3>
            <p className="text-gray-600 mb-6">This feature will be available in the next update.</p>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full px-4 py-3 bg-[#3D8A75] text-white rounded-xl hover:bg-[#2d6b5c]"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}