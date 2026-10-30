const express = require('express');
const router = express.Router();
const {
  createSubmission,
  createTestSubmission,
  testSubmissionsEnabled,
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission
} = require('../controllers/submissionController');
const { uploadFields } = require('../middleware/uploadMiddleware');

const submissionUploads = uploadFields.fields([
  { name: 'book_cover', maxCount: 1 },
  { name: 'author_image', maxCount: 1 },
  { name: 'about_book_pdf', maxCount: 1 },
  { name: 'ebook', maxCount: 1 }
]);

const requireUnpaidTestMode = (req, res, next) => {
  if (!testSubmissionsEnabled()) {
    return res.status(403).json({
      success: false,
      error: 'Unpaid test submissions are not enabled.'
    });
  }
  return next();
};

router.post('/', submissionUploads, createSubmission);
router.post('/test', requireUnpaidTestMode, submissionUploads, createTestSubmission);

router.get('/', getSubmissions);
router.patch('/:id', updateSubmissionStatus);
router.delete('/:id', deleteSubmission);

module.exports = router;
