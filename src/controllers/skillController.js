const Skill = require("../models/Skill");
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

    const imageUrl = getImageUrl(req, req.file.filename);

    const skill = new Skill({
      title,
      image: imageUrl, // save full path
    });

    await skill.save();

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
      // extract old filename from full URL
      const oldImageName = skill.image.split("/").pop();
      const oldImagePath = path.join(
        __dirname,
        "../uploads/skills",
        oldImageName
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      const newImageUrl = getImageUrl(req, req.file.filename);
      skill.image = newImageUrl;
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

    // extract filename from URL
    const imageName = skill.image.split("/").pop();
    const imagePath = path.join(
      __dirname,
      "../uploads/skills",
      imageName
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
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
