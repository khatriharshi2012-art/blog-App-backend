const Blog = require("../models/blog.models");

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({
        status: false,
        message: "title and content are required fields",
      });
    }

    const newBlog = await Blog.create({
      title,
      content,
      author: req.user.id,
    });

    return res.status(201).json({
      status: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.log("createBlog error:", error);

    return res.status(500).json({
      status: false,
      message: error?.message || "Internal server error",
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.find({})
      .populate("author", "name")
      .populate("comments.user")
      .sort({ createdAt: -1 });

    if (blog?.length > 0) {
      return res.status(200).json({
        status: true,
        message: "blog fetched successfully",
        data: blog,
      });
    }

    return res.status(200).json({
      status: true,
      message: "blog Not found",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error?.message || "Internal server error",
    });
  }
};

exports.getBlogbyId = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(200).json({
        status: true,
        message: "Id is required",
      });
    }

    const result = await Blog.findById(id)
      .populate("author", "name")
      .populate("comments.user");

    if (result) {
      return res.status(200).json({
        status: true,
        message: "blog Found by id.",
        data: result,
      });
    }

    return res.status(200).json({
      status: true,
      message: "blog Not Found.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error?.message || "Internal server error",
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findByIdAndDelete(id);

    if (blog) {
      return res.status(200).json({
        status: true,
        message: "Blog deleted succesfully.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Blog Not Found.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error?.message || "Internal server error",
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id, ...updates } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Blog id is required",
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one field is required to update the blog",
      });
    }

    const blog = await Blog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (blog) {
      return res.status(200).json({
        status: true,
        message: "Blog updated succesfully.",
        data: blog,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Blog Not Found.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error?.message || "Internal server error",
    });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Blog id is required" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.likes.includes(req.user.id)) {
      blog.likes.push(req.user.id);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      likes: blog.likes.length,
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.commentBlog = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id, text } = req.body;

    if (!id || !text) {
      return res.status(400).json({ message: "Blog id and text are required" });
    }

    let blog = await Blog.findById(id)
      .populate("author", "name")
      .populate("comments.user", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({
      user: req.user.id,
      text,
    });

    await blog.save();
    blog = await Blog.findById(id)
      .populate("author", "name")
      .populate("comments.user");

    res.status(200).json({
      success: true,
      message: "Comment added",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
