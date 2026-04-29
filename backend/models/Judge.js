const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String },
  image_url: { type: String },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Judge', judgeSchema);
