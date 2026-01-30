// src/controllers/aboutController.js

const About = require('../models/About');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// ----------------------------
// CREATE About with image
// ----------------------------
exports.createAbout = async (req, res) => {
  try {
    const aboutData = { ...req.body };

    // Agar image upload ho gayi ho
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "about",
      });
      aboutData.image = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    const about = new About(aboutData);
    const savedAbout = await about.save();
    res.status(201).json({ success: true, data: savedAbout });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ----------------------------
// GET ALL About
// ----------------------------
exports.getAllAbouts = async (req, res) => {
  try {
    const abouts = await About.find();
    res.status(200).json({ success: true, data: abouts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------
// GET About BY ID
// ----------------------------
exports.getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ success: false, message: 'About not found' });
    }
    res.status(200).json({ success: true, data: about });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------
// UPDATE About with image
// ----------------------------
exports.updateAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ success: false, message: 'About not found' });
    }

    const aboutData = { ...req.body };

    // Agar new image upload hui ho
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (about.image && about.image.includes("cloudinary")) {
        const publicId = about.image.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "about",
      });
      aboutData.image = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    const updatedAbout = await About.findByIdAndUpdate(req.params.id, aboutData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedAbout });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ----------------------------
// DELETE About
// ----------------------------
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({ success: false, message: 'About not found' });
    }

    // Delete image from Cloudinary if it exists
    if (about.image && about.image.includes("cloudinary")) {
      const publicId = about.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await about.deleteOne();

    res.status(200).json({ success: true, message: 'About deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
