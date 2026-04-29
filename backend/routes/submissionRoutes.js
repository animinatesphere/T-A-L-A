const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission
} = require('../controllers/submissionController');
const { uploadFields } = require('../middleware/uploadMiddleware');

router.post('/', uploadFields.fields([
  { name: 'book_cover', maxCount: 1 },
  { name: 'author_image', maxCount: 1 },
  { name: 'about_book_pdf', maxCount: 1 },
  { name: 'ebook', maxCount: 1 }
]), createSubmission);

router.get('/', getSubmissions);
router.patch('/:id', updateSubmissionStatus);
router.delete('/:id', deleteSubmission);

module.exports = router;
