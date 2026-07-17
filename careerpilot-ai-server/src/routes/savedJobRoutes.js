const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  checkSavedJob,
  saveJob,
  getSavedJobs,
  updateSavedJob,
  deleteSavedJob,
} = require('../controllers/savedJobController');

// All routes are protected (require authentication)
router.use(protect);

// Check if job is saved
router.get('/check', checkSavedJob);

// Get all saved jobs
router.get('/', getSavedJobs);

// Save a job
router.post('/', saveJob);

// Update saved job
router.put('/:id', updateSavedJob);

// Delete saved job (using jobId as parameter)
router.delete('/:jobId', deleteSavedJob);

module.exports = router;