const express = require("express");
const router = express.Router();
const { uploadBlog } = require("../middleware/upload");

const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

// ➕ Create Blog (image required)
router.post("/create", uploadBlog.single("image"), createBlog);

// 📄 Get All Blogs
router.get("/", getAllBlogs);

// 📄 Get Single Blog by ID
router.get("/:id", getBlogById);

// ✏ Update Blog (optional new image)
router.put("/:id", uploadBlog.single("image"), updateBlog);

// ❌ Delete Blog
router.delete("/:id", deleteBlog);

module.exports = router;
