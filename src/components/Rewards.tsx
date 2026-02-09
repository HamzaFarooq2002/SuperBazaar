import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { ArrowLeft, Gift, Star, TrendingUp, ShoppingBag, Zap, Award } from 'lucide-react';

export function Rewards() {
  const { navigateTo } = useContext(AppContext);

  const rewardStats = {
    totalPoints: 1250,
    cashbackEarned: 2340,
    redeemedValue: 850,
    tier: 'Gold'
  };

  const rewardHistory = [
    {
      id: '1',
      type: 'Cashback',
      amount: 450,
      date: 'Nov 24, 2024',
      description: 'Order #SB-2401',
      icon: Gift,
      color: 'green'
    },
    {
      id: '2',
      type: 'Points',
      amount: 150,
      date: 'Nov 22, 2024',
      description: 'Purchase reward',
      icon: Star,
      color: 'yellow'
    },
    {
      id: '3',
      type: 'Bonus',
      amount: 200,
      date: 'Nov 20, 2024',
      description: 'First nano loan',
      icon: Zap,
      color: 'purple'
    }
  ];

  const redeemOptions = [
    {
      id: '1',
      title: 'PKR 500 Voucher',
      points: 500,
      description: 'Use on your next purchase',
      image: '💰'
    },
    {
      id: '2',
      title: 'Free Delivery',
      points: 200,
      description: 'Valid for 30 days',
      image: '🚚'
    },
    {
      id: '3',
      title: 'PKR 1000 Voucher',
      points: 1000,
      description: 'Premium reward',
      image: '🎁'
    },
    {
      id: '4',
      title: '10% Discount',
      points: 300,
      description: 'On selected items',
      image: '🏷️'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f2] to-[#d4e8e4] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-700 px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigateTo('customer-dashboard')}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-6" />
        </div>
        <h2 className="text-white mb-2">Rewards & Cashback</h2>
        <p className="text-white/80 text-sm">Earn rewards on every purchase</p>
      </div>

      <div className="px-6 mt-6">
        {/* Points Balance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#102542] to-[#3D8A75] rounded-2xl p-6 mb-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Available Points</p>
              <p className="text-white text-[32px]">{rewardStats.totalPoints}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 inline-block">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm">{rewardStats.tier} Member</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600 text-xs mb-1">Cashback Earned</p>
            <p className="text-[#102542]">PKR {rewardStats.cashbackEarned.toLocaleString()}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-600 text-xs mb-1">Redeemed Value</p>
            <p className="text-[#102542]">PKR {rewardStats.redeemedValue.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Redeem Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-[#102542] mb-4">Redeem Your Points</p>
          <div className="grid grid-cols-2 gap-4">
            {redeemOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 cursor-pointer hover:bg-white/70 transition-all ${
                  rewardStats.totalPoints >= option.points ? '' : 'opacity-50'
                }`}
              >
                <div className="text-4xl mb-3 text-center">{option.image}</div>
                <p className="text-[#102542] text-sm mb-2 text-center">{option.title}</p>
                <p className="text-gray-500 text-xs mb-3 text-center">{option.description}</p>
                <div className="bg-[#3D8A75]/10 rounded-lg py-2 text-center">
                  <p className="text-[#3D8A75] text-xs">
                    {option.points} points
                  </p>
                </div>
                {rewardStats.totalPoints >= option.points && (
                  <button 
                    onClick={() => navigateTo('success')}
                    className="w-full mt-3 py-2 bg-[#3D8A75] text-white text-xs rounded-lg hover:bg-[#2d6b5c] transition-colors"
                  >
                    Redeem
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reward History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <p className="text-[#102542] mb-4">Recent Rewards</p>
          <div className="space-y-3">
            {rewardHistory.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      reward.color === 'green' ? 'bg-green-100' :
                      reward.color === 'yellow' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      <reward.icon className={`w-6 h-6 ${
                        reward.color === 'green' ? 'text-green-600' :
                        reward.color === 'yellow' ? 'text-yellow-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-[#102542] mb-1">{reward.type}</p>
                      <p className="text-gray-500 text-xs">{reward.description}</p>
                      <p className="text-gray-400 text-xs">{reward.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">+{reward.amount}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Earn More */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-5 text-white"
        >
          <p className="text-white text-sm mb-1">💡 Earn More Points</p>
          <p className="text-white text-[18px] mb-2">Shop & Earn</p>
          <p className="text-white/90 text-sm mb-4">Get 1 point for every PKR 100 spent</p>
          <button 
            onClick={() => navigateTo('customer-marketplace')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Start Shopping
          </button>
        </motion.div>
      </div>
    </div>
  );
}
