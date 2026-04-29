const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  featured_image_url: { type: String },
  featured_image: { type: String }, // Backwards compatibility for migration
  author_name: { type: String },
  author: { type: String }, // Backwards compatibility for migration
  author_avatar_url: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  is_published: { type: Boolean, default: false },
  status: { type: String }, // From main supabase
  is_featured: { type: Boolean, default: false },
  read_time_minutes: { type: Number, default: 5 },
  published_date: { type: Date },
  youtube_link: { type: String },
  attachment_url: { type: String },
  external_link: { type: String },
  additional_images: { type: String }, // JSON string from supabase
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
