const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const Venue = require("../models/Venue");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

/* =====================================================
   📌 1. CREATE EVENT (Admin / Teacher)
===================================================== */
router.post(
  "/create",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  async (req, res) => {
    try {
      const { title, description, date, startTime, endTime, venue } = req.body;

      if (!title || !date || !startTime || !endTime || !venue) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }

      const newEvent = new Event({
        title,
        description,
        date,
        startTime,
        endTime,
        venue,
        createdBy: req.user.id,
      });

      await newEvent.save();

      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/* =====================================================
   📌 2. GET ALL EVENTS (All Logged-in Users)
===================================================== */
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const events = await Event.find()
        .populate("venue")
        .populate("createdBy", "name role")
        .sort({ date: 1 });

      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/* =====================================================
   📌 3. GET SINGLE EVENT
===================================================== */
router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
        .populate("venue")
        .populate("createdBy", "name role");

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/* =====================================================
   📌 4. UPDATE EVENT (Admin / Teacher)
===================================================== */
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  async (req, res) => {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


/* =====================================================
   📌 5. DELETE EVENT (Admin / Teacher)
===================================================== */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  async (req, res) => {
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);

      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;