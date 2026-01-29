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

  

    const state = await State.create({ key, value });
    res.json({ success: true, data: state });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all states


// GET state by key

