const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String, // optional text
    },
    file: {
      type: String, // file path
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);