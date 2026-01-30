const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// helper for full image URL
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/projects/${filename}`;
};

// ➕ Create Project
exports.createProject = async (req, res) => {
  try {
    const { title, link, techstack } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Project image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "projects",
    });

    const project = new Project({
      title,
      link,
      techstack: Array.isArray(techstack) ? techstack : techstack.split(","),
      image: result.secure_url,
    });

    await project.save();

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏ Update Project
exports.updateProject = async (req, res) => {
  try {
    const { title, link, techstack } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // if new image uploaded
    if (req.file) {
      const oldImageName = project.image.split("/").pop();
      const oldImagePath = path.join(
        __dirname,
        "../uploads/projects",
        oldImageName
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      project.image = getImageUrl(req, req.file.filename);
    }

    project.title = title || project.title;
    project.link = link || project.link;

    if (techstack) {
      project.techstack = Array.isArray(techstack)
        ? techstack
        : techstack.split(",");
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (project.image && project.image.includes("cloudinary")) {
      const publicId = project.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
