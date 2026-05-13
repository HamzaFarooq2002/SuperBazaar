import React, { useContext, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../../App';
import { usePaymentSession } from '../../../contexts/PaymentSessionContext';
import { useOrder } from '../../../hooks/useOrder';
import { useCart } from '../../../hooks/useCart';
import api from '../../../services/api';

export function PBBProcessing() {
  const { navigateTo } = useContext(AppContext);
  const { session, setSession } = usePaymentSession();
  const { setCurrentOrder } = useOrder();
  const { clearCart } = useCart();

  useEffect(() => {
    if (!session.sessionId) {
      navigateTo('pbb-bank-select');
      return;
    }
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2500));
    Promise.all([api.pbb.confirm(session.sessionId, { consent: true }), minDelay]).then(async ([res]: any) => {
      if (res.success && res.data?.status === 'SUCCESS') {
        const intent = session.intent || sessionStorage.getItem('pbbIntent');
        const repayFromApi = res.data?.repayment;
        const repayResult =
          intent === 'bank_financing_repay'
            ? repayFromApi || {
                amountPaid: session.amount,
                isPartial: false,
                remainderCreated: null,
                remainingDue: 0,
                applicationStatus: 'REPAYING',
                transactionId: res.data.transactionId
              }
            : null;
        if (repayResult) sessionStorage.setItem('repayResult', JSON.stringify(repayResult));
        if (res.data.orderId) sessionStorage.setItem('confirmedOrderId', res.data.orderId);

        if (intent !== 'bank_financing_repay' && res.data.orderId) {
          try {
            const orderRes = await api.orders.getOrder(String(res.data.orderId));
            if (orderRes.success && orderRes.data?.order) {
              setCurrentOrder(orderRes.data.order);
            }
          } catch {
            /* non-fatal */
          }
          clearCart();
        }

        setSession((prev) => ({
          ...prev,
          status: 'success',
          transactionId: res.data.transactionId,
          orderId: res.data.orderId
        }));
        navigateTo('pbb-success');
      } else {
        setSession((prev) => ({ ...prev, status: 'failed', failureReason: res.data?.failureReason || 'Payment failed' }));
        navigateTo('pbb-failure');
      }
    }).catch((err: any) => {
      const reason = err?.error?.data?.data?.failureReason || 'Transaction declined';
      setSession((prev) => ({ ...prev, status: 'failed', failureReason: reason }));
      navigateTo('pbb-failure');
    });
    // Intentionally run once on mount for this session (mirrors prior behavior).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dots = ['Processing', 'Connecting to bank', 'Authorizing payment', 'Finalizing'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102542] to-[#3D8A75] flex items-center justify-center px-6">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6" />
        <h2 className="text-white text-[22px] font-bold mb-2">Processing Payment</h2>
        <p className="text-white/70 text-sm mb-8">Please do not close this screen</p>
        <div className="space-y-2">
          {dots.map((d, i) => (
            <motion.div key={d} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.6 }} className="flex items-center gap-2 justify-center">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }} className="w-2 h-2 bg-white/60 rounded-full" />
              <span className="text-white/80 text-sm">{d}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
