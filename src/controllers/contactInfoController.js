const ContactInfo = require("../models/ContactInfo");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// helper for full image URL
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/contactinfo/${filename}`;
};

// ➕ Create ContactInfo
exports.createContactInfo = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "contactinfo",
    });

    const contactInfo = new ContactInfo({
      title,
      description,
      link,
      image: result.secure_url,
    });

    await contactInfo.save();

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "ContactInfo created successfully",
      data: contactInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get All ContactInfo
exports.getAllContactInfo = async (req, res) => {
  try {
    const infos = await ContactInfo.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: infos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get Single ContactInfo
exports.getContactInfoById = async (req, res) => {
  try {
    const info = await ContactInfo.findById(req.params.id);

    if (!info) {
      return res.status(404).json({
        success: false,
        message: "ContactInfo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: info,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏ Update ContactInfo
exports.updateContactInfo = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    const info = await ContactInfo.findById(req.params.id);
    if (!info) {
      return res.status(404).json({
        success: false,
        message: "ContactInfo not found",
      });
    }

    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (info.image && info.image.includes("cloudinary")) {
        const publicId = info.image.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "contactinfo",
      });

      info.image = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    info.title = title || info.title;
    info.description = description || info.description;
    info.link = link || info.link;

    await info.save();

    res.status(200).json({
      success: true,
      message: "ContactInfo updated successfully",
      data: info,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Delete ContactInfo
exports.deleteContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.findById(req.params.id);

    if (!info) {
      return res.status(404).json({
        success: false,
        message: "ContactInfo not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (info.image && info.image.includes("cloudinary")) {
      const publicId = info.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await info.deleteOne();

    res.status(200).json({
      success: true,
      message: "ContactInfo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
