const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    image: {
      type: String, // filename, full URL return in controller
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
