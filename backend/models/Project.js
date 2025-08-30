const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Project", ProjectSchema);
