// server/middleware/auth.js (updated)
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is suspended
    if (req.user.isSuspended) {
      // If suspension has an end date and it's in the past, unsuspend the user
      if (
        req.user.suspensionEndDate &&
        new Date(req.user.suspensionEndDate) < new Date()
      ) {
        req.user.isSuspended = false;
        req.user.suspensionReason = undefined;
        req.user.suspensionEndDate = undefined;
        await req.user.save();
      } else {
        return res.status(403).json({
          success: false,
          message: "Your account is currently suspended",
          suspensionReason: req.user.suspensionReason,
          suspensionEndDate: req.user.suspensionEndDate,
        });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user is a moderator of a subreddit
exports.checkSubredditModerator = async (req, res, next) => {
  try {
    const subredditId = req.params.subredditId || req.body.subredditId;

    if (!subredditId) {
      return res.status(400).json({
        success: false,
        message: "Subreddit ID is required",
      });
    }

    // Import Subreddit model here to avoid circular dependency
    const Subreddit = require("../models/Subreddit");

    const subreddit = await Subreddit.findById(subredditId);

    if (!subreddit) {
      return res.status(404).json({
        success: false,
        message: "Subreddit not found",
      });
    }

    // Check if user is moderator, creator, admin, or Admitty Manager
    const isCreator = subreddit.creator.toString() === req.user._id.toString();
    const isModerator = subreddit.moderators.some(
      (mod) => mod.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.isAdmin;
    const isAdmittyManager = req.user.role === "admitty_manager";

    if (!isCreator && !isModerator && !isAdmin && !isAdmittyManager) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to moderate this subreddit",
      });
    }

    // Add subreddit to request
    req.subreddit = subreddit;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Check if user is owner of a resource or has administrative privileges
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;

      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: "Resource ID is required",
        });
      }

      // Dynamically import the model to avoid circular dependencies
      const Model = require(`../models/${model}`);

      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${model} not found`,
        });
      }

      // Check if user is the author/owner
      const isOwner =
        resource.author?.toString() === req.user._id.toString() ||
        resource.creator?.toString() === req.user._id.toString();

      // Check for admin privileges
      const isAdmin = req.user.isAdmin;
      const isAdmittyManager = req.user.role === "admitty_manager";

      if (!isOwner && !isAdmin && !isAdmittyManager) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this resource",
        });
      }

      // Add resource to request
      req.resource = resource;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
};
