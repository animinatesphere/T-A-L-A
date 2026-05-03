const express = require('express');
const router = express.Router();
const {
  getAwardBooks,
  createAwardBook,
  updateAwardBook,
  deleteAwardBook
} = require('../controllers/awardBookController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFields } = require('../middleware/uploadMiddleware');

router.get('/', getAwardBooks);
router.post('/', protect, uploadFields.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'author_image', maxCount: 1 }
]), createAwardBook);
router.patch('/:id', protect, uploadFields.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'author_image', maxCount: 1 }
]), updateAwardBook);
router.delete('/:id', protect, deleteAwardBook);

module.exports = router;
