// server/routes/subredditRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSubreddits,
  getSubreddit,
  createSubreddit,
  updateSubreddit,
  joinLeaveSubreddit,
  manageSubredditModerators,
  getSubredditStats,
  checkMembership,
} = require("../controllers/subredditController");
const { protect, checkSubredditModerator } = require("../middleware/auth");

// Subreddit routes
router.route("/").get(getSubreddits).post(protect, createSubreddit);

router
  .route("/:id")
  .get(getSubreddit)
  .put(protect, checkSubredditModerator, updateSubreddit);

router.route("/:id/join").post(protect, joinLeaveSubreddit);

router.route("/:id/moderators").post(protect, manageSubredditModerators);

router.route("/:id/stats").get(getSubredditStats);

router.route("/:id/check-membership").get(protect, checkMembership);

module.exports = router;
