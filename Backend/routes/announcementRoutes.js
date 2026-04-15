const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE Announcement (Admin & Teacher only)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  async (req, res) => {
    try {
      const { title, message } = req.body;

      const newAnnouncement = new Announcement({
        title,
        message,
        postedBy: req.user.id
      });

      await newAnnouncement.save();

      res.status(201).json({ message: "Announcement created successfully" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET All Announcements (All logged-in users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(announcements);
  } catch (error) {
    console.error("GET announcements ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE Announcement (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const announcement = await Announcement.findById(req.params.id);

      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      await announcement.deleteOne();

      res.status(200).json({ message: "Announcement deleted successfully" });

    } catch (error) {
      console.error("DELETE announcement ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
