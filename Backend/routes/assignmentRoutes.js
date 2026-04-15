const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const User = require("../models/User");

const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

/* =====================================================
   🔥 MULTER CONFIGURATION
===================================================== */

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOC/DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});


/* =====================================================
   🔥 CREATE ASSIGNMENT (Admin & Teacher)
===================================================== */
router.post(
  "/create",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  async (req, res) => {
    try {
      const { title, description, department, dueDate } = req.body;

      const newAssignment = new Assignment({
        title,
        description,
        department,
        dueDate,
        createdBy: req.user.id,
      });

      await newAssignment.save();

      res.status(201).json({
        message: "Assignment created successfully",
        assignment: newAssignment,
      });

    } catch (error) {
      console.error("Create assignment error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);


/* =====================================================
   🔥 GET ASSIGNMENTS
===================================================== */
router.get(
  "/my",
  authMiddleware,
  async (req, res) => {
    try {
      const fullUser = await User.findById(req.user.id);

      let assignments;

      // 👨‍🎓 STUDENT VIEW
      if (fullUser.role === "student") {

        assignments = await Assignment.find({
          department: fullUser.department,
        })
        .populate("createdBy", "name role")
        .sort({ createdAt: -1 });

        const assignmentsWithStatus = await Promise.all(
          assignments.map(async (assignment) => {

            const submission = await Submission.findOne({
              assignment: assignment._id,
              student: fullUser._id,
            });

            return {
              ...assignment.toObject(),
              submitted: !!submission,
            };
          })
        );

        return res.status(200).json(assignmentsWithStatus);
      }

      // 👩‍🏫 ADMIN & TEACHER VIEW
      assignments = await Assignment.find()
        .populate("createdBy", "name role")
        .sort({ createdAt: -1 });

      return res.status(200).json(assignments);

    } catch (error) {
      console.error("Get assignments error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);


/* =====================================================
   🔥 DELETE ASSIGNMENT (Admin & Teacher)
===================================================== */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  async (req, res) => {
    try {
      await Assignment.findByIdAndDelete(req.params.id);

      // Delete related submissions
      await Submission.deleteMany({ assignment: req.params.id });

      res.status(200).json({
        message: "Assignment deleted successfully",
      });

    } catch (error) {
      console.error("Delete assignment error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);


/* =====================================================
   🔥 SUBMIT ASSIGNMENT (Student Only)
===================================================== */
router.post(
  "/submit/:assignmentId",
  authMiddleware,
  authorizeRoles("student"),
  upload.single("file"),
  async (req, res) => {
    try {

      const existingSubmission = await Submission.findOne({
        assignment: req.params.assignmentId,
        student: req.user.id,
      });

      if (existingSubmission) {
        return res.status(400).json({
          message: "You have already submitted this assignment",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "File is required",
        });
      }

      const newSubmission = new Submission({
        assignment: req.params.assignmentId,
        student: req.user.id,
        file: req.file.path,
      });

      await newSubmission.save();

      res.status(201).json({
        message: "Assignment submitted successfully",
      });

    } catch (error) {
      console.error("Submit assignment error:", error);

      if (error.message.includes("Only PDF")) {
        return res.status(400).json({ message: error.message });
      }

      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size should not exceed 5MB",
        });
      }

      res.status(500).json({ error: error.message });
    }
  }
);


/* =====================================================
   🔥 VIEW SUBMISSIONS (Admin & Teacher)
===================================================== */
router.get(
  "/submissions/:assignmentId",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  async (req, res) => {
    try {

      const submissions = await Submission.find({
        assignment: req.params.assignmentId,
      })
      .populate("student", "name email department")
      .sort({ createdAt: -1 });

      res.status(200).json(submissions);

    } catch (error) {
      console.error("View submissions error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;