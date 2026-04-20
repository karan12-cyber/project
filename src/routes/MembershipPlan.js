const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },           // e.g. "Basic", "Pro", "Elite"
  price: { type: Number, required: true },
  duration: { type: Number, required: true },        // in days (30, 90, 365)
  description: { type: String },
  features: [{ type: String }],                      // ["Gym access", "1 PT session", ...]
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
