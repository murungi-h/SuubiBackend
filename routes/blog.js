const express = require("express");
const router = express.Router();
const {
  getBlogs,
  addBlog,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog");

router.route("/").get(getBlogs).post(addBlog);
router.route("/:id").get(getBlog).patch(updateBlog).delete(deleteBlog);

module.exports = router;
