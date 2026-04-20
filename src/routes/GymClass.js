const mongoose = require('mongoose');

const gymClassSchema = new mongoose.Schema({
  name: { type: String, required: true },           // e.g. "Yoga", "Zumba", "CrossFit"
  description: { type: String },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  schedule: {
    day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
    startTime: { type: String },                    // e.g. "09:00 AM"
    endTime: { type: String },
    date: { type: Date }
  },
  capacity: { type: Number, default: 20 },
  enrolledCount: { type: Number, default: 0 },
  category: { type: String },                       // "Cardio", "Strength", "Flexibility"
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  image: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('GymClass', gymClassSchema);
