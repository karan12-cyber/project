const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    category: {
      type: String,
      enum: ["Yoga", "HIIT", "Zumba", "Strength", "Cardio", "Pilates", "Boxing", "CrossFit", "Other"],
      default: "Other",
    },
    schedule: [
      {
        day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
        startTime: { type: String }, // e.g. "09:00"
        endTime: { type: String },
      },
    ],
    capacity: { type: Number, required: true, default: 20 },
    enrolled: { type: Number, default: 0 },
    duration: { type: Number }, // in minutes
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "All Levels"], default: "All Levels" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
