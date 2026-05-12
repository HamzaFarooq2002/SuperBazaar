const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const { DELIVERY_FEE, TAX_RATE } = require('../config/pricing');

/**
 * Create an order from a draft payload. Used by PBB confirm flow.
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.userType
 * @param {string} params.userName
 * @param {Object} params.orderDraft - { items: [{productId, quantity}], shippingAddress, totalAmount }
 * @param {string} params.paymentMethod - e.g. 'pbb'
 */
async function createOrderFromDraft({ userId, userType, userName, orderDraft, paymentMethod }) {
  const { items, shippingAddress } = orderDraft;
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw Object.assign(new Error(`Product not found: ${item.productId}`), { code: 'PRODUCT_NOT_FOUND' });
    if (product.stockQuantity < item.quantity) throw Object.assign(new Error(`Insufficient stock for ${product.name}`), { code: 'INSUFFICIENT_STOCK' });

    const itemTotal = product.price * item.quantity;
    orderItems.push({
      product: product._id,
      productName: product.name,
      supplier: product.supplier,
      supplierName: product.supplierName,
      quantity: item.quantity,
      pricePerUnit: product.price,
      totalPrice: itemTotal
    });
    subtotal += itemTotal;
  }

  const tax = subtotal * (TAX_RATE || 0);
  const shippingCost = DELIVERY_FEE || 0;
  const totalAmount = subtotal + shippingCost;

  const orderPayload = {
    merchantName: userName,
    items: orderItems,
    subtotal,
    tax,
    shippingCost,
    totalAmount,
    paymentMethod,
    shippingAddress,
    paymentStatus: 'paid',
    status: 'delivered',
    deliveredAt: new Date()
  };
  if (paymentMethod === 'bnpl' || userType === 'customer') {
    orderPayload.customer = userId;
    orderPayload.orderType = 'customer_bnpl';
  } else {
    orderPayload.merchant = userId;
    orderPayload.orderType = 'merchant_purchase';
  }

  const order = await Order.create(orderPayload);

  // Decrement stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } });
  }

  // Create transactions
  const revenueBySupplier = {};
  for (const item of orderItems) {
    const sid = item.supplier.toString();
    revenueBySupplier[sid] = (revenueBySupplier[sid] || 0) + item.totalPrice;
  }
  for (const [sellerId, sellerTotal] of Object.entries(revenueBySupplier)) {
    await Transaction.create({
      user: sellerId,
      type: 'income',
      category: 'sales_revenue',
      amount: Math.abs(sellerTotal),
      description: `Order #${order.orderNumber}`,
      relatedOrder: order._id,
      paymentMethod,
      status: 'completed'
    });
    await User.findByIdAndUpdate(sellerId, {
      $inc: { walletBalance: sellerTotal }
    });
  }
  await Transaction.create({
    user: userId,
    type: 'expense',
    category: 'stock_purchase',
    amount: Math.abs(totalAmount),
    description: `Order #${order.orderNumber}`,
    relatedOrder: order._id,
    paymentMethod,
    status: 'completed'
  });

  return order;
}

module.exports = { createOrderFromDraft };
