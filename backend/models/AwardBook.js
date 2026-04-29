const mongoose = require('mongoose');

const awardBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  author: { type: String, required: true },
  pen_name: { type: String },
  cover_image_url: { type: String },
  author_image_url: { type: String },
  description: { type: String },
  synopsis: { type: String },
  author_bio: { type: String },
  genre: { type: String },
  book_series: { type: String },
  date_of_publication: { type: String },
  year_won: { type: Number, default: new Date().getFullYear() },
  author_slug: { type: String },
  amazon_url: { type: String },
  amazon_uk_url: { type: String },
  website_url: { type: String },
  blog_url: { type: String },
  video_trailer_url: { type: String },
  facebook_url: { type: String },
  instagram_url: { type: String },
  twitter_url: { type: String },
  threads_url: { type: String },
  about_book_pdf_url: { type: String },
  ebook_url: { type: String },
  is_featured: { type: Boolean, default: false },
  display_order: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('AwardBook', awardBookSchema);
