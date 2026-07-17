const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION = 'saved_jobs';

const SavedJob = {
  // Create indexes
  async createIndexes() {
    const db = getDb();
    await db.collection(COLLECTION).createIndex({ userId: 1 });
    await db.collection(COLLECTION).createIndex({ userId: 1, jobId: 1 }, { unique: true });
    await db.collection(COLLECTION).createIndex({ status: 1 });
    await db.collection(COLLECTION).createIndex({ createdAt: -1 });
  },

  // Save a job
  async create(data) {
    const db = getDb();
    const savedJob = {
      userId: new ObjectId(data.userId),
      jobId: data.jobId,
      jobData: {
        title: data.jobData.title,
        company: data.jobData.company,
        location: data.jobData.location || '',
        salary: data.jobData.salary || '',
        type: data.jobData.type || '',
        description: data.jobData.description || '',
        companyLogo: data.jobData.companyLogo || '',
        applyUrl: data.jobData.applyUrl || '',
      },
      notes: data.notes || '',
      status: data.status || 'saved',
      createdAt: new Date(),
    };

    try {
      const result = await db.collection(COLLECTION).insertOne(savedJob);
      return { ...savedJob, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Job already saved');
      }
      throw error;
    }
  },

  // Find saved jobs by user
  async findByUserId(userId) {
    const db = getDb();
    return await db.collection(COLLECTION)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
  },

  // Find saved job by id
  async findById(id) {
    const db = getDb();
    return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  },

  // Find saved job by user and jobId
  async findByUserAndJobId(userId, jobId) {
    const db = getDb();
    return await db.collection(COLLECTION).findOne({
      userId: new ObjectId(userId),
      jobId: jobId,
    });
  },

  // Update status
  async updateStatus(id, status, notes) {
    const db = getDb();
    const update = { status };
    if (notes !== undefined) {
      update.notes = notes;
    }
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    return result.modifiedCount > 0;
  },

  // Delete saved job
  async delete(id) {
    const db = getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

module.exports = SavedJob;