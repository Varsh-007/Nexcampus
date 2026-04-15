const express = require("express");
const router = express.Router();
const Venue = require("../models/Venue");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all venues
router.get("/", authMiddleware, async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;