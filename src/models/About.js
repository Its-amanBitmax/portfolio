// src/models/About.js

const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
    zipcode: {
      type: String,
      trim: true,
    },
    interest: {
      type: [String], // multiple interests store karne ke liye
      default: [],
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically
  }
);

module.exports = mongoose.model('About', AboutSchema);
