import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';

// Auth feature screens
import {
  SplashScreen,
  OnboardIntro,
  OnboardSignup,
  OnboardUserType,
  OnboardCNIC,
  OnboardOTP,
  OnboardBiometric,
  OnboardDocuments,
  OnboardCongratulations,
  OnboardComplete,
  OnboardingOne,
  OnboardingTwo,
  SignUp,
  Login,
} from './features/auth/pages';

// Merchant feature screens
import {
  Dashboard,
  Marketplace,
  Analytics,
  Expenses,
  TransactionsList,
  TransactionDetails,
  MerchantProducts,
  OpenBankingJourney,
  OpenBankingConsent,
  OpenBankingProcessing,
  OpenBankingEnabled,
} from './features/merchant/pages';

// Supplier feature screens
import { SupplierDashboard, SupplierProducts, SupplierOrders } from './features/supplier/pages';

// Credit feature screens
import {
  CreditScoreInitiate,
  CreditScoreGenerating,
  CreditScoreResult,
  CreditScoreShare,
  Payments,
  PaymentsMain,
  BNPLApplication,
  BNPLApproved,
} from './features/credit/pages';
import { MerchantWallet } from './components/MerchantWallet';
import { BankFinancingSelection } from './components/bankFinancing/BankFinancingSelection';
import { BankFinancingConsent } from './components/bankFinancing/BankFinancingConsent';
import { BankFinancingOffer } from './components/bankFinancing/BankFinancingOffer';
import { BankFinancingDashboard } from './components/bankFinancing/BankFinancingDashboard';
import { BankFinancingRejected } from './components/bankFinancing/BankFinancingRejected';

// Profile feature screens
import {
  Profile,
  Settings,
  DataPreferences,
} from './features/profile/pages';

// Customer feature screens
import {
  CustomerDashboard,
  CustomerMarketplace,
  ProductDetail,
  ShoppingCart,
  Checkout,
  PaymentMethod,
  OrderConfirmation,
  OrderTracking,
  NanoLoan,
  Rewards,
  BNPLPlanSelection,
  BNPLFactSheet,
  PayLaterDashboard
} from './features/customer/pages';

// Common screens
import {
  SuccessScreen,
} from './features/common/pages';

export type Screen = 
  | 'splash' 
  | 'onboard-intro'
  | 'onboard-signup'
  | 'onboard-usertype'
  | 'onboard-cnic'
  | 'onboard-otp'
  | 'onboard-biometric'
  | 'onboard-documents'
  | 'onboard-congratulations'
  | 'onboard-complete'
  | 'onboarding1' 
  | 'onboarding2' 
  | 'signup' 
  | 'login' 
  | 'dashboard'
  | 'supplier-dashboard'
  | 'supplier-products'
  | 'supplier-orders'
  | 'transactions'
  | 'transaction-details'
  | 'analytics'
  | 'expenses'
  | 'payments'
  | 'payments-main'
  | 'bnpl-application'
  | 'bnpl-approved'
  | 'open-banking-journey'
  | 'open-banking-consent'
  | 'open-banking-processing'
  | 'open-banking-enabled'
  | 'marketplace'
  | 'product-detail'
  | 'shopping-cart'
  | 'checkout'
  | 'payment-method'
  | 'order-confirmation'
  | 'order-tracking'
  | 'profile'
  | 'settings'
  | 'data-preferences'
  | 'success'
  | 'credit-score-initiate'
  | 'credit-score-generating'
  | 'credit-score-result'
  | 'credit-score-share'
  | 'customer-dashboard'
  | 'customer-marketplace'
  | 'nano-loan'
  | 'rewards'
  | 'merchant-products'
  | 'merchant-wallet'
  | 'bnpl-plan-selection'
  | 'bnpl-fact-sheet'
  | 'paylater-dashboard'
  | 'bank-financing-select'
  | 'bank-financing-consent'
  | 'bank-financing-offer'
  | 'bank-financing-dashboard'
  | 'bank-financing-rejected';

export interface AppContextType {
  navigateTo: (screen: Screen) => void;
  currentScreen: Screen;
  setSelectedTransaction?: (id: string) => void;
  selectedTransaction?: string;
  userType?: 'supplier' | 'business' | 'customer' | null;
  setUserType?: (type: 'supplier' | 'business' | 'customer') => void;
  selectedProduct?: any;
  setSelectedProduct?: (product: any) => void;
}

