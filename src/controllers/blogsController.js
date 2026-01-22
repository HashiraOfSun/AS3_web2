const mongoose = require("mongoose");
const Blog = require("../models/Blog");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.createBlog = async (req, res, next) => {
  try {
    const { title, body, author } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ error: "title and body are required" });
    }
    const blog = await Blog.create({ title, body, author });
    res.status(201).json(blog);
  } catch (e) {
    next(e);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (e) {
    next(e);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "blog not found" });

    res.json(blog);
  } catch (e) {
    next(e);
  }
};

exports.updateBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

    const { title, body, author } = req.body || {};
    if (title === "" || body === "") {
      return res.status(400).json({ error: "title and body cannot be empty" });
    }

    const update = {};
    if (title !== undefined) update.title = title;
    if (body !== undefined) update.body = body;
    if (author !== undefined) update.author = author;

    const blog = await Blog.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!blog) return res.status(404).json({ error: "blog not found" });
    res.json(blog);
  } catch (e) {
    next(e);
  }
};

exports.deleteBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ error: "blog not found" });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
