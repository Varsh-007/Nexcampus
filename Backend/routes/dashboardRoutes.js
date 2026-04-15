const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const Booking = require("../models/Booking");
const Announcement = require("../models/Announcement");
const Assignment = require("../models/Assignment");

const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "Pending" });
    const approvedBookings = await Booking.countDocuments({ status: "Approved" });

    res.json({
      totalEvents,
      totalAnnouncements,
      totalAssignments,
      pendingBookings,
      approvedBookings,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;