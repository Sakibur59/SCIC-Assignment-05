const { MongoClient } = require('mongodb');

let client = null;
let db = null;

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'careerpilot';

const connectDB = async () => {
  try {
    if (client && db) {
      return { client, db };
    }

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    console.log('✅ MongoDB connected successfully');
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
};

const getClient = () => {
  if (!client) {
    throw new Error('MongoDB client not connected. Call connectDB first.');
  }
  return client;
};

module.exports = { connectDB, getDb, getClient };