const AwardBook = require('../models/AwardBook');

// @desc    Get all award winning books
// @route   GET /api/award-books
// @access  Public
const getAwardBooks = async (req, res) => {
  try {
    const books = await AwardBook.find().sort({ display_order: 1, year_won: -1 });
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create an award winning book
// @route   POST /api/award-books
// @access  Private/Admin
const createAwardBook = async (req, res) => {
  try {
    const bookData = req.body;
    
    if (req.files) {
      if (req.files.cover_image) bookData.cover_image_url = `/uploads/images/${req.files.cover_image[0].filename}`;
      if (req.files.author_image) bookData.author_image_url = `/uploads/images/${req.files.author_image[0].filename}`;
    }

    const book = await AwardBook.create(bookData);
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update an award winning book
// @route   PATCH /api/award-books/:id
// @access  Private/Admin
const updateAwardBook = async (req, res) => {
  try {
    const book = await AwardBook.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete an award winning book
// @route   DELETE /api/award-books/:id
// @access  Private/Admin
const deleteAwardBook = async (req, res) => {
  try {
    const book = await AwardBook.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAwardBooks,
  createAwardBook,
  updateAwardBook,
  deleteAwardBook
};
