/**
 * MVP instant fulfillment: when checkout completes, mark order delivered immediately.
 * @param {import('mongoose').Document} order
 * @param {{ preservePaymentStatus?: boolean }} opts If true, do not change paymentStatus (e.g. BNPL with outstanding principal).
 */
function markOrderDeliveredOnCheckout(order, opts = {}) {
  order.status = 'delivered';
  order.deliveredAt = new Date();
  if (!opts.preservePaymentStatus && (!order.paymentStatus || order.paymentStatus === 'pending')) {
    order.paymentStatus = 'paid';
  }
}

module.exports = { markOrderDeliveredOnCheckout };
