const Blog = require("../models/blog");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("./helper");

const getBlog = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid id" });
  }
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide id" });
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `No blog with id : ${id}` });
  }
  res.status(StatusCodes.OK).json({ blog });
};

const getBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  if (blogs.length < 1) {
    return res.status(StatusCodes.OK).json({ blogs: [] });
  }
  res.status(StatusCodes.OK).json({ blogs });
};

const addBlog = async (req, res) => {
  const { title, content, author, date, facilityId } = req.body;
  if (!title || !content || !author || !date || !facilityId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide blog body" });
  }
  if (!isValidObjectId(facilityId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid facility id" });
  }
  const newBlog = new Blog({
    title,
    content,
    author,
    date,
    facilityId: new mongoose.Types.ObjectId(facilityId),
  });
  const savedBlog = await newBlog.save();
  if (!savedBlog) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error adding blog" });
  }
  res.status(StatusCodes.CREATED).json({ blog: savedBlog });
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { author, title, content, date } = req.body;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide id" });
  }
  if (!title && !content && !author && !date) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide blog body" });
  }
  if (!isValidObjectId(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid id" });
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (author !== undefined) updateData.author = author;
  if (date !== undefined) updateData.date = date;
  const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!updatedBlog) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Blog not found" });
  }
  res.status(StatusCodes.OK).json({ blog: updatedBlog });
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide id" });
  }
  if (!isValidObjectId(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid id" });
  }
  const deletedBlog = await Blog.findByIdAndDelete(id);
  if (!deletedBlog) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Blog not found" });
  }
  res.status(StatusCodes.OK).json({ blog: deletedBlog });
};

module.exports = {
  getBlog,
  getBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
};
