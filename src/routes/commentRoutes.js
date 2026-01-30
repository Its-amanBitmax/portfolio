const express = require("express");
const router = express.Router();

const {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByBlog,
  deleteComment,
} = require("../controllers/commentController");

// ➕ Add Comment
router.post("/create", createComment);

// 📄 Get All Comments
router.get("/", getAllComments);

// 📄 Get Single Comment
router.get("/:id", getCommentById);

// 📄 Get Comments for a Specific Blog
router.get("/blog/:blogId", getCommentsByBlog);

// ❌ Delete Comment
router.delete("/delete/:id", deleteComment);

module.exports = router;
