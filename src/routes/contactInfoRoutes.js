const express = require("express");
const router = express.Router();
const { uploadContactInfo } = require("../middleware/upload");
const {
  createContactInfo,
  getAllContactInfo,
  getContactInfoById,
  updateContactInfo,
  deleteContactInfo,
} = require("../controllers/contactInfoController");

// Create
router.post("/create", uploadContactInfo.single("image"), createContactInfo);

// Get all
router.get("/", getAllContactInfo);

// Get single
router.get("/:id", getContactInfoById);

// Update
router.put("/:id", uploadContactInfo.single("image"), updateContactInfo);

// Delete
router.delete("/:id", deleteContactInfo);

module.exports = router;
