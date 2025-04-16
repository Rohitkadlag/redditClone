// server/routes/searchRoutes.js
const express = require("express");
const router = express.Router();
const {
  searchPosts,
  searchUsers,
  searchSubreddits,
  searchDiscussions,
  searchAll,
} = require("../controllers/searchController");
const { protect } = require("../middleware/auth");

// Authentication middleware to check if user is logged in
// If not, continue but without user-specific data
const optionalAuth = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next();
  }

  try {
    protect(req, res, next);
  } catch (error) {
    // Continue even if authentication fails
    next();
  }
};

// Search routes
router.get("/", optionalAuth, searchAll);
router.get("/posts", optionalAuth, searchPosts);
router.get("/users", optionalAuth, searchUsers);
router.get("/subreddits", optionalAuth, searchSubreddits);
router.get("/discussions", optionalAuth, searchDiscussions);
router.get("/", searchAll); // Combined search endpoint

module.exports = router;
