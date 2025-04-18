// server/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const {
  createReport,
  getUserReports,
  cancelReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

// Apply protection middleware to all routes
router.use(protect);

// Report routes
router.post("/", createReport);
router.get("/my-reports", getUserReports);
router.delete("/:id", cancelReport);

module.exports = router;
