const SavedJob = require('../models/SavedJob');

// @desc    Save a job
// @route   POST /api/saved-jobs
// @access  Private
const saveJob = async (req, res) => {
  try {
    const { jobId, jobData, notes } = req.body;

    if (!jobId || !jobData) {
      return res.status(400).json({ message: 'Please provide job data' });
    }

    // Check if already saved
    const existing = await SavedJob.findByUserAndJobId(req.user._id, jobId);
    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = await SavedJob.create({
      userId: req.user._id,
      jobId,
      jobData,
      notes: notes || '',
    });

    res.status(201).json({
      message: 'Job saved successfully',
      savedJob,
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
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
    console.error('Get saved jobs error:', error);
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
    console.error('Update saved job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete saved job
// @route   DELETE /api/saved-jobs/:id
// @access  Private
const deleteSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findById(req.params.id);
    
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    // Check ownership
    if (savedJob.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SavedJob.delete(req.params.id);

    res.json({ message: 'Saved job removed successfully' });
  } catch (error) {
    console.error('Delete saved job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  updateSavedJob,
  deleteSavedJob,
};