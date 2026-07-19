const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  applyForJob,
  getApplications,
  checkApplication,
} = require('../controllers/applicationController');

// All routes are protected
router.use(protect);

router.post('/', applyForJob);
router.get('/', getApplications);
router.get('/check', checkApplication);

module.exports = router;