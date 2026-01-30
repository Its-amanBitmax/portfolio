const express = require("express");
const router = express.Router();

const {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByBlog,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

// ➕ Create Comment
router.post("/create", createComment);

// 📄 Get All Comments
router.get("/", getAllComments);

// 📄 Get Single Comment
router.get("/:id", getCommentById);

// 📄 Get Comments by Blog
router.get("/blog/:blogId", getCommentsByBlog);

// ✏ Update Comment
router.put("/:id", updateComment);

// ❌ Delete Comment
router.delete("/:id", deleteComment);

module.exports = router;
