import React, { createContext, useState, ReactNode } from 'react';

interface OrderContextType {
  currentOrder: any | null;
  setCurrentOrder: (order: any) => void;
  clearCurrentOrder: () => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);

  const clearCurrentOrder = () => setCurrentOrder(null);

  return (
    <OrderContext.Provider value={{ currentOrder, setCurrentOrder, clearCurrentOrder }}>
      {children}
    </OrderContext.Provider>
  );
}
