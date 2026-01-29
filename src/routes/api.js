const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Test API
router.get("/test", (req, res) => {
  res.json({ message: "API Mohd kaif ✅" });
});

module.exports = router;
