const express = require("express");
const router = express.Router();
const statesController = require("../controllers/statesController");

router.post("/create", statesController.createState);          // Add state
router.get("/", statesController.getStates);             // Get all states
     

module.exports = router;
