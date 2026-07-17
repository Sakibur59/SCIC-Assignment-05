const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  uploadResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  analyzeResume,
} = require('../controllers/resumeController');

// All routes are protected
router.use(protect);

// Upload and get all
router.post('/', upload.single('file'), uploadResume);
router.get('/', getResumes);

// Analyze
router.post('/analyze', analyzeResume);

// Single resume operations
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;