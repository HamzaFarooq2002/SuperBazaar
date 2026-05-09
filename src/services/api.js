import axios from 'axios';

// Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
const TokenService = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user'),
};

// Request interceptor - Add JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.data || error.message);
    }

    // Handle 401 Unauthorized - clear auth and notify app (uses in-app screen state, not routes)
    if (error.response?.status === 401) {
      TokenService.removeToken();
      TokenService.removeUser();
      window.dispatchEvent(new Event('auth-401'));
    }

    // Format error response
    const errorResponse = {
      success: false,
      error: {
        message: error.response?.data?.message || error.message || 'An unexpected error occurred',
        status: error.response?.status,
        data: error.response?.data,
      },
    };

    return Promise.reject(errorResponse);
  }
);

// Helper function to handle API responses
const handleResponse = (response) => {
  return {
    success: true,
    data: response.data.data || response.data,
    message: response.data.message,
  };
};

// Authentication API
const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise}
   */
  signup: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signup', userData);
      if (response.data.data?.token) {
        TokenService.setToken(response.data.data.token);
        TokenService.setUser(response.data.data.user);
      }
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise}
   */
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data.data?.token) {
        TokenService.setToken(response.data.data.token);
        TokenService.setUser(response.data.data.user);
      }
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user (clear local storage)
   */
  logout: () => {
    TokenService.removeToken();
    TokenService.removeUser();
  },

  /**
   * Get current user information
   * @returns {Promise}
   */
  getMe: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      if (response.data.data?.user) {
        TokenService.setUser(response.data.data.user);
      }
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit KYC data
   * @param {Object} kycData - KYC information
   * @returns {Promise}
   */
  submitKYC: async (kycData) => {
    try {
      const response = await axiosInstance.post('/auth/kyc', kycData);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify KYC for a user
   * @param {string} userId - User ID to verify
   * @returns {Promise}
   */
  verifyKYC: async (userId) => {
    try {
      const response = await axiosInstance.put(`/auth/kyc/verify/${userId}`);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Products API
const productsAPI = {
  /**
   * Get all products with optional filters
   * @param {Object} params - Query parameters (category, search, etc.)
   * @returns {Promise}
   */
  getProducts: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/products', { params });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single product by ID
   * @param {string} id - Product ID
   * @returns {Promise}
   */
  getProduct: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new product (Suppliers only)
   * @param {Object} productData - Product information
   * @returns {Promise}
   */
  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/products', productData);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update product (Owner only)
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product information
   * @returns {Promise}
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete product (Owner only)
   * @param {string} id - Product ID
   * @returns {Promise}
   */
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Orders API
const ordersAPI = {
  /**
   * Create a new order (Merchants only)
   * @param {Object} orderData - Order information
   * @returns {Promise}
   */
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all orders for current user
   * @returns {Promise}
   */
  getOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders');
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single order by ID
   * @param {string} id - Order ID
   * @returns {Promise}
   */
  getOrder: async (id) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update order status
   * @param {string} id - Order ID
   * @param {string} status - New status
   * @returns {Promise}
   */
  updateOrderStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/orders/${id}/status`, { status });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get orders received by the current supplier
   * @param {Object} params - Query parameters (status, page, limit)
   * @returns {Promise}
   */
  getSupplierOrders: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/orders/supplier', { params });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Credit API
const creditAPI = {
  /**
   * Get all credit lines for current user
   * @returns {Promise}
   */
  getCreditLines: async () => {
    try {
      const response = await axiosInstance.get('/credit');
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Calculate credit score for current user
   * @returns {Promise}
   */
  getCreditScore: async () => {
    try {
      const response = await axiosInstance.get('/credit/score');
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  generateCreditScore: async () => {
    try {
      const response = await axiosInstance.post('/credit/score', {});
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Apply for BNPL (Buy Now Pay Later)
   * @param {Object} payload - BNPL request payload
   * @returns {Promise}
   */
  applyBNPL: async (payload) => {
    try {
      const response = await axiosInstance.post('/credit/bnpl/apply', payload);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Apply for Nano Loan (Merchants only)
   * @param {Object} payload - Nano loan request payload
   * @returns {Promise}
   */
  applyNanoLoan: async (payload) => {
    try {
      const response = await axiosInstance.post('/credit/nano/apply', payload);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
  getNanoTiers: async () => {
    const response = await axiosInstance.get('/credit/nano/tiers');
    return handleResponse(response);
  },

  /**
   * Make payment on credit line
   * @param {string} creditLineId - Credit line ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise}
   */
  makePayment: async (creditLineId, paymentData) => {
    try {
      const response = await axiosInstance.post(`/credit/${creditLineId}/payment`, paymentData);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Dashboard API
const dashboardAPI = {
  /**
   * Get dashboard statistics
   * @returns {Promise}
   */
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get analytics data
   * @returns {Promise}
   */
  getAnalytics: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/dashboard/analytics', { params });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Stores API
const storesAPI = {
  /**
   * Get merchant's store
   * @returns {Promise}
   */
  getMyStore: async () => {
    try {
      const response = await axiosInstance.get('/stores/my-store');
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update merchant's store information
   * @param {Object} storeData - Store information
   * @returns {Promise}
   */
  updateMyStore: async (storeData) => {
    try {
      const response = await axiosInstance.put('/stores/my-store', storeData);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Users API
const usersAPI = {
  /**
   * Get transaction history for current user
   * @returns {Promise}
   */
  getTransactions: async () => {
    try {
      const response = await axiosInstance.get('/users/transactions');
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile information
   * @returns {Promise}
   */
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getWallet: async () => {
    try {
      const response = await axiosInstance.get('/users/wallet');
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getRewards: async () => {
    try {
      const response = await axiosInstance.get('/users/rewards');
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  setOpenBanking: async (settings = {}) => {
    try {
      const response = await axiosInstance.put('/users/open-banking', settings);
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

const notificationsAPI = {
  getNotifications: async (params = {}) => handleResponse(await axiosInstance.get('/notifications', { params })),
  getUnreadCount: async () => handleResponse(await axiosInstance.get('/notifications/unread-count')),
  markAsRead: async (id) => handleResponse(await axiosInstance.patch(`/notifications/${id}/read`)),
  markAllRead: async () => handleResponse(await axiosInstance.patch('/notifications/read-all'))
};


const bankFinancingAPI = {
  getEligibility: async (params = {}) => handleResponse(await axiosInstance.get('/bank-financing/eligibility', { params })),
  apply: async (payload) => handleResponse(await axiosInstance.post('/bank-financing/apply', payload)),
  accept: async (id, payload) => handleResponse(await axiosInstance.post(`/bank-financing/${id}/accept`, payload)),
  decline: async (id) => handleResponse(await axiosInstance.post(`/bank-financing/${id}/decline`)),
  list: async () => handleResponse(await axiosInstance.get('/bank-financing')),
  get: async (id) => handleResponse(await axiosInstance.get(`/bank-financing/${id}`))
};

const bnplAPI = {
  getEligibility: async (params = {}) => handleResponse(await axiosInstance.get('/bnpl/eligibility', { params })),
  initiate: async (payload) => handleResponse(await axiosInstance.post('/bnpl/initiate', payload)),
  getOrders: async () => handleResponse(await axiosInstance.get('/bnpl/orders')),
  repay: async (orderId, payload) => handleResponse(await axiosInstance.post(`/bnpl/repay/${orderId}`, payload))
};

// Export API service
const api = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  credit: creditAPI,
  dashboard: dashboardAPI,
  stores: storesAPI,
  users: usersAPI,
  notifications: notificationsAPI,
  bnpl: bnplAPI,
  bankFinancing: bankFinancingAPI,
  // Export token service for direct access if needed
  token: TokenService,
};

export default api;
