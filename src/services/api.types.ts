// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'merchant' | 'supplier' | 'customer';
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
  kycData?: KYCData;
  creditScore?: CreditScore;
  rewardPoints?: number;
  badges?: Badge[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface KYCData {
  cnic?: string;
  ntn?: string;
  bankIBAN?: string;
  fingerprintVerified?: boolean;
  documents?: KYCDocument[];
}

export interface KYCDocument {
  type: 'cnic_front' | 'cnic_back' | 'ntn_certificate' | 'bank_statement';
  url: string;
  uploadedAt: Date;
}

export interface CreditScore {
  score: number;
  lastCalculated: Date;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    accountAge: number;
    transactionVolume: number;
  };
}

export interface Badge {
  name: string;
  earnedAt: Date;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: 'merchant' | 'supplier' | 'customer';
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  mainImage: string;
  images?: string[];
  supplier: string;
  supplierName: string;
  rating: {
    average: number;
    count: number;
  };
  tags?: string[];
  specifications?: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  supplier?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  mainImage: string;
  images?: string[];
  tags?: string[];
  specifications?: Record<string, string>;
}

// ============================================================================
// Order Types
// ============================================================================

export interface Order {
  _id: string;
  orderNumber: string;
  merchant: string;
  merchantName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'snpl' | 'bnpl' | 'bank_transfer' | 'mobile_banking';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: Address;
  notes?: string;
  creditLine?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  supplier: string;
  supplierName: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderData {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: 'cash' | 'snpl' | 'bnpl' | 'bank_transfer' | 'mobile_banking';
  shippingAddress?: Address;
  notes?: string;
}

// ============================================================================
// Credit Types
// ============================================================================

export interface CreditLine {
  _id: string;
  user: string;
  userName: string;
  type: 'snpl' | 'bnpl';
  creditLimit: number;
  availableCredit: number;
  usedCredit: number;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  status: 'pending' | 'active' | 'closed' | 'rejected';
  installments: Installment[];
  approvedAt?: Date;
  closedAt?: Date;
  creditScoreAtApplication?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Installment {
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paidDate?: Date;
  paidAmount?: number;
}

export interface CreditScoreResult {
  score: number;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    accountAge: number;
    transactionVolume: number;
  };
  rating: string;
  eligibility: {
    snpl: boolean;
    bnpl: boolean;
    maxLimit: number;
  };
}

export interface SNPLApplication {
  requestedAmount: number;
}

export interface BNPLApplication {
  orderId: string;
  amount: number;
}

export interface PaymentData {
  amount: number;
  installmentNumber?: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_banking';
  transactionId?: string;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  creditUtilization: number;
  availableCredit: number;
  rewardPoints: number;
  recentTransactions: Transaction[];
  recentOrders: Order[];
}

export interface Analytics {
  revenue: {
    daily: ChartDataPoint[];
    monthly: ChartDataPoint[];
  };
  expenses: {
    daily: ChartDataPoint[];
    monthly: ChartDataPoint[];
  };
  orders: {
    byStatus: Record<string, number>;
    byMonth: ChartDataPoint[];
  };
  products: {
    topSelling: ProductStat[];
    lowStock: Product[];
  };
  credit: {
    utilization: number;
    history: ChartDataPoint[];
  };
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ProductStat {
  product: Product;
  totalSales: number;
  totalRevenue: number;
}

// ============================================================================
// Store Types
// ============================================================================

export interface Store {
  _id: string;
  owner: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  businessType: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  businessHours?: BusinessHours;
  socialMedia?: SocialMedia;
  isVerified: boolean;
  rating?: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

// ============================================================================
// Transaction Types
// ============================================================================

export interface Transaction {
  _id: string;
  transactionId: string;
  user: string;
  type: 'income' | 'expense' | 'loan_disbursement' | 'loan_repayment';
  category: 'sales_revenue' | 'stock_purchase' | 'inventory' | 'payment_received' | 'payment_made' | 'loan' | 'repayment' | 'other';
  amount: number;
  description: string;
  relatedOrder?: string;
  relatedCreditLine?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'mobile_banking' | 'credit' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  notes?: string;
  receiptUrl?: string;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
}

// ============================================================================
// API Service Types
// ============================================================================

export interface TokenService {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  getUser: () => User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export interface AuthAPI {
  signup: (userData: SignupData) => Promise<ApiResponse<LoginResponse>>;
  login: (email: string, password: string) => Promise<ApiResponse<LoginResponse>>;
  logout: () => void;
  getMe: () => Promise<ApiResponse<{ user: User }>>;
  submitKYC: (kycData: KYCData) => Promise<ApiResponse>;
  verifyKYC: (userId: string) => Promise<ApiResponse>;
}

export interface ProductsAPI {
  getProducts: (params?: ProductFilters) => Promise<ApiResponse<{ products: Product[] }>>;
  getProduct: (id: string) => Promise<ApiResponse<{ product: Product }>>;
  createProduct: (productData: CreateProductData) => Promise<ApiResponse<{ product: Product }>>;
  updateProduct: (id: string, productData: Partial<CreateProductData>) => Promise<ApiResponse<{ product: Product }>>;
  deleteProduct: (id: string) => Promise<ApiResponse>;
}

export interface OrdersAPI {
  createOrder: (orderData: CreateOrderData) => Promise<ApiResponse<{ order: Order }>>;
  getOrders: () => Promise<ApiResponse<{ orders: Order[] }>>;
  getOrder: (id: string) => Promise<ApiResponse<{ order: Order }>>;
  updateOrderStatus: (id: string, status: string) => Promise<ApiResponse<{ order: Order }>>;
}

export interface CreditAPI {
  getCreditLines: () => Promise<ApiResponse<{ creditLines: CreditLine[] }>>;
  getCreditScore: () => Promise<ApiResponse<CreditScoreResult>>;
  applySNPL: (requestedAmount: number) => Promise<ApiResponse<{ creditLine: CreditLine }>>;
  applyBNPL: (orderData: BNPLApplication) => Promise<ApiResponse<{ creditLine: CreditLine }>>;
  makePayment: (creditLineId: string, paymentData: PaymentData) => Promise<ApiResponse>;
}

export interface DashboardAPI {
  getDashboardStats: () => Promise<ApiResponse<DashboardStats>>;
  getAnalytics: () => Promise<ApiResponse<Analytics>>;
}

export interface StoresAPI {
  getMyStore: () => Promise<ApiResponse<{ store: Store }>>;
  updateMyStore: (storeData: Partial<Store>) => Promise<ApiResponse<{ store: Store }>>;
}

export interface UsersAPI {
  getTransactions: () => Promise<ApiResponse<{ transactions: Transaction[] }>>;
  updateProfile: (profileData: UpdateProfileData) => Promise<ApiResponse<{ user: User }>>;
}

export interface API {
  auth: AuthAPI;
  products: ProductsAPI;
  orders: OrdersAPI;
  credit: CreditAPI;
  dashboard: DashboardAPI;
  stores: StoresAPI;
  users: UsersAPI;
  token: TokenService;
}
