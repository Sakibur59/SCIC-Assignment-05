const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  saveJob,
  getSavedJobs,
  updateSavedJob,
  deleteSavedJob,
} = require('../controllers/savedJobController');

// All routes are protected
router.use(protect);

router.post('/', saveJob);
router.get('/', getSavedJobs);
router.put('/:id', updateSavedJob);
router.delete('/:id', deleteSavedJob);

module.exports = router;