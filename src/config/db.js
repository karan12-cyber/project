const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn("MongoDB connection failed:", error.message);
    console.warn("Server will run without database. Start MongoDB to enable DB features.");
  }
};

module.exports = connectDB;
