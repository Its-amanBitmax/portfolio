const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], // array of tags
      default: [],
    },
    image: {
      type: String, // filename, full URL will be returned in controller
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
