const express = require('express');
const router = express.Router();
const {
  getPodcasts,
  createPodcast,
  updatePodcast,
  deletePodcast
} = require('../controllers/podcastController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFields } = require('../middleware/uploadMiddleware');

router.get('/', getPodcasts);
router.post('/', protect, uploadFields.fields([
  { name: 'cover_image', maxCount: 1 }
]), createPodcast);
router.patch('/:id', protect, updatePodcast);
router.delete('/:id', protect, deletePodcast);

module.exports = router;
