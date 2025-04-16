// server/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getComments,
  getMoreReplies,
  createComment,
  updateComment,
  deleteComment,
  voteComment,
  getDiscussionComments,
  getDiscussionCommentReplies,
  createDiscussionComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

// Post comments
router.route("/:postId").get(getComments).post(protect, createComment);

router.route("/:postId/:commentId/replies").get(getMoreReplies);

// Discussion comments
router
  .route("/discussions/:discussionId")
  .get(getDiscussionComments)
  .post(protect, createDiscussionComment);

router
  .route("/discussions/:discussionId/:commentId/replies")
  .get(getDiscussionCommentReplies);

// Comment management (works for both post and discussion comments)
router.route("/:id").put(protect, updateComment).delete(protect, deleteComment);

router.route("/:id/vote").post(protect, voteComment);

module.exports = router;
