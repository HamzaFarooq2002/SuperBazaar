import React, { useContext, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import api from '../services/api';
import {
  ArrowLeft,
  ClipboardList,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

type OrderStatus = 'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_TABS: { label: string; value: OrderStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  confirmed: { color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2 },
  processing: { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Package },
  shipped: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Truck },
  delivered: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
  cancelled: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
};

interface OrderItem {
  product: any;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface SupplierOrder {
  _id: string;
  orderNumber: string;
  merchantName: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentStatus: string;
}

export function SupplierOrders() {
  const { navigateTo } = useContext(AppContext);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const homeDashboard = 'supplier-dashboard' as const;

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (activeTab !== 'all') params.status = activeTab;

      const res = await api.orders.getSupplierOrders(params);
      if (res.success) {
        const list = res.data?.orders ?? res.data ?? [];
        setOrders(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Failed to load supplier orders', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.orders.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const nextStatus = (current: string) => {
    const flow: Record<string, string> = {
      pending: 'confirmed',
      confirmed: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
    };
    return flow[current] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102542] to-[#3D8A75] px-6 pt-12 pb-4 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigateTo(homeDashboard)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Orders Received</h1>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.value
                  ? 'bg-white text-[#102542]'
                  : 'bg-white/20 text-white/80 hover:bg-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => {
              const cfg = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              const next = nextStatus(order.status);
              const isExpanded = expandedId === order._id;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Order header - clickable to expand */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order._id)}
                    className="w-full p-4 flex items-center gap-3 text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                      <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-[#102542] truncate">
                            {order.orderNumber}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {order.merchantName} &middot;{' '}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-[#3D8A75]">
                            PKR {order.totalAmount.toLocaleString()}
                          </span>
                          <ChevronRight
                            className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        </div>
                      </div>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-gray-100 px-4 pb-4"
                    >
                      <div className="pt-3 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.productName} &times; {item.quantity}
                            </span>
                            <span className="text-gray-800 font-medium">
                              PKR {item.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                        <span>Payment: {order.paymentStatus}</span>
                      </div>

                      {next && (
                        <button
                          onClick={() => updateStatus(order._id, next)}
                          disabled={updatingId === order._id}
                          className="mt-3 w-full py-2.5 rounded-xl bg-[#3D8A75] text-white text-sm font-medium hover:bg-[#346f61] transition-colors disabled:opacity-60"
                        >
                          {updatingId === order._id
                            ? 'Updating…'
                            : `Mark as ${next.charAt(0).toUpperCase() + next.slice(1)}`}
                        </button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
