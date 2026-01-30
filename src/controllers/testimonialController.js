const Testimonial = require("../models/Testimonial");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// helper function
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/testimonials/${filename}`;
};

// ➕ Create Testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "testimonials",
    });

    const testimonial = new Testimonial({
      name,
      title,
      description,
      image: result.secure_url,
    });

    await testimonial.save();

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get All Testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get Single Testimonial
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏ Update Testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, title, description } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // if new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (testimonial.image && testimonial.image.includes("cloudinary")) {
        const publicId = testimonial.image.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "testimonials",
      });

      testimonial.image = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    testimonial.name = name || testimonial.name;
    testimonial.title = title || testimonial.title;
    testimonial.description = description || testimonial.description;

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Delete Testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (testimonial.image && testimonial.image.includes("cloudinary")) {
      const publicId = testimonial.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
