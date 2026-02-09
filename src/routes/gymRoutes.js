const express = require("express");
const { getWelcome } = require("../controllers/gymController");

const router = express.Router();

// GET /api/gym/welcome
router.get("/welcome", getWelcome);

module.exports = router;

