import React, { createContext, useState, ReactNode } from 'react';

export interface ShippingFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  area: string;
}

interface OrderContextType {
  currentOrder: any | null;
  setCurrentOrder: (order: any) => void;
  clearCurrentOrder: () => void;
  shippingFormData: ShippingFormData | null;
  setShippingFormData: (data: ShippingFormData | null) => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [shippingFormData, setShippingFormData] = useState<ShippingFormData | null>(null);

  const clearCurrentOrder = () => setCurrentOrder(null);

  return (
    <OrderContext.Provider value={{
      currentOrder,
      setCurrentOrder,
      clearCurrentOrder,
      shippingFormData,
      setShippingFormData
    }}>
      {children}
    </OrderContext.Provider>
  );
}
