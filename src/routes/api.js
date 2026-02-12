const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Test API
router.get("/test", (req, res) => {
  res.json({ message: "I'm still waking up ✅" });
});

module.exports = router;
