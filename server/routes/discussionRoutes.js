// server/routes/discussionRoutes.js
const express = require("express");
const router = express.Router();
const {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  voteDiscussion,
} = require("../controllers/discussionController");
const { protect } = require("../middleware/auth");

// Discussion routes
router.route("/").get(getDiscussions).post(protect, createDiscussion);

router
  .route("/:id")
  .get(getDiscussion)
  .put(protect, updateDiscussion)
  .delete(protect, deleteDiscussion);

router.route("/:id/vote").post(protect, voteDiscussion);

module.exports = router;
