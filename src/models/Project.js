const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // full image URL
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    techstack: {
      type: [String], // array of techs
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
