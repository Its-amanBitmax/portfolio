const Blog = require("../models/Blog");
const fs = require("fs");
const path = require("path");

// helper to get full image URL
const getImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/blog/${filename}`;
};

// ➕ Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { subject, description, category, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const blog = new Blog({
      subject,
      description,
      category,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      image: req.file.filename,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: {
        ...blog._doc,
        image: getImageUrl(req, blog.image),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    const data = blogs.map(blog => ({
      ...blog._doc,
      image: getImageUrl(req, blog.image),
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get Single Blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        ...blog._doc,
        image: getImageUrl(req, blog.image),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏ Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { subject, description, category, tags } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // agar nayi image upload hui
    if (req.file) {
      const oldImagePath = path.join(__dirname, "../uploads/blog", blog.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      blog.image = req.file.filename;
    }

    blog.subject = subject || blog.subject;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    blog.tags = tags ? tags.split(",").map(tag => tag.trim()) : blog.tags;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: {
        ...blog._doc,
        image: getImageUrl(req, blog.image),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const imagePath = path.join(__dirname, "../uploads/blog", blog.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
