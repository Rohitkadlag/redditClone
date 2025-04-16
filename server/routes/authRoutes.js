// Update your server/routes/authRoutes.js file to include the new password update route

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword, // Add this import
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/password", protect, updatePassword); // Add this new route

module.exports = router;
