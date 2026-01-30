const express = require("express");
const router = express.Router();

const {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const { uploadSkills } = require("../middleware/upload"); // tumhari multer file

// routes
router.post("/create", uploadSkills.single("image"), createSkill);
router.get("/", getAllSkills);
router.get("/:id", getSkillById);
router.put("/:id", uploadSkills.single("image"), updateSkill);
router.delete("/:id", deleteSkill);

module.exports = router;
