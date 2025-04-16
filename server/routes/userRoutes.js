// // Update your server/routes/userRoutes.js file to include the account deletion route

// const express = require("express");
// const router = express.Router();
// const {
//   getUserProfile,
//   getUserPosts,
//   getUserComments,
//   updateProfile,
//   followUser,
//   getNotifications,
//   markNotificationRead,
//   markAllNotificationsRead,
//   deleteNotification,
//   getUserSubreddits,
//   deleteAccount, // Add this import
// } = require("../controllers/userController");
// const { protect } = require("../middleware/auth");

// // User profile routes
// router.get("/:username", getUserProfile);
// router.get("/:username/posts", getUserPosts);
// router.get("/:username/comments", getUserComments);
// router.post("/:username/follow", protect, followUser);
// router.get("/me/subreddits", protect, getUserSubreddits);

// // User profile update
// router.put("/profile", protect, updateProfile);

// // Account management
// router.delete("/account", protect, deleteAccount); // Add this new route

// // Notification routes
// router.get("/notifications", protect, getNotifications);
// router.put("/notifications/:id", protect, markNotificationRead);
// router.put("/notifications", protect, markAllNotificationsRead);
// router.delete("/notifications/:id", protect, deleteNotification);

// module.exports = router;

// server/routes/userRoutes.js (updated)
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
  deleteAccount,
  uploadAvatar, // Add this import
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

// New avatar upload route
router.post("/avatar-upload", protect, uploadAvatar);

// Account management
router.delete("/account", protect, deleteAccount);

// Notification routes
router.get("/notifications", protect, getNotifications);
router.put("/notifications/:id", protect, markNotificationRead);
router.put("/notifications", protect, markAllNotificationsRead);
router.delete("/notifications/:id", protect, deleteNotification);

module.exports = router;
