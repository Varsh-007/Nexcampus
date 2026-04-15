const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

/* ===============================================
   1️⃣ CREATE BOOKING (President)
================================================ */
router.post(
  "/book",
  authMiddleware,
  authorizeRoles("president"),
  async (req, res) => {
    try {
      const { eventName, venue, date, startTime, endTime } = req.body;

      if (!eventName || !venue || !date || !startTime || !endTime) {
        return res.status(400).json({ message: "All fields required" });
      }

      const booking = new Booking({
        eventName,
        venue,
        date,
        startTime,
        endTime,
        requestedBy: req.user.id,
      });

      await booking.save();

      res.status(201).json({
        message: "Booking request submitted",
        booking,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/* ===============================================
   2️⃣ GET ALL BOOKINGS (Admin Only)
================================================ */
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("venue")
        .populate("requestedBy", "name role");

      res.json(bookings);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/* ===============================================
   3️⃣ APPROVE BOOKING (Admin Only)
================================================ */

router.put(
  "/approve/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      console.log("BOOKING DATA:", booking);
      console.log("EVENT NAME:", booking.eventName);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Prevent double approval
      if (booking.status === "Approved") {
        return res.status(400).json({ message: "Already approved" });
      }

      // Check time conflict
      const existingEvent = await Event.findOne({
        venue: booking.venue,
        date: booking.date,
        startTime: booking.startTime,
      });

      if (existingEvent) {
        return res.status(400).json({
          message: "Slot already booked"
        });
      }

      // Create Event
      const newEvent = new Event({
        title: booking.eventName,
        description: "Approved by Admin",
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        venue: booking.venue,
        createdBy: req.user.id,
      });

      await newEvent.save();

      // Update booking
      booking.status = "Approved";
      await booking.save();

      res.json({
        message: "Booking approved & event created",
        newEvent
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/* ===============================================
   4️⃣ REJECT BOOKING (Admin Only)
================================================ */
router.delete(
  "/reject/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await booking.deleteOne();

      res.json({
        message: "Booking rejected & deleted"
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;