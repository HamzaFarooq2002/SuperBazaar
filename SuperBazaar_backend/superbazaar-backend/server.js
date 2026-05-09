const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');
const cron = require('node-cron');

// Load environment variables from this package directory (works regardless of cwd)
dotenv.config({ path: path.join(__dirname, '.env') });

// Force IPv4 for MongoDB Atlas (fixes DNS issues on some networks)
dns.setDefaultResultOrder('ipv4first');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const creditRoutes = require('./routes/creditRoutes');
const storeRoutes = require('./routes/storeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bnplRoutes = require('./routes/bnplRoutes');
const bankFinancingRoutes = require('./routes/bankFinancingRoutes');
const { runOverdueJob } = require('./jobs/overdueJob');
const { runReminderJob } = require('./jobs/reminderJob');
const creditConfig = require('./config/creditConfig');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Request logging middleware (for development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bnpl', bnplRoutes);
app.use('/api/bank-financing', bankFinancingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SuperBazaar API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err?.type === 'entity.too.large' || err?.status === 413) {
    return res.status(413).json({
      success: false,
      message: 'Uploaded file is too large. Please use a smaller image.'
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/superbazaar';

mongoose.connect(MONGODB_URI, {
  family: 4,
  serverSelectionTimeoutMS: 15000,
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      cron.schedule('0 0 * * *', () => runOverdueJob().catch((err) => console.error('overdueJob error', err)), { timezone: creditConfig.TIMEZONE });
      cron.schedule('0 9 * * *', () => runReminderJob().catch((err) => console.error('reminderJob error', err)), { timezone: creditConfig.TIMEZONE });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

