const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  bio: { type: String },
  specializations: [{ type: String }],              // ["Weight Loss", "Yoga", "CrossFit"]
  experience: { type: Number },                     // years
  profileImage: { type: String },
  certifications: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
