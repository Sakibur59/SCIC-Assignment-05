const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION = 'applications';

const Application = {
  // Create indexes
  async createIndexes() {
    const db = getDb();
    await db.collection(COLLECTION).createIndex({ userId: 1 });
    await db.collection(COLLECTION).createIndex({ jobId: 1 });
    await db.collection(COLLECTION).createIndex({ userId: 1, jobId: 1 }, { unique: true });
    await db.collection(COLLECTION).createIndex({ status: 1 });
    await db.collection(COLLECTION).createIndex({ createdAt: -1 });
  },

  // Create application
  async create(data) {
    const db = getDb();
    const application = {
      userId: new ObjectId(data.userId),
      jobId: data.jobId,
      jobData: {
        title: data.jobData.title,
        company: data.jobData.company,
        location: data.jobData.location || '',
        salary: data.jobData.salary || '',
        type: data.jobData.type || '',
        companyLogo: data.jobData.companyLogo || '',
      },
      resumeId: new ObjectId(data.resumeId),
      coverLetter: data.coverLetter || '',
      status: 'applied',
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await db.collection(COLLECTION).insertOne(application);
      return { ...application, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('You have already applied for this job');
      }
      throw error;
    }
  },

  // Get applications by user
  async findByUserId(userId) {
    const db = getDb();
    return await db.collection(COLLECTION)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
  },

  // Get application by user and job
  async findByUserAndJob(userId, jobId) {
    const db = getDb();
    return await db.collection(COLLECTION).findOne({
      userId: new ObjectId(userId),
      jobId: jobId,
    });
  },

  // Update application status
  async updateStatus(id, status) {
    const db = getDb();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          updatedAt: new Date() 
        } 
      }
    );
    return result.modifiedCount > 0;
  },

  // Delete application
  async delete(id) {
    const db = getDb();
    const result = await db.collection(COLLECTION).deleteOne({ 
      _id: new ObjectId(id) 
    });
    return result.deletedCount > 0;
  },
};

module.exports = Application;