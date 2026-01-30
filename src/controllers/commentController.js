const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// ➕ Create Comment
exports.createComment = async (req, res) => {
  try {
    const { name, email, website, message, blogId } = req.body;

    if (!name || !email || !message || !blogId) {
      return res.status(400).json({ success: false, message: "All required fields are mandatory" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const comment = new Comment({ name, email, website, message, blogId });
    await comment.save();

    res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get All Comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).populate("blogId", "subject");
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get Single Comment
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("blogId", "subject");
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get Comments for a Specific Blog
exports.getCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏ Update Comment
exports.updateComment = async (req, res) => {
  try {
    const { name, email, website, message } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // Update only provided fields
    comment.name = name || comment.name;
    comment.email = email || comment.email;
    comment.website = website !== undefined ? website : comment.website;
    comment.message = message || comment.message;

    await comment.save();

    res.status(200).json({ success: true, message: "Comment updated successfully", data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    await comment.deleteOne();

    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
