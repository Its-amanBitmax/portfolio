const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,   // unique identifier
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("State", stateSchema);
