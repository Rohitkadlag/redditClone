// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getUserPosts,
  getUserComments,
  updateProfile,
  followUser,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUserSubreddits,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// User profile routes
router.get("/:username", getUserProfile);
router.get("/:username/posts", getUserPosts);
router.get("/:username/comments", getUserComments);
router.post("/:username/follow", protect, followUser);
router.get("/me/subreddits", protect, getUserSubreddits);

// User profile update
router.put("/profile", protect, updateProfile);

// Notification routes
router.get("/notifications", protect, getNotifications);
router.put("/notifications/:id", protect, markNotificationRead);
router.put("/notifications", protect, markAllNotificationsRead);
router.delete("/notifications/:id", protect, deleteNotification);

module.exports = router;
