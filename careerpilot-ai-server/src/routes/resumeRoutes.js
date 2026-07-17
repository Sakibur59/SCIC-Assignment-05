const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getResumes,
  getResume,
  deleteResume,
  analyzeResume,
  uploadResumeWithGemini,
  uploadResume,
  updateResume,
  matchJob,
} = require('../controllers/resumeController');

// All routes are protected
router.use(protect);

// Upload and analyze with Gemini
router.post('/upload-ai', upload.single('file'), uploadResumeWithGemini);

// Regular upload
router.post('/', upload.single('file'), uploadResume);

// Get all resumes
router.get('/', getResumes);
router.post('/match-job', matchJob);

// Analyze with Gemini
router.post('/analyze', analyzeResume);

// Single resume operations
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;