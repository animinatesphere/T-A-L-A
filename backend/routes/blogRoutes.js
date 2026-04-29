const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFields } = require('../middleware/uploadMiddleware');

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, uploadFields.fields([
  { name: 'featured_image', maxCount: 1 }
]), createBlog);
router.patch('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
