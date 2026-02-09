import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { Mail, Lock, User, Building, ShoppingCart } from 'lucide-react';

export function SignUp() {
  const { navigateTo } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102542] to-[#3D8A75] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-28 bg-gradient-to-br from-[#3D8A75] to-[#102542] rounded-2xl flex items-center justify-center shadow-lg">
              <div className="relative">
                <ShoppingCart className="w-16 h-16 text-[#90EE90]" strokeWidth={2.5} />
                
                {/* Credit card standing vertically inside cart */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2">
                  <div className="relative w-6 h-9 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded shadow-md border border-white/30">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-sm"></div>
                    <div className="absolute bottom-1.5 left-1 right-1 space-y-0.5">
                      <div className="h-px bg-white/40 rounded"></div>
                      <div className="h-px bg-white/40 rounded w-3/4"></div>
                      <div className="h-px bg-white/40 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-[#102542] mb-1 text-center">Join Super Bazaar</h2>
          <p className="text-[#3D8A75] text-center mb-1">Smart Retail Starts Here</p>
          <p className="text-gray-600 mb-8 text-center">Get instant access to Stocknow Paylater credit</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Business Name</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.business}
                  onChange={(e) => setFormData({...formData, business: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                  placeholder="Khan General Store"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3D8A75]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#3D8A75] text-white transition-all hover:bg-[#2d6a5c] mt-6"
            >
              Sign Up
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="text-[#3D8A75]"
            >
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}