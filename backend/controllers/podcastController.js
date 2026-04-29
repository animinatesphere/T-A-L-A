const Podcast = require('../models/Podcast');

// @desc    Get all podcasts
// @route   GET /api/podcasts
// @access  Public
const getPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find().sort({ episode_number: -1 });
    res.status(200).json({
      success: true,
      count: podcasts.length,
      data: podcasts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create a podcast
// @route   POST /api/podcasts
// @access  Private/Admin
const createPodcast = async (req, res) => {
  try {
    const podcastData = req.body;
    
    if (req.files && req.files.cover_image) {
      podcastData.cover_image_url = `/uploads/images/${req.files.cover_image[0].filename}`;
    }

    const podcast = await Podcast.create(podcastData);
    res.status(201).json({
      success: true,
      data: podcast
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update a podcast
// @route   PATCH /api/podcasts/:id
// @access  Private/Admin
const updatePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!podcast) {
      return res.status(404).json({ success: false, error: 'Podcast not found' });
    }

    res.status(200).json({ success: true, data: podcast });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a podcast
// @route   DELETE /api/podcasts/:id
// @access  Private/Admin
const deletePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);

    if (!podcast) {
      return res.status(404).json({ success: false, error: 'Podcast not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPodcasts,
  createPodcast,
  updatePodcast,
  deletePodcast
};
