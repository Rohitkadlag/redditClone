// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getUserDetails,
  updateUserRole,
  unsuspendUser,
  suspendUser,
  getSubreddits,
  getReports,
  resolveReport,
  removePost, // Add this
  removeComment, // Add this
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");

// Admin authorization middleware
const adminOnly = (req, res, next) => {
  if (!req.user || !["admin", "admitty_manager"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin privileges required",
    });
  }
  next();
};

// Apply protection middleware to all routes
router.use(protect);
router.use(adminOnly);

// Dashboard statistics
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/suspend", suspendUser);
router.put("/users/:id/unsuspend", unsuspendUser);

// Subreddit management
router.get("/subreddits", getSubreddits);

// Report management
router.get("/reports", getReports);
router.put("/reports/:id/resolve", resolveReport);

// Content management - Add these routes
router.delete("/posts/:id", removePost);
router.delete("/comments/:id", removeComment);

module.exports = router;
