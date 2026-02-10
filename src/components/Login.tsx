import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ShoppingCart } from 'lucide-react';

export function Login() {
  const { navigateTo } = useContext(AppContext);
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigateTo('dashboard'); // Success!
    } catch (err: any) {
      setError(err?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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

          <h2 className="text-[#102542] mb-1 text-center">Welcome to Super Bazaar</h2>
          <p className="text-[#3D8A75] text-center mb-1">Smart Retail Starts Here</p>
          <p className="text-gray-600 mb-8 text-center">Login to access Stocknow Paylater</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div className="flex justify-end">
              <button type="button" className="text-[#3D8A75]">
                Forgot password?
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#3D8A75] text-white transition-all hover:bg-[#2d6a5c] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigateTo('onboard-signup')}
              className="text-[#3D8A75]"
            >
              Sign Up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}