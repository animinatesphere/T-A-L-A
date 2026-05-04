const Judge = require('../models/Judge');

// @desc    Get all judges
// @route   GET /api/judges
// @access  Public
const getJudges = async (req, res) => {
  try {
    const judges = await Judge.find({ is_active: true }).sort({ display_order: 1 });
    res.status(200).json({
      success: true,
      count: judges.length,
      data: judges
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create a judge
// @route   POST /api/judges
// @access  Private/Admin
const createJudge = async (req, res) => {
  try {
    const judgeData = req.body;
    
    if (req.files && req.files.image) {
      judgeData.image_url = `/uploads/images/${req.files.image[0].filename}`;
    }

    const judge = await Judge.create(judgeData);
    res.status(201).json({
      success: true,
      data: judge
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update a judge
// @route   PATCH /api/judges/:id
// @access  Private/Admin
const updateJudge = async (req, res) => {
  try {
    const judgeData = req.body;

    if (req.files && req.files.image) {
      judgeData.image_url = `/uploads/images/${req.files.image[0].filename}`;
    }

    const judge = await Judge.findByIdAndUpdate(req.params.id, judgeData, {
      new: true,
      runValidators: true
    });

    if (!judge) {
      return res.status(404).json({ success: false, error: 'Judge not found' });
    }

    res.status(200).json({ success: true, data: judge });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a judge
// @route   DELETE /api/judges/:id
// @access  Private/Admin
const deleteJudge = async (req, res) => {
  try {
    const judge = await Judge.findByIdAndDelete(req.params.id);

    if (!judge) {
      return res.status(404).json({ success: false, error: 'Judge not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getJudges,
  createJudge,
  updateJudge,
  deleteJudge
};
