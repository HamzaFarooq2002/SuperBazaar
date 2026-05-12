const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const CreditLine = require('../models/CreditLine');
const Transaction = require('../models/Transaction');
const { DELIVERY_FEE, TAX_RATE } = require('../config/pricing');
const { markOrderDeliveredOnCheckout } = require('../utils/markOrderDeliveredOnCheckout');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Merchants only)
const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, useCreditLine } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order items'
      });
    }

    if (paymentMethod === 'bnpl' && req.user.userType !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'BNPL can only be used by customers'
      });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

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

    const tax = subtotal * TAX_RATE;
    const shippingCost = DELIVERY_FEE;
    const totalAmount = subtotal + shippingCost;

    const orderPayload = {
      merchantName: req.user.businessName || req.user.name,
      items: orderItems,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      paymentMethod,
      shippingAddress
    };
    if (paymentMethod === 'bnpl') {
      orderPayload.customer = req.user.id;
      orderPayload.orderType = 'customer_bnpl';
    } else {
      orderPayload.merchant = req.user.id;
      orderPayload.orderType = 'merchant_purchase';
    }
    const order = new Order(orderPayload);

    if (paymentMethod === 'bnpl') {
      if (!useCreditLine) {
        return res.status(400).json({
          success: false,
          message: 'BNPL orders require an approved credit line'
        });
      }

      const updated = await CreditLine.findOneAndUpdate(
        {
          _id: useCreditLine,
          user: req.user.id,
          type: 'bnpl',
          status: { $in: ['approved', 'active'] },
          availableCredit: { $gte: totalAmount }
        },
        {
          $inc: { usedCredit: totalAmount, availableCredit: -totalAmount },
          $push: { orders: order._id }
        },
        { new: true }
      );
      if (!updated) return res.status(400).json({ success: false, message: 'INSUFFICIENT_CREDIT' });

      order.creditLine = useCreditLine;
      order.paymentStatus = 'paid';
    }

    markOrderDeliveredOnCheckout(order);

    await order.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } });
    }

    const revenueBySupplier = {};
    for (const item of orderItems) {
      const sid = item.supplier.toString();
      revenueBySupplier[sid] = (revenueBySupplier[sid] || 0) + item.totalPrice;
    }

    const txnPaymentMethod = paymentMethod || 'other';

    for (const [sellerId, sellerTotal] of Object.entries(revenueBySupplier)) {
      await Transaction.create({
        user: sellerId,
        type: 'income',
        category: 'sales_revenue',
        amount: Math.abs(sellerTotal),
        description: `Order #${order.orderNumber}`,
        relatedOrder: order._id,
        paymentMethod: txnPaymentMethod,
        status: 'completed'
      });
      await User.findByIdAndUpdate(sellerId, {
        $inc: { walletBalance: sellerTotal }
      });
    }

    await Transaction.create({
      user: req.user.id,
      type: 'expense',
      category: 'stock_purchase',
      amount: Math.abs(totalAmount),
      description: `Order #${order.orderNumber}`,
      relatedOrder: order._id,
      paymentMethod: txnPaymentMethod,
      status: 'completed'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {
      $or: [{ merchant: req.user.id }, { paymentMethod: 'bnpl', customer: req.user.id }]
    };
    
    if (status) {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('items.product', 'name mainImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name mainImage')
      .populate('items.supplier', 'name businessName phone');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check ownership
    const viewerId = String(req.user.id);
    const ownsOrder =
      order.merchant?.toString() === viewerId || order.customer?.toString() === viewerId;
    if (!ownsOrder) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify the user owns this order (either as merchant or supplier)
    const userId = req.user.id;
    const isOwner =
      order.merchant?.toString() === userId || order.customer?.toString() === userId;
    const isSupplier = order.items?.some(item => item.supplier?.toString() === userId);
    if (!isOwner && !isSupplier) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    order.status = status;
    if (status === 'cancelled' && order.creditLine && order.paymentStatus !== 'refunded') {
      const bnplUserId = order.customer || order.merchant;
      await CreditLine.findOneAndUpdate(
        { _id: order.creditLine, user: bnplUserId, type: 'bnpl' },
        { $inc: { usedCredit: -order.totalAmount, availableCredit: order.totalAmount } }
      );
      order.paymentStatus = 'refunded';
    }
    
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Get orders for a supplier (items belonging to this supplier)
// @route   GET /api/orders/supplier
// @access  Private (Suppliers only)
const getSupplierOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const matchStage = { 'items.supplier': req.user._id };
    if (status) matchStage.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(matchStage)
      .populate('items.product', 'name mainImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get supplier orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching supplier orders',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getSupplierOrders
};