export const AppContext = React.createContext<AppContextType>({
  navigateTo: () => {},
  currentScreen: 'splash',
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedTransaction, setSelectedTransaction] = useState<string>('');
  const [userType, setUserType] = useState<'supplier' | 'business' | 'customer' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  useEffect(() => {
    const handleAuth401 = () => navigateTo('login');
    window.addEventListener('auth-401', handleAuth401);
    // #region agent log
    fetch('http://127.0.0.1:7530/ingest/c73b5c80-38a1-4b6e-a636-db456719856f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5e8ce2'},body:JSON.stringify({sessionId:'5e8ce2',runId:'initial',hypothesisId:'H-RUNTIME-START',location:'src/App.tsx:165',message:'App mounted',data:{screen:currentScreen,href:window.location.href},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return () => window.removeEventListener('auth-401', handleAuth401);
  }, []);

  const contextValue: AppContextType = {
    navigateTo,
    currentScreen,
    setSelectedTransaction,
    selectedTransaction,
    userType,
    setUserType,
    selectedProduct,
    setSelectedProduct,
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen key="splash" />;
      case 'onboard-intro':
        return <OnboardIntro key="onboard-intro" />;
      case 'onboard-signup':
        return <OnboardSignup key="onboard-signup" />;
      case 'onboard-usertype':
        return <OnboardUserType key="onboard-usertype" />;
      case 'onboard-cnic':
        return <OnboardCNIC key="onboard-cnic" />;
      case 'onboard-otp':
        return <OnboardOTP key="onboard-otp" />;
      case 'onboard-biometric':
        return <OnboardBiometric key="onboard-biometric" />;
      case 'onboard-documents':
        return <OnboardDocuments key="onboard-documents" />;
      case 'onboard-congratulations':
        return <OnboardCongratulations key="onboard-congratulations" />;
      case 'onboard-complete':
        return <OnboardComplete key="onboard-complete" />;
      case 'onboarding1':
        return <OnboardingOne key="onboarding1" />;
      case 'onboarding2':
        return <OnboardingTwo key="onboarding2" />;
      case 'signup':
        return <SignUp key="signup" />;
      case 'login':
        return <Login key="login" />;
      case 'dashboard':
        return <Dashboard key="dashboard" />;
      case 'supplier-dashboard':
        return <SupplierDashboard key="supplier-dashboard" />;
      case 'supplier-products':
        return <SupplierProducts key="supplier-products" />;
      case 'supplier-orders':
        return <SupplierOrders key="supplier-orders" />;
      case 'transactions':
        return <TransactionsList key="transactions" />;
      case 'transaction-details':
        return <TransactionDetails key="transaction-details" />;
      case 'analytics':
        return <Analytics key="analytics" />;
      case 'expenses':
        return <Expenses key="expenses" />;
      case 'payments':
        return <Payments key="payments" />;
      case 'payments-main':
        return <PaymentsMain key="payments-main" />;
      case 'bnpl-application':
        return <BNPLApplication key="bnpl-application" />;
      case 'bnpl-approved':
        return <BNPLApproved key="bnpl-approved" />;
      case 'open-banking-journey':
        return <OpenBankingJourney key="open-banking-journey" />;
      case 'open-banking-consent':
        return <OpenBankingConsent key="open-banking-consent" />;
      case 'open-banking-processing':
        return <OpenBankingProcessing key="open-banking-processing" />;
      case 'open-banking-enabled':
        return <OpenBankingEnabled key="open-banking-enabled" />;
      case 'marketplace':
        return <Marketplace key="marketplace" />;
      case 'product-detail':
        return <ProductDetail key="product-detail" />;
      case 'shopping-cart':
        return <ShoppingCart key="shopping-cart" />;
      case 'checkout':
        return <Checkout key="checkout" />;
      case 'payment-method':
        return <PaymentMethod key="payment-method" />;
      case 'order-confirmation':
        return <OrderConfirmation key="order-confirmation" />;
      case 'order-tracking':
        return <OrderTracking key="order-tracking" />;
      case 'profile':
        return <Profile key="profile" />;
      case 'settings':
        return <Settings key="settings" />;
      case 'data-preferences':
        return <DataPreferences key="data-preferences" />;
      case 'success':
        return <SuccessScreen key="success" />;
      case 'credit-score-initiate':
        return <CreditScoreInitiate key="credit-score-initiate" />;
      case 'credit-score-generating':
        return <CreditScoreGenerating key="credit-score-generating" />;
      case 'credit-score-result':
        return <CreditScoreResult key="credit-score-result" />;
      case 'credit-score-share':
        return <CreditScoreShare key="credit-score-share" />;
      case 'customer-dashboard':
        return <CustomerDashboard key="customer-dashboard" />;
      case 'customer-marketplace':
        return <CustomerMarketplace key="customer-marketplace" />;
      case 'nano-loan':
        return <NanoLoan key="nano-loan" />;
      case 'rewards':
        return <Rewards key="rewards" />;
      case 'merchant-products':
        return <MerchantProducts key="merchant-products" />;
      case 'merchant-wallet':
        return <MerchantWallet key="merchant-wallet" />;
      case 'bnpl-plan-selection':
        return <BNPLPlanSelection key="bnpl-plan-selection" />;
      case 'bnpl-fact-sheet':
        return <BNPLFactSheet key="bnpl-fact-sheet" />;
      case 'paylater-dashboard':
        return <PayLaterDashboard key="paylater-dashboard" />;
      case 'bank-financing-select':
        return <BankFinancingSelection key="bank-financing-select" />;
      case 'bank-financing-consent':
        return <BankFinancingConsent key="bank-financing-consent" />;
      case 'bank-financing-offer':
        return <BankFinancingOffer key="bank-financing-offer" />;
      case 'bank-financing-dashboard':
        return <BankFinancingDashboard key="bank-financing-dashboard" />;
      case 'bank-financing-rejected':
        return <BankFinancingRejected key="bank-financing-rejected" />;
      default:
        return <SplashScreen key="splash" />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <AppContext.Provider value={contextValue}>
            <div className="min-h-screen bg-gray-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </div>
        </AppContext.Provider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}