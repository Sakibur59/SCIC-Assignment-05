const SavedJob = require('../models/SavedJob');

// @desc    Check if job is saved
// @route   GET /api/saved-jobs/check
// @access  Private
const checkSavedJob = async (req, res) => {
  try {
    const { jobId } = req.query;

    console.log('🔍 Checking saved job:', { jobId, userId: req.user._id });

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const savedJob = await SavedJob.findByUserAndJobId(req.user._id, jobId);
    
    res.json({ saved: !!savedJob });
  } catch (error) {
    console.error('❌ Check saved job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save a job
// @route   POST /api/saved-jobs
// @access  Private
const saveJob = async (req, res) => {
  try {
    console.log('📝 Save job request received');
    console.log('👤 User:', req.user._id);
    console.log('📦 Body:', req.body);

    const { jobId, jobData, notes } = req.body;

    if (!jobId || !jobData) {
      return res.status(400).json({ 
        message: 'Please provide job data' 
      });
    }

    // Check if already saved
    const existing = await SavedJob.findByUserAndJobId(req.user._id, jobId);
    if (existing) {
      return res.status(400).json({ 
        message: 'Job already saved' 
      });
    }

    const savedJob = await SavedJob.create({
      userId: req.user._id,
      jobId: jobId.toString(),
      jobData,
      notes: notes || '',
    });

    console.log('✅ Job saved successfully:', savedJob._id);

    res.status(201).json({
      message: 'Job saved successfully',
      savedJob,
    });
  } catch (error) {
    console.error('❌ Save job error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Get all saved jobs
// @route   GET /api/saved-jobs
// @access  Private
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.findByUserId(req.user._id);
    res.json({ savedJobs });
  } catch (error) {
    console.error('❌ Get saved jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update saved job status
// @route   PUT /api/saved-jobs/:id
// @access  Private
const updateSavedJob = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const savedJob = await SavedJob.findById(req.params.id);
    
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    // Check ownership
    if (savedJob.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SavedJob.updateStatus(req.params.id, status, notes);
    const updated = await SavedJob.findById(req.params.id);

    res.json({
      message: 'Saved job updated successfully',
      savedJob: updated,
    });
  } catch (error) {
    console.error('❌ Update saved job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private
const deleteSavedJob = async (req, res) => {
  try {
    console.log('🗑️ Delete saved job request received');
    console.log('👤 User:', req.user._id);
    console.log('📦 Job ID:', req.params.jobId);

    const savedJob = await SavedJob.findByUserAndJobId(req.user._id, req.params.jobId);
    
    if (!savedJob) {
      return res.status(404).json({ 
        message: 'Job not found in saved list' 
      });
    }

    await SavedJob.delete(savedJob._id);

    console.log('✅ Job removed successfully');

    res.json({ 
      message: 'Job removed from saved list' 
    });
  } catch (error) {
    console.error('❌ Delete saved job error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error' 
    });
  }
};

module.exports = {
  checkSavedJob,
  saveJob,
  getSavedJobs,
  updateSavedJob,
  deleteSavedJob,
};