const express = require("express");
const router = express.Router();
const statesController = require("../controllers/statesController");

router.post("/create", statesController.createState);          // Add state
router.get("/", statesController.getStates);             // Get all states
router.get("/:key", statesController.getStateByKey);     // Get state by key

module.exports = router;
