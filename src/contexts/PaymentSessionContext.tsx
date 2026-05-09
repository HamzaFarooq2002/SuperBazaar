import React, { createContext, useContext, useState } from 'react';

interface PaymentSession {
  sessionId: string | null;
  pbbId: string | null;
  selectedBank: string | null;
  selectedBankName: string | null;
  intent: 'order' | 'bank_financing_repay' | null;
  orderDraft: any;
  amount: number;
  status: 'idle' | 'initiated' | 'authed' | 'processing' | 'success' | 'failed';
  transactionId: string | null;
  orderId: string | null;
  failureReason: string | null;
}

const defaultSession: PaymentSession = {
  sessionId: null, pbbId: null, selectedBank: null, selectedBankName: null,
  intent: null, orderDraft: null, amount: 0,
  status: 'idle', transactionId: null, orderId: null, failureReason: null
};

interface PaymentSessionContextType {
  session: PaymentSession;
  setSession: React.Dispatch<React.SetStateAction<PaymentSession>>;
  resetSession: () => void;
}

export const PaymentSessionContext = createContext<PaymentSessionContextType>({
  session: defaultSession,
  setSession: () => {},
  resetSession: () => {}
});

export function PaymentSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PaymentSession>(defaultSession);
  const resetSession = () => setSession(defaultSession);
  return (
    <PaymentSessionContext.Provider value={{ session, setSession, resetSession }}>
      {children}
    </PaymentSessionContext.Provider>
  );
}

export const usePaymentSession = () => useContext(PaymentSessionContext);
