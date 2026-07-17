const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const COLLECTION = 'users';

const User = {
  // Create indexes
  async createIndexes() {
    const db = getDb();
    await db.collection(COLLECTION).createIndex({ email: 1 }, { unique: true });
    await db.collection(COLLECTION).createIndex({ createdAt: -1 });
  },

  // Find user by email
  async findByEmail(email) {
    const db = getDb();
    return await db.collection(COLLECTION).findOne({ email });
  },

  // Find user by id
  async findById(id) {
    const db = getDb();
    return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  },

  // Create new user
  async create(userData) {
    const db = getDb();
    const { name, email, password, provider = 'credentials', image } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider,
      image: image || null,
      role: 'user',
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  },

  // Create Google user
  async createGoogleUser(userData) {
    const db = getDb();
    const { name, email, image } = userData;

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: null,
      provider: 'google',
      image: image || null,
      role: 'user',
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  },

  // Update user
  async update(id, updates) {
    const db = getDb();
    updates.updatedAt = new Date();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return result.modifiedCount > 0;
  },

  // Compare password
  async comparePassword(user, enteredPassword) {
    return await bcrypt.compare(enteredPassword, user.password);
  },
};

module.exports = User;