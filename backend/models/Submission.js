const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  relationship_to_author: { type: String, required: true },
  about_aurthor: { type: String, required: true },
  author_name: { type: String, required: true },
  pen_name: { type: String },
  book_title: { type: String, required: true },
  subtitle: { type: String },
  genre: { type: String, required: true },
  book_series: { type: String },
  book_description: { type: String },
  date_of_publication: { type: String },
  barnes_noble_url: { type: String },
  facebook_url: { type: String },
  instagram_url: { type: String },
  twitter_url: { type: String },
  threads_url: { type: String },
  cover_image_url: { type: String },
  author_image_url: { type: String },
  about_book_pdf_url: { type: String },
  ebook_url: { type: String },
  payment_status: { type: String, default: 'pending' },
  payment_amount: { type: Number },
  payment_currency: { type: String },
  payment_reference: { type: String },
  submission_status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'under_review'], 
    default: 'pending' 
  },
  admin_notes: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
