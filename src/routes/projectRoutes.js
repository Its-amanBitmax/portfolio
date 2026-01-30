const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { uploadProjects } = require("../middleware/upload"); // multer middleware

router.post("/create", uploadProjects.single("image"), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", uploadProjects.single("image"), updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
