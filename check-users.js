/**
 * Check existing users and test login
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: './SuperBazaar_backend/superbazaar-backend/.env' });

const User = require('./SuperBazaar_backend/superbazaar-backend/models/User');

async function checkUsers() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/superbazaar';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({}).select('name email phone userType businessName').limit(10);
    
    console.log(`📊 Found ${users.length} users in database:\n`);
    console.log('═'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User Details:`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Type: ${user.userType}`);
      console.log(`   Business: ${user.businessName || 'N/A'}`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n💡 TO LOGIN, use any email above with password: "password123"');
    console.log('   (Most seed users have this default password)\n');
    console.log('💡 TO SIGNUP, use a NEW email like: newuser' + Date.now() + '@test.com\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
