/**
 * API Endpoint Test Script
 * 
 * This script tests all integrated backend endpoints
 * Run with: node test-api-endpoints.js
 * 
 * Prerequisites:
 * - Backend server running on http://localhost:5000
 * - MongoDB running with seeded data
 */

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';
let testOrderId = '';
let testProductId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logTest(name) {
  console.log('\n' + colors.cyan + '━'.repeat(60) + colors.reset);
  log(`Testing: ${name}`, 'blue');
  console.log(colors.cyan + '━'.repeat(60) + colors.reset);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, useAuth = false) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (useAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      error: error.message,
    };
  }
}

// Test functions
async function testHealthCheck() {
  logTest('Health Check');
  const result = await apiCall('GET', '/health');
  
  if (result.success) {
    logSuccess(`Health check passed - Status: ${result.status}`);
    console.log('   Response:', result.data);
    return true;
  } else {
    logError('Health check failed - Server might be offline');
    return false;
  }
}

async function testSignup() {
  logTest('User Signup');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testUser = {
    name: `Test User ${timestamp}`,
    email: `testuser${timestamp}${random}@test.com`,
    password: 'test123',
    phone: `+92300${timestamp.toString().slice(-7)}`,
    userType: 'merchant',
    businessName: `Test Store ${timestamp}`,
    businessAddress: 'Karachi, Pakistan',
  };

  const result = await apiCall('POST', '/auth/signup', testUser);
  
  if (result.success && result.data.success) {
    logSuccess('Signup successful');
    authToken = result.data.data.token;
    testUserId = result.data.data.user._id;
    console.log('   User ID:', testUserId);
    console.log('   Token:', authToken.substring(0, 20) + '...');
    return true;
  } else {
    logError('Signup failed');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testLogin() {
  logTest('User Login');
  
  // First create a user to login with
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const loginUser = {
    name: `Login User ${timestamp}`,
    email: `loginuser${timestamp}${random}@test.com`,
    password: 'test123',
    phone: `+92301${timestamp.toString().slice(-7)}`,
    userType: 'merchant',
    businessName: 'Login Store',
    businessAddress: 'Karachi',
  };

  // Signup first
  await apiCall('POST', '/auth/signup', loginUser);

  // Now login
  const result = await apiCall('POST', '/auth/login', {
    email: loginUser.email,
    password: loginUser.password,
  });

  if (result.success && result.data.success) {
    logSuccess('Login successful');
    console.log('   Token received:', result.data.data.token.substring(0, 20) + '...');
    return true;
  } else {
    logError('Login failed');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testGetMe() {
  logTest('Get Current User (Protected Route)');
  
  const result = await apiCall('GET', '/auth/me', null, true);
  
  if (result.success && result.data.success) {
    const user = result.data.data || result.data;
    logSuccess('Successfully retrieved user data');
    console.log('   User:', user.name || 'N/A');
    console.log('   Email:', user.email || 'N/A');
    return true;
  } else {
    logError('Failed to get user data');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testGetProducts() {
  logTest('Get Products');
  
  const result = await apiCall('GET', '/products');
  
  if (result.success && result.data.success) {
    const products = result.data.data.products || [];
    logSuccess(`Retrieved ${products.length} products`);
    if (products.length > 0) {
      testProductId = products[0]._id;
      console.log('   First product:', products[0].name);
      console.log('   Price:', products[0].price);
      console.log('   Product ID:', testProductId);
    } else {
      logWarning('No products found - run seed script');
    }
    return true;
  } else {
    logError('Failed to get products');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testFilterProducts() {
  logTest('Filter Products by Category');
  
  const result = await apiCall('GET', '/products?category=Groceries');
  
  if (result.success && result.data.success) {
    const products = result.data.data.products || [];
    logSuccess(`Retrieved ${products.length} grocery products`);
    return true;
  } else {
    logError('Failed to filter products');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testGetProductById() {
  logTest('Get Product by ID');
  
  if (!testProductId) {
    logWarning('No product ID available - skipping test');
    return false;
  }

  const result = await apiCall('GET', `/products/${testProductId}`);
  
  if (result.success && result.data.success) {
    const product = result.data.data || result.data;
    logSuccess('Retrieved product details');
    console.log('   Product:', product.name || 'N/A');
    console.log('   Supplier:', product.supplierName || 'N/A');
    return true;
  } else {
    logError('Failed to get product by ID');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testCreateOrder() {
  logTest('Create Order');
  
  if (!testProductId) {
    logWarning('No product ID available - skipping test');
    return false;
  }

  const orderData = {
    items: [
      {
        product: testProductId,
        quantity: 2,
        price: 8500,
      },
    ],
    paymentMethod: 'bnpl',
    shippingAddress: {
      street: 'Test Street, Test Area',
      city: 'Karachi',
      postalCode: '75500',
      country: 'Pakistan',
    },
  };

  const result = await apiCall('POST', '/orders', orderData, true);
  
  if (result.success && result.data.success) {
    logSuccess('Order created successfully');
    testOrderId = result.data.data.order._id;
    console.log('   Order Number:', result.data.data.order.orderNumber);
    console.log('   Order ID:', testOrderId);
    console.log('   Total Amount:', result.data.data.order.totalAmount);
    console.log('   Payment Method:', result.data.data.order.paymentMethod);
    return true;
  } else {
    logError('Failed to create order');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testGetOrders() {
  logTest('Get User Orders');
  
  const result = await apiCall('GET', '/orders', null, true);
  
  if (result.success && result.data.success) {
    const orders = result.data.data.orders || [];
    logSuccess(`Retrieved ${orders.length} orders`);
    if (orders.length > 0) {
      console.log('   Latest order:', orders[0].orderNumber);
      console.log('   Status:', orders[0].orderStatus);
    }
    return true;
  } else {
    logError('Failed to get orders');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testGetOrderById() {
  logTest('Get Order by ID');
  
  if (!testOrderId) {
    logWarning('No order ID available - skipping test');
    return false;
  }

  const result = await apiCall('GET', `/orders/${testOrderId}`, null, true);
  
  if (result.success && result.data.success) {
    logSuccess('Retrieved order details');
    console.log('   Order Number:', result.data.data.orderNumber);
    console.log('   Items:', result.data.data.items.length);
    console.log('   Total:', result.data.data.totalAmount);
    return true;
  } else {
    logError('Failed to get order by ID');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testGetDashboardStats() {
  logTest('Get Dashboard Statistics');
  
  const result = await apiCall('GET', '/dashboard/stats', null, true);
  
  if (result.success && result.data.success) {
    const stats = result.data.data || result.data;
    logSuccess('Retrieved dashboard stats');
    console.log('   Total Revenue:', stats.totalRevenue || 0);
    console.log('   Total Expenses:', stats.totalExpenses || 0);
    console.log('   Net Profit:', stats.netProfit || 0);
    console.log('   Recent Transactions:', stats.recentTransactions?.length || 0);
    return true;
  } else {
    logError('Failed to get dashboard stats');
    console.log('   Error:', result.data);
    return false;
  }
}

async function testUnauthorizedAccess() {
  logTest('Unauthorized Access (Should Fail)');
  
  const tempToken = authToken;
  authToken = 'invalid-token';
  
  const result = await apiCall('GET', '/auth/me', null, true);
  
  authToken = tempToken; // Restore token
  
  if (!result.success && result.status === 401) {
    logSuccess('Correctly blocked unauthorized access');
    return true;
  } else {
    logError('Security issue: Unauthorized access was allowed!');
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.clear();
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║          SuperBazaar MVP - API Integration Tests          ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  const tests = [
    { name: 'Health Check', fn: testHealthCheck, critical: true },
    { name: 'User Signup', fn: testSignup, critical: true },
    { name: 'User Login', fn: testLogin, critical: true },
    { name: 'Get Current User', fn: testGetMe, critical: true },
    { name: 'Get Products', fn: testGetProducts, critical: true },
    { name: 'Filter Products', fn: testFilterProducts, critical: false },
    { name: 'Get Product by ID', fn: testGetProductById, critical: false },
    { name: 'Create Order', fn: testCreateOrder, critical: true },
    { name: 'Get User Orders', fn: testGetOrders, critical: true },
    { name: 'Get Order by ID', fn: testGetOrderById, critical: false },
    { name: 'Dashboard Stats', fn: testGetDashboardStats, critical: true },
    { name: 'Unauthorized Access', fn: testUnauthorizedAccess, critical: true },
  ];

  const results = {
    total: tests.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    critical: 0,
    criticalPassed: 0,
  };

  for (const test of tests) {
    try {
      const passed = await test.fn();
      
      if (passed) {
        results.passed++;
        if (test.critical) results.criticalPassed++;
      } else {
        if (passed === false) {
          results.failed++;
        } else {
          results.skipped++;
        }
      }
      
      if (test.critical) {
        results.critical++;
      }

      // Wait 500ms between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      logError(`Test crashed: ${error.message}`);
      results.failed++;
    }
  }

  // Print summary
  console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
  log('TEST SUMMARY', 'cyan');
  console.log(colors.cyan + '═'.repeat(60) + colors.reset + '\n');

  log(`Total Tests: ${results.total}`, 'blue');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, 'red');
  if (results.skipped > 0) {
    log(`⚠️  Skipped: ${results.skipped}`, 'yellow');
  }
  
  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  log(`\nPass Rate: ${passRate}%`, passRate >= 80 ? 'green' : 'yellow');
  
  log(`\nCritical Tests: ${results.criticalPassed}/${results.critical} passed`, 
    results.criticalPassed === results.critical ? 'green' : 'red');

  console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset + '\n');

  if (results.criticalPassed === results.critical && results.failed === 0) {
    log('🎉 ALL TESTS PASSED! MVP is working correctly!', 'green');
  } else if (results.criticalPassed === results.critical) {
    log('⚠️  Critical tests passed, but some non-critical tests failed', 'yellow');
  } else {
    log('❌ CRITICAL TESTS FAILED! Please fix issues before proceeding', 'red');
  }

  console.log();
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('Error: fetch is not available. Please use Node.js 18 or higher.');
  console.error('Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
