const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// Create contact
router.post("/create", createContact);

// Get all contacts
router.get("/", getAllContacts);

// Get single contact
router.get("/:id", getContactById);

// Update contact
router.put("/:id", updateContact);

// Delete contact
router.delete("/:id", deleteContact);

module.exports = router;
