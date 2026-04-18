const express = require("express");
const { createBlog , getBlog , getBlogbyId , deleteBlog , updateBlog , likeBlog , commentBlog} = require("../controllers/blog..controllers");

const {authenticate , authorize} = require("../middleware/auth.middleware")

const router = express.Router();

router.post("/create-blog", authenticate, authorize("admin") , createBlog);
router.get("/get-blog", getBlog);
router.post("/get-blog-id", getBlogbyId);
router.post("/delete-blog", authenticate, authorize("admin"), deleteBlog);
router.post("/update-blog", authenticate, authorize("admin"), updateBlog);
router.post("/like-blog", authenticate, likeBlog);
router.post("/comment-blog", authenticate, commentBlog);

module.exports = router ;
