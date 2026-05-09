/**
 * Drops legacy partial unique index that limited merchants to one active bank financing row.
 * Required before deploying MAX_CONCURRENT_ACTIVE_APPLICATIONS > 1.
 *
 * Run from repo backend folder:
 *   node migrations/dropMerchantActiveFinancingUniqueIndex.js
 *
 * Requires MONGODB_URI (or MONGO_URI) in environment.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const INDEX_NAME = 'merchant_active_financing_unique';

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI or MONGO_URI');
    process.exit(1);
  }
  await mongoose.connect(uri);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const BankFinancingApplication = require(path.join(__dirname, '../models/BankFinancingApplication'));
  const collName = BankFinancingApplication.collection.collectionName;
  const db = mongoose.connection.db;
  const coll = db.collection(collName);
  const indexes = await coll.indexes();
  const exists = indexes.some((ix) => ix.name === INDEX_NAME);
  if (!exists) {
    console.log(`Index "${INDEX_NAME}" not present — nothing to do.`);
    await mongoose.disconnect();
    return;
  }
  await coll.dropIndex(INDEX_NAME);
  console.log(`Dropped index "${INDEX_NAME}".`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
