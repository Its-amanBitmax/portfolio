const Service = require('../models/Service');
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// CREATE Service
exports.createService = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "services",
    });

    const service = new Service({
      image: result.secure_url,
      title,
      description
    });

    await service.save();

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({ success: true, data: service });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Service BY ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Service
exports.updateService = async (req, res) => {
  try {
    const { title, description } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // if new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (service.image && service.image.includes("cloudinary")) {
        const publicId = service.image.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "services",
      });

      service.image = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    service.title = title || service.title;
    service.description = description || service.description;

    await service.save();

    res.status(200).json({ success: true, data: service });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE Service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Delete image from Cloudinary if it exists
    if (service.image && service.image.includes("cloudinary")) {
      const publicId = service.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await service.deleteOne();

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
