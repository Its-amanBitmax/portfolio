const Skill = require("../models/Skill");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// Helper: get full image URL
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/skills/${filename}`;
};

// ➕ Create Skill
exports.createSkill = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Skill image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "skills",
    });

    const skill = new Skill({
      title,
      image: result.secure_url,
    });

    await skill.save();

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get All Skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📄 Get Single Skill
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏ Update Skill
exports.updateSkill = async (req, res) => {
  try {
    const { title } = req.body;
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // If new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (skill.image && skill.image.includes("cloudinary")) {
        const publicId = skill.image.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "skills",
      });

      skill.image = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    skill.title = title || skill.title;

    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Delete Skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (skill.image && skill.image.includes("cloudinary")) {
      const publicId = skill.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
