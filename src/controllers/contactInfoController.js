const ContactInfo = require("../models/ContactInfo");
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

    const contactInfo = new ContactInfo({
      title,
      description,
      link,
      image: req.file.filename,
    });

    await contactInfo.save();

    res.status(201).json({
      success: true,
      message: "ContactInfo created successfully",
      data: {
        ...contactInfo._doc,
        image: getImageUrl(req, contactInfo.image),
      },
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

    const data = infos.map((item) => ({
      ...item._doc,
      image: getImageUrl(req, item.image),
    }));

    res.status(200).json({
      success: true,
      data,
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
      data: {
        ...info._doc,
        image: getImageUrl(req, info.image),
      },
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
      const oldImageName = info.image.split("/").pop();
      const oldImagePath = path.join(
        __dirname,
        "../uploads/contactinfo",
        oldImageName
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      info.image = req.file.filename;
    }

    info.title = title || info.title;
    info.description = description || info.description;
    info.link = link || info.link;

    await info.save();

    res.status(200).json({
      success: true,
      message: "ContactInfo updated successfully",
      data: {
        ...info._doc,
        image: getImageUrl(req, info.image),
      },
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

    const imageName = info.image.split("/").pop();
    const imagePath = path.join(__dirname, "../uploads/contactinfo", imageName);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
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
