const Testimonial = require("../models/Testimonial");
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

    const imageUrl = getImageUrl(req, req.file.filename);

    const testimonial = new Testimonial({
      name,
      title,
      description,
      image: imageUrl,
    });

    await testimonial.save();

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
      const oldImageName = testimonial.image.split("/").pop();
      const oldImagePath = path.join(
        __dirname,
        "../uploads/testimonials",
        oldImageName
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      testimonial.image = getImageUrl(req, req.file.filename);
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

    const imageName = testimonial.image.split("/").pop();
    const imagePath = path.join(
      __dirname,
      "../uploads/testimonials",
      imageName
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
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
