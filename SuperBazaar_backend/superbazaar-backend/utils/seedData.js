const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Store = require('../models/Store');
const Order = require('../models/Order');
const CreditLine = require('../models/CreditLine');
const Transaction = require('../models/Transaction');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/superbazaar';

// Sample data
const sampleUsers = [
  {
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    phone: '+923001234567',
    password: 'password123',
    userType: 'merchant',
    businessName: 'Khan General Store',
    businessAddress: 'Karachi',
    kycStatus: 'verified',
    kycData: {
      cnic: '42101-1234567-8',
      ntn: 'NTN123456',
      bankIBAN: 'PK36HABB0000123456789012',
      fingerprintVerified: true
    }
  },
  {
    name: 'Metro Wholesale',
    email: 'metro@example.com',
    phone: '+923009876543',
    password: 'password123',
    userType: 'supplier',
    businessName: 'Metro Wholesale Ltd',
    businessAddress: 'Karachi',
    kycStatus: 'verified'
  },
  {
    name: 'Bismillah Traders',
    email: 'bismillah@example.com',
    phone: '+923007654321',
    password: 'password123',
    userType: 'supplier',
    businessName: 'Bismillah Trading Co',
    businessAddress: 'Lahore',
    kycStatus: 'verified'
  }
];

const sampleProducts = [
  {
    name: 'Rice - 50kg Bag',
    description: 'Premium quality Basmati rice',
    category: 'Groceries',
    price: 8500,
    unit: 'per bag',
    stockQuantity: 100,
    mainImage: 'https://images.unsplash.com/photo-1646980990815-1e97d5ee932f',
    rating: { average: 4.8, count: 124 }
  },
  {
    name: 'Cooking Oil - 5L (Pack of 4)',
    description: 'Pure vegetable cooking oil',
    category: 'Groceries',
    price: 3200,
    unit: 'per pack',
    stockQuantity: 150,
    mainImage: 'https://images.unsplash.com/photo-1757801333069-f7b3cabaec4a',
    rating: { average: 4.9, count: 89 }
  },
  {
    name: 'Tea - 1kg Pack',
    description: 'Premium black tea',
    category: 'Beverages',
    price: 1500,
    unit: 'per kg',
    stockQuantity: 200,
    mainImage: 'https://images.unsplash.com/photo-1597916375079-1201154a650c',
    rating: { average: 4.7, count: 156 }
  },
  {
    name: 'Soap Bars (Pack of 12)',
    description: 'Premium quality soap bars',
    category: 'Personal Care',
    price: 850,
    unit: 'per pack',
    stockQuantity: 300,
    mainImage: 'https://images.unsplash.com/photo-1700686696893-2565ac44642a',
    rating: { average: 4.6, count: 234 }
  },
  {
    name: 'Biscuits (Carton)',
    description: 'Assorted biscuits',
    category: 'Snacks',
    price: 2400,
    unit: 'per carton',
    stockQuantity: 80,
    mainImage: 'https://images.unsplash.com/photo-1611945008668-76b643f43454',
    rating: { average: 4.8, count: 98 }
  },
  {
    name: 'Detergent Powder - 6kg',
    description: 'Heavy duty detergent',
    category: 'Household',
    price: 1200,
    unit: 'per pack',
    stockQuantity: 120,
    mainImage: 'https://images.unsplash.com/photo-1637760978539-c87137d809b0',
    rating: { average: 4.9, count: 167 }
  },
  {
    name: 'Sugar - 50kg Bag',
    description: 'Pure white sugar',
    category: 'Groceries',
    price: 5500,
    unit: 'per bag',
    stockQuantity: 90,
    mainImage: 'https://images.unsplash.com/photo-1641679103706-fc8542e2a97a',
    rating: { average: 4.7, count: 145 }
  },
  {
    name: 'Soft Drinks (Crate of 24)',
    description: 'Assorted soft drinks',
    category: 'Beverages',
    price: 1800,
    unit: 'per crate',
    stockQuantity: 60,
    mainImage: 'https://images.unsplash.com/photo-1549850331-50a4032a375a',
    rating: { average: 4.6, count: 187 }
  },
  {
    name: 'Flour - 20kg Bag',
    description: 'Premium wheat flour',
    category: 'Groceries',
    price: 2200,
    unit: 'per bag',
    stockQuantity: 110,
    mainImage: 'https://images.unsplash.com/photo-1760727466909-a73872aeecda',
    rating: { average: 4.8, count: 203 }
  },
  {
    name: 'Chips (Box of 30)',
    description: 'Assorted chips flavors',
    category: 'Snacks',
    price: 1950,
    unit: 'per box',
    stockQuantity: 70,
    mainImage: 'https://images.unsplash.com/photo-1579384264577-79580c9d3a36',
    rating: { average: 4.7, count: 156 }
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Store.deleteMany({});
    await Order.deleteMany({});
    await CreditLine.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Create users
    console.log('👤 Creating users...');
    const createdUsers = await User.create(sampleUsers);
    const merchant = createdUsers[0];
    const suppliers = createdUsers.slice(1);
    console.log('✅ Created users:', createdUsers.map(u => u.email).join(', '));
    
    // Create store for merchant
    console.log('🏪 Creating store...');
    await Store.create({
      owner: merchant._id,
      name: merchant.businessName,
      address: {
        street: '123 Main Street',
        city: 'Karachi',
        postalCode: '75500',
        country: 'Pakistan'
      },
      phone: merchant.phone,
      email: merchant.email,
      businessType: 'general_store',
      isVerified: true
    });
    console.log('✅ Created store');
    
    // Create products with different suppliers
    console.log('📦 Creating products...');
    const createdProducts = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const supplier = suppliers[i % suppliers.length];
      const product = await Product.create({
        ...sampleProducts[i],
        supplier: supplier._id,
        supplierName: supplier.businessName
      });
      createdProducts.push(product);
    }
    console.log(`✅ Created ${createdProducts.length} products`);
    
    // Create SNPL credit line for merchant
    console.log('💳 Creating SNPL credit line...');
    const snpl = new CreditLine({
      user: merchant._id,
      userName: merchant.name,
      type: 'snpl',
      creditLimit: 500000,
      availableCredit: 350000,
      usedCredit: 150000,
      principalAmount: 150000,
      interestRate: 0.05,
      tenureMonths: 1,
      status: 'active',
      approvedAt: new Date(),
      creditScoreAtApplication: 720,
      riskLevel: 'low'
    });
    snpl.generateInstallments();
    
    // Mark some installments as paid
    snpl.installments[0].status = 'paid';
    snpl.installments[0].paidDate = new Date();
    snpl.installments[0].paidAmount = snpl.installments[0].amount;
    
    await snpl.save();
    console.log('✅ Created SNPL credit line');
    
    // Create sample transactions
    console.log('💰 Creating transactions...');
    const transactions = [
      {
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        user: merchant._id,
        type: 'expense',
        category: 'stock_purchase',
        amount: 45200,
        description: 'Stock Purchase - Metro Wholesale',
        paymentMethod: 'credit',
        status: 'completed',
        transactionDate: new Date()
      },
      {
        transactionId: `TXN-${Date.now() + 1}-${Math.floor(Math.random() * 10000)}`,
        user: merchant._id,
        type: 'income',
        category: 'sales_revenue',
        amount: 78500,
        description: 'Sales Revenue',
        paymentMethod: 'cash',
        status: 'completed',
        transactionDate: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        transactionId: `TXN-${Date.now() + 2}-${Math.floor(Math.random() * 10000)}`,
        user: merchant._id,
        type: 'expense',
        category: 'inventory',
        amount: 32800,
        description: 'Inventory - Bismillah Traders',
        paymentMethod: 'bank_transfer',
        status: 'completed',
        transactionDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        transactionId: `TXN-${Date.now() + 3}-${Math.floor(Math.random() * 10000)}`,
        user: merchant._id,
        type: 'income',
        category: 'payment_received',
        amount: 15900,
        description: 'Customer Payment',
        paymentMethod: 'mobile_banking',
        status: 'completed',
        transactionDate: new Date(Date.now() - 26 * 60 * 60 * 1000)
      }
    ];
    
    await Transaction.create(transactions);
    console.log(`✅ Created ${transactions.length} transactions`);
    
    // Update merchant's credit score
    merchant.creditScore = {
      score: 720,
      lastCalculated: new Date(),
      factors: {
        paymentHistory: 35,
        creditUtilization: 20,
        accountAge: 12,
        transactionVolume: 18
      }
    };
    await merchant.save();
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Merchant Account:');
    console.log('  Email: ahmed@example.com');
    console.log('  Password: password123');
    console.log('\nSupplier Account 1:');
    console.log('  Email: metro@example.com');
    console.log('  Password: password123');
    console.log('\nSupplier Account 2:');
    console.log('  Email: bismillah@example.com');
    console.log('  Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
