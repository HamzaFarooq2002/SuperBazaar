import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import type { User } from '../services/api.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if user is logged in
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = api.token.getToken();
      const savedUser = api.token.getUser();
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        
        // Verify token is still valid
        try {
          const response = await api.auth.getMe();
          if (response.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          // Token invalid, clear it
          api.auth.logout();
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Clear previous user's cart data before loading new session
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('auth-change'));

      const response = await api.auth.login(email, password);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setLoading(true);
    try {
      // Clear any leftover cart data for new account
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('auth-change'));

      const response = await api.auth.signup(userData);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    // Clear cart data so next user starts fresh
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('auth-change'));
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: !!token && !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}
