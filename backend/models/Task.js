const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: Date,
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    attachments: [String], // URLs or file paths
  },
  { timestamps: true }
);
module.exports = mongoose.model("Task", TaskSchema);
