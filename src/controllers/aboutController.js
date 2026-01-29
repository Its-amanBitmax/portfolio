// src/controllers/aboutController.js

const About = require('../models/About');

// ----------------------------
// CREATE About with image
// ----------------------------
exports.createAbout = async (req, res) => {
  try {
    const aboutData = { ...req.body };

    // Agar image upload ho gayi ho
    if (req.file) {
      const protocol = req.protocol; // http ya https
      const host = req.get('host'); // localhost:3000
      aboutData.image = `${protocol}://${host}/${req.file.path.replace(/\\/g, '/')}`;
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
    const aboutData = { ...req.body };

    // Agar new image upload hui ho
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get('host');
      aboutData.image = `${protocol}://${host}/${req.file.path.replace(/\\/g, '/')}`;
    }

    const updatedAbout = await About.findByIdAndUpdate(req.params.id, aboutData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAbout) {
      return res.status(404).json({ success: false, message: 'About not found' });
    }

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
    const deletedAbout = await About.findByIdAndDelete(req.params.id);

    if (!deletedAbout) {
      return res.status(404).json({ success: false, message: 'About not found' });
    }

    res.status(200).json({ success: true, message: 'About deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
