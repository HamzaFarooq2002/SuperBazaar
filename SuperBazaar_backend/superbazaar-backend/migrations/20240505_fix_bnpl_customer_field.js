/**
 * Backfills BNPL orders: `customer` = legacy `merchant` (buyer id), `orderType` = customer_bnpl.
 * Run after deploying Order schema with `customer` / `orderType`.
 *
 *   node migrations/20240505_fix_bnpl_customer_field.js
 *
 * Requires MONGODB_URI or MONGO_URI.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI or MONGO_URI');
    process.exit(1);
  }
  await mongoose.connect(uri);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const Order = require(path.join(__dirname, '../models/Order'));

  const match = {
    paymentMethod: 'bnpl',
    $or: [{ customer: { $exists: false } }, { customer: null }]
  };

  const res = await Order.collection.updateMany(match, [
    {
      $set: {
        orderType: 'customer_bnpl',
        customer: '$merchant'
      }
    }
  ]);

  console.log(`BNPL backfill: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
