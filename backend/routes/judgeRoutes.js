const express = require('express');
const router = express.Router();
const {
  getJudges,
  createJudge,
  updateJudge,
  deleteJudge
} = require('../controllers/judgeController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFields } = require('../middleware/uploadMiddleware');

router.get('/', getJudges);
router.post('/', protect, uploadFields.fields([
  { name: 'image', maxCount: 1 }
]), createJudge);
router.patch('/:id', protect, uploadFields.fields([
  { name: 'image', maxCount: 1 }
]), updateJudge);
router.delete('/:id', protect, deleteJudge);

module.exports = router;
