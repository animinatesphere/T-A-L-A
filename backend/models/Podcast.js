const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  guest_name: { type: String, required: true },
  description: { type: String },
  episode_number: { type: Number, required: true },
  duration: { type: String },
  spotify_url: { type: String },
  apple_podcast_url: { type: String },
  youtube_url: { type: String },
  cover_image_url: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Podcast', podcastSchema);
