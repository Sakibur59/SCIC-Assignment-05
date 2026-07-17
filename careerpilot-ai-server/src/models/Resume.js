const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION = 'resumes';

const Resume = {
  // Create indexes
  async createIndexes() {
    const db = getDb();
    await db.collection(COLLECTION).createIndex({ userId: 1 });
    await db.collection(COLLECTION).createIndex({ userId: 1, isActive: 1 });
    await db.collection(COLLECTION).createIndex({ createdAt: -1 });
    await db.collection(COLLECTION).createIndex({ skills: 1 });
  },

  // Create resume
  async create(data) {
    const db = getDb();
    const resume = {
      userId: new ObjectId(data.userId),
      title: data.title,
      fileName: data.fileName,
      filePath: data.filePath,
      fileSize: data.fileSize,
      mimeType: data.mimeType || 'application/pdf',
      skills: data.skills || [],
      experience: data.experience || [],
      education: data.education || [],
      portfolio: data.portfolio || '',
      linkedin: data.linkedin || '',
      github: data.github || '',
      extractedText: data.extractedText || '',
      analysis: {
        score: null,
        suggestions: [],
        keywords: [],
        atsScore: null,
        analyzedAt: null,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(resume);
    return { ...resume, _id: result.insertedId };
  },

  // Find resumes by user
  async findByUserId(userId, activeOnly = true) {
    const db = getDb();
    const query = { userId: new ObjectId(userId) };
    if (activeOnly) {
      query.isActive = true;
    }
    return await db.collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
  },

  // Find resume by id
  async findById(id) {
    const db = getDb();
    return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  },

  // Find resume by id and user
  async findByIdAndUser(id, userId) {
    const db = getDb();
    return await db.collection(COLLECTION).findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    });
  },

  // Update resume
  async update(id, updates) {
    const db = getDb();
    updates.updatedAt = new Date();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return result.modifiedCount > 0;
  },

  // Soft delete
  async delete(id) {
    const db = getDb();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  },

  // Update analysis
  async updateAnalysis(id, analysis) {
    const db = getDb();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          'analysis': {
            score: analysis.overallScore || analysis.score || 0,
            suggestions: analysis.suggestions || [],
            keywords: analysis.keywords || [],
            atsScore: analysis.atsScore || 0,
            analyzedAt: new Date(),
          },
          updatedAt: new Date(),
        }
      }
    );
    return result.modifiedCount > 0;
  },
};

module.exports = Resume;