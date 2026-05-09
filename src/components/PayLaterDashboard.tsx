import React, { useContext, useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const paymentMethods = ['Raast', 'Debit Card', 'Bank Transfer', 'Easypaisa/JazzCash', 'SuperBazaar Wallet'];

export function PayLaterDashboard() {
  const { navigateTo } = useContext(AppContext);
  const { user: authUser } = useAuth();
  const homeDashboard =
    authUser?.userType === 'customer'
      ? 'customer-dashboard'
      : authUser?.userType === 'supplier'
        ? 'supplier-dashboard'
        : 'dashboard';

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedMethodByOrder, setSelectedMethodByOrder] = useState<Record<string, string>>({});

  const loadOrders = async () => {
    const response = await api.bnpl.getOrders();
    if (response.success) setOrders(response.data?.orders || []);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const repay = async (orderId: string, amount: number) => {
    await api.bnpl.repay(orderId, { amount, paymentMethod: 'bank_transfer' });
    await loadOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-12 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigateTo(homeDashboard)}
          className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 bg-white text-[#102542] shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Go to home"
        >
          <Home className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-[#102542]">Pay Later Dashboard</h2>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-[#102542]">{order.orderNumber}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{order.computedStatus}</span>
            </div>
            <p className="text-xs text-gray-600">Principal: PKR {Math.round(order.bnplDetails?.principal || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-600">Markup: PKR {Math.round(order.bnplDetails?.markupAmount || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-600">Total payable: PKR {Math.round(order.bnplDetails?.totalPayable || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-600">Remaining: PKR {Math.round(order.bnplDetails?.outstandingPrincipal || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-600">Late fee: PKR {Math.round(order.bnplDetails?.lateFee || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-600">Due date: {order.bnplDetails?.dueDate ? new Date(order.bnplDetails.dueDate).toLocaleDateString('en-PK') : '-'}</p>
            <div className="mt-3 flex gap-2">
              <select
                value={selectedMethodByOrder[order._id] || paymentMethods[0]}
                onChange={(e) => setSelectedMethodByOrder((prev) => ({ ...prev, [order._id]: e.target.value }))}
                className="flex-1 h-9 border rounded-lg px-2 text-sm"
              >
                {paymentMethods.map((method) => <option key={method}>{method}</option>)}
              </select>
              <button onClick={() => repay(order._id, Math.max(1, Number(order.bnplDetails?.outstandingPrincipal || 0)))} className="h-9 px-4 bg-[#3D8A75] text-white rounded-lg text-sm">
                Pay Now
              </button>
            </div>
            <div className="mt-2 flex gap-2">
              <button className="text-xs text-[#3D8A75] underline">Download repayment schedule</button>
              <button className="text-xs text-[#3D8A75] underline">Help / Complaint</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
