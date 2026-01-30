const Contact = require("../models/Contact");

// ➕ Create Contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get All Contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get Single Contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).json({ success: false, message: "Contact not found" });

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏ Update Contact
exports.updateContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).json({ success: false, message: "Contact not found" });

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.subject = subject || contact.subject;
    contact.message = message || contact.message;

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete Contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).json({ success: false, message: "Contact not found" });

    await contact.deleteOne();

    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
