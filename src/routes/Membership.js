const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Basic", "Pro", "Elite"
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in days (30, 90, 365)
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    badge: { type: String, default: "" }, // e.g. "Most Popular"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
