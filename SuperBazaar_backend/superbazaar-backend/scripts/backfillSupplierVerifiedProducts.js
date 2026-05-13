/**
 * One-shot: set isSupplierVerified on all products whose owner (supplier) has kycStatus === 'verified'.
 * Run from superbazaar-backend: node scripts/backfillSupplierVerifiedProducts.js
 */
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/superbazaar';

async function main() {
  await mongoose.connect(MONGODB_URI, { family: 4, serverSelectionTimeoutMS: 15000 });
  const owners = await User.find({
    userType: { $in: ['supplier', 'merchant'] },
    kycStatus: 'verified'
  }).select('_id');
  const ids = owners.map((u) => u._id);
  if (ids.length === 0) {
    console.log('No verified supplier/merchant users found.');
    await mongoose.disconnect();
    return;
  }
  const res = await Product.updateMany(
    { supplier: { $in: ids }, isSupplierVerified: { $ne: true } },
    { $set: { isSupplierVerified: true, supplierVerifiedAt: new Date() } }
  );
  console.log('Updated products:', res.modifiedCount, 'matched:', res.matchedCount);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
