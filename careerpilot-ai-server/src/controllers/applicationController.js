const Application = require('../models/Application');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyForJob = async (req, res) => {
  try {
    const { jobId, jobData, resumeId, coverLetter } = req.body;

    if (!jobId || !jobData || !resumeId) {
      return res.status(400).json({ 
        message: 'Job ID, Job Data, and Resume ID are required' 
      });
    }

    // Check if already applied
    const existing = await Application.findByUserAndJob(req.user._id, jobId);
    if (existing) {
      return res.status(400).json({ 
        message: 'You have already applied for this job' 
      });
    }

    const application = await Application.create({
      userId: req.user._id,
      jobId,
      jobData,
      resumeId,
      coverLetter: coverLetter || '',
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });

  } catch (error) {
    console.error('❌ Apply error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    const applications = await Application.findByUserId(req.user._id);
    res.json({ applications });
  } catch (error) {
    console.error('❌ Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check if user applied for a job
// @route   GET /api/applications/check
// @access  Private
const checkApplication = async (req, res) => {
  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const application = await Application.findByUserAndJob(req.user._id, jobId);
    
    res.json({ 
      applied: !!application,
      application: application || null,
      status: application?.status || null,
    });
  } catch (error) {
    console.error('❌ Check application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  applyForJob,
  getApplications,
  checkApplication,
};