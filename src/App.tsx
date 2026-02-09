import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { SplashScreen } from './components/SplashScreen';
import { OnboardIntro } from './components/OnboardIntro';
import { OnboardSignup } from './components/OnboardSignup';
import { OnboardUserType } from './components/OnboardUserType';
import { OnboardCNIC } from './components/OnboardCNIC';
import { OnboardOTP } from './components/OnboardOTP';
import { OnboardBiometric } from './components/OnboardBiometric';
import { OnboardDocuments } from './components/OnboardDocuments';
import { OnboardCongratulations } from './components/OnboardCongratulations';
import { OnboardComplete } from './components/OnboardComplete';
import { OnboardingOne } from './components/OnboardingOne';
import { OnboardingTwo } from './components/OnboardingTwo';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { TransactionsList } from './components/TransactionsList';
import { TransactionDetails } from './components/TransactionDetails';
import { Analytics } from './components/Analytics';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceDetails } from './components/InvoiceDetails';
import { Expenses } from './components/Expenses';
import { CreateInvoice } from './components/CreateInvoice';
import { Payments } from './components/Payments';
import { PaymentsMain } from './components/PaymentsMain';
import { SNPLDetails } from './components/SNPLDetails';
import { BNPLApplication } from './components/BNPLApplication';
import { BNPLApproved } from './components/BNPLApproved';
import { Marketplace } from './components/Marketplace';
import { OrderTracking } from './components/OrderTracking';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { DataPreferences } from './components/DataPreferences';
import { SuccessScreen } from './components/SuccessScreen';
import { CreditScoreInitiate } from './components/CreditScoreInitiate';
import { CreditScoreGenerating } from './components/CreditScoreGenerating';
import { CreditScoreResult } from './components/CreditScoreResult';
import { CreditScoreShare } from './components/CreditScoreShare';
import { ProductDetail } from './components/ProductDetail';
import { ShoppingCart } from './components/ShoppingCart';
import { Checkout } from './components/Checkout';
import { PaymentMethod } from './components/PaymentMethod';
import { OrderConfirmation } from './components/OrderConfirmation';
import { CustomerDashboard } from './components/CustomerDashboard';
import { CustomerMarketplace } from './components/CustomerMarketplace';
import { NanoLoan } from './components/NanoLoan';
import { Rewards } from './components/Rewards';

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
  | 'transactions'
  | 'transaction-details'
  | 'analytics'
  | 'invoices'
  | 'invoice-details'
  | 'expenses'
  | 'create-invoice'
  | 'payments'
  | 'payments-main'
  | 'snpl-details'
  | 'bnpl-application'
  | 'bnpl-approved'
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
  | 'rewards';

export interface AppContextType {
  navigateTo: (screen: Screen) => void;
  currentScreen: Screen;
  setSelectedTransaction?: (id: string) => void;
  selectedTransaction?: string;
  setSelectedInvoice?: (id: string) => void;
  selectedInvoice?: string;
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
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [userType, setUserType] = useState<'supplier' | 'business' | 'customer' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const contextValue: AppContextType = {
    navigateTo,
    currentScreen,
    setSelectedTransaction,
    selectedTransaction,
    setSelectedInvoice,
    selectedInvoice,
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
      case 'transactions':
        return <TransactionsList key="transactions" />;
      case 'transaction-details':
        return <TransactionDetails key="transaction-details" />;
      case 'analytics':
        return <Analytics key="analytics" />;
      case 'invoices':
        return <InvoiceList key="invoices" />;
      case 'invoice-details':
        return <InvoiceDetails key="invoice-details" />;
      case 'expenses':
        return <Expenses key="expenses" />;
      case 'create-invoice':
        return <CreateInvoice key="create-invoice" />;
      case 'payments':
        return <Payments key="payments" />;
      case 'payments-main':
        return <PaymentsMain key="payments-main" />;
      case 'snpl-details':
        return <SNPLDetails key="snpl-details" />;
      case 'bnpl-application':
        return <BNPLApplication key="bnpl-application" />;
      case 'bnpl-approved':
        return <BNPLApproved key="bnpl-approved" />;
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