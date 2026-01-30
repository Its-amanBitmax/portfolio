const express = require("express");
const router = express.Router();

const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const { uploadTestimonials } = require("../middleware/upload");

router.post("/create", uploadTestimonials.single("image"), createTestimonial);
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialById);
router.put("/:id", uploadTestimonials.single("image"), updateTestimonial);
router.delete("/:id", deleteTestimonial);

module.exports = router;
