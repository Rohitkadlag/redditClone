// server/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  votePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/auth");

// Post routes
router.route("/").get(getPosts).post(protect, createPost);

router
  .route("/:id")
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route("/:id/vote").post(protect, votePost);

module.exports = router;
