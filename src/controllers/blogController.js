const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");
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

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog",
    });

    const blog = new Blog({
      subject,
      description,
      category,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      image: result.secure_url,
    });

    await blog.save();

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: blogs });
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
      // Delete old image from Cloudinary if it exists
      if (blog.image && blog.image.includes("cloudinary")) {
        const publicId = blog.image.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog",
      });

      blog.image = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }

    blog.subject = subject || blog.subject;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    blog.tags = tags ? tags.split(",").map(tag => tag.trim()) : blog.tags;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
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

    // Delete image from Cloudinary if it exists
    if (blog.image && blog.image.includes("cloudinary")) {
      const publicId = blog.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
