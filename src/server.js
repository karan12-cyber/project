const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const gymRoutes = require("./routes/gymRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend running 🚀" });
});

app.use("/api/gym", gymRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
