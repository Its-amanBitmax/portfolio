const State = require("../models/states");

// CREATE new state
exports.createState = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || !value) {
      return res
        .status(400)
        .json({ success: false, message: "key and value are required" });
    }

    const existing = await State.findOne({ key });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "State key already exists" });
    }

    const state = await State.create({ key, value });
    res.json({ success: true, data: state });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all states
exports.getStates = async (req, res) => {
  try {
    const states = await State.find().sort({ value: 1 });
    res.json({ success: true, data: states });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET state by key
exports.getStateByKey = async (req, res) => {
  try {
    const state = await State.findOne({ key: req.params.key });
    if (!state)
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    res.json({ success: true, data: state });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
