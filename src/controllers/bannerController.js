// src/controllers/bannerController.js
const Banner = require('../models/Banner');
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// CREATE Banner
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/${req.file.path.replace(/\\/g, '/')}`;

    const banner = new Banner({ image: imageUrl });
    const savedBanner = await banner.save();

    res.status(201).json({ success: true, data: savedBanner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL Banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Banner BY ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Banner (replace image)
exports.updateBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    // Delete old image from Cloudinary if it exists
    if (banner.image && banner.image.includes("cloudinary")) {
      const publicId = banner.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "banners",
    });

    banner.image = result.secure_url;

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    await banner.save();

    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE Banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    // Delete image from Cloudinary if it exists
    if (banner.image && banner.image.includes("cloudinary")) {
      const publicId = banner.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await banner.deleteOne();

    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
