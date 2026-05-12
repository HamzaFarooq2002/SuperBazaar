const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const Product = require('../models/Product');
const CreditLine = require('../models/CreditLine');

const aggregateTransactions = (transactions = []) => {
  let income = 0;
  let expenses = 0;
  const dailyData = {};
  const categoryBreakdown = {};

  transactions.forEach((txn) => {
    const amount = Math.abs(txn.amount || 0);
    const dateKey = (txn.transactionDate || txn.createdAt).toISOString().split('T')[0];

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { income: 0, expenses: 0 };
    }

    if (txn.type === 'income') {
      income += amount;
      dailyData[dateKey].income += amount;
    }

    if (txn.type === 'expense' && txn.status === 'completed') {
      expenses += amount;
      dailyData[dateKey].expenses += amount;
      const category = txn.category || 'other';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + amount;
    }
  });

  return { income, expenses, dailyData, categoryBreakdown };
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;
    
    // Calculate date ranges
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    let stats = {};
    
    if (userType === 'merchant') {
      // Get transactions
      const currentMonthTransactions = await Transaction.find({
        user: userId,
        status: 'completed',
        transactionDate: { $gte: firstDayOfMonth }
      });
      
      const lastMonthTransactions = await Transaction.find({
        user: userId,
        status: 'completed',
        transactionDate: { $gte: lastMonth, $lte: lastMonthEnd }
      });
      
      const currentAgg = aggregateTransactions(currentMonthTransactions);
      const lastAgg = aggregateTransactions(lastMonthTransactions);
      const currentRevenue = currentAgg.income;
      const currentExpenses = currentAgg.expenses;
      const lastRevenue = lastAgg.income;
      const lastExpenses = lastAgg.expenses;
      
      // Calculate changes
      const revenueChange = lastRevenue > 0 
        ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1)
        : 0;
      
      const expenseChange = lastExpenses > 0
        ? ((currentExpenses - lastExpenses) / lastExpenses * 100).toFixed(1)
        : 0;
      
      // Get credit info
      const creditLines = await CreditLine.find({
        user: userId,
        status: { $in: ['active', 'approved'] }
      });
      
      const totalCreditLimit = creditLines.reduce((sum, cl) => sum + cl.creditLimit, 0);
      const availableCredit = creditLines.reduce((sum, cl) => sum + cl.availableCredit, 0);
      const usedCredit = creditLines.reduce((sum, cl) => sum + cl.usedCredit, 0);
      
      // Next payment info
      const nextPayment = creditLines
        .filter(cl => cl.nextPaymentDate)
        .sort((a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate))[0];
      
      // Recent orders
      const recentOrders = await Order.find({
        $or: [{ merchant: userId }, { 'items.supplier': userId }]
      })
        .populate('items.product', 'name mainImage')
        .sort({ createdAt: -1 })
        .limit(5);
      
      // Recent transactions
      const recentTransactions = await Transaction.find({ user: userId })
        .sort({ transactionDate: -1 })
        .limit(10);
      
      const currentProfit = Math.max(0, currentRevenue - currentExpenses);
      const lastProfit = Math.max(0, lastRevenue - lastExpenses);
      const profitChange = lastProfit !== 0
        ? ((currentProfit - lastProfit) / Math.abs(lastProfit) * 100).toFixed(1)
        : 0;

      stats = {
        revenue: {
          current: currentRevenue,
          change: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`,
          positive: revenueChange >= 0
        },
        expenses: {
          current: currentExpenses,
          change: `${expenseChange > 0 ? '+' : ''}${expenseChange}%`,
          positive: expenseChange < 0 // Lower expenses are good
        },
        netProfit: {
          current: currentProfit,
          change: `${profitChange > 0 ? '+' : ''}${profitChange}%`,
          positive: profitChange >= 0
        },
        credit: {
          totalLimit: totalCreditLimit,
          available: availableCredit,
          used: usedCredit,
          nextPaymentDate: nextPayment?.nextPaymentDate,
          nextPaymentAmount: nextPayment?.nextPaymentAmount
        },
        recentOrders,
        recentTransactions
      };
      
    } else if (userType === 'supplier') {
      // Supplier stats
      const products = await Product.find({ supplier: userId });
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.isActive).length;
      const lowStockProducts = products.filter(p => p.stockQuantity < p.minOrderQuantity).length;
      
      // Orders received (orders containing supplier's products)
      const ordersReceived = await Order.find({
        'items.supplier': userId,
        createdAt: { $gte: firstDayOfMonth }
      });
      
      const totalSales = ordersReceived.reduce((sum, order) => {
        const supplierItems = order.items.filter(item => 
          item.supplier.toString() === userId
        );
        return sum + supplierItems.reduce((itemSum, item) => itemSum + item.totalPrice, 0);
      }, 0);
      
      stats = {
        totalProducts,
        activeProducts,
        lowStockProducts,
        ordersReceived: ordersReceived.length,
        totalSales,
        recentOrders: ordersReceived.slice(0, 5)
      };
    }
    
    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/dashboard/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const { period = '30days' } = req.query;
    
    let daysBack = 30;
    if (period === '7days') daysBack = 7;
    else if (period === '90days') daysBack = 90;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    
    const transactions = await Transaction.find({
      user: req.user.id,
      status: 'completed',
      transactionDate: { $gte: startDate }
    }).sort({ transactionDate: 1 });

    const aggregated = aggregateTransactions(transactions);

    // Format for charts
    const chartData = Object.entries(aggregated.dailyData).map(([date, data]) => ({
      date,
      income: data.income,
      expenses: data.expenses,
      profit: data.income - data.expenses
    }));

    res.status(200).json({
      success: true,
      data: {
        chartData,
        categoryBreakdown: aggregated.categoryBreakdown,
        totals: {
          income: aggregated.income,
          expenses: aggregated.expenses,
          profit: aggregated.income - aggregated.expenses
        },
        period
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getAnalytics
};
