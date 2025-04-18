// server/controllers/adminController.js
const User = require("../models/User");
const Subreddit = require("../models/Subreddit");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Report = require("../models/Report"); // You'll need to create this model

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access admin dashboard",
      });
    }

    // Get current date and 24 hours ago for "today" stats
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // User stats
    const userCount = await User.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: yesterday },
    });

    // Community stats
    const communityCount = await Subreddit.countDocuments();
    const activeCommunitiesToday = await Post.distinct("subreddit", {
      createdAt: { $gte: yesterday },
    }).then((ids) => ids.length);

    // Post stats
    const postCount = await Post.countDocuments();
    const postsToday = await Post.countDocuments({
      createdAt: { $gte: yesterday },
    });

    // Comment stats
    const commentCount = await Comment.countDocuments();
    const commentsToday = await Comment.countDocuments({
      createdAt: { $gte: yesterday },
    });

    // Report stats (if you have a Report model)
    const reportCount = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      data: {
        userCount,
        newUsersToday,
        communityCount,
        activeCommunitiesToday,
        postCount,
        postsToday,
        commentCount,
        commentsToday,
        reportCount,
        pendingReports,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get users for admin
// @route   GET /api/admin/users
// @access  Private (admin only)
exports.getUsers = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access user management",
      });
    }

    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const search = req.query.search || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order;

    // Get total count
    const total = await User.countDocuments(searchQuery);

    // Get users with pagination and sorting
    const users = await User.find(searchQuery)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .select("username email role karma isSuspended createdAt avatar");

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single user details for admin
// @route   GET /api/admin/users/:id
// @access  Private (admin only)
exports.getUserDetails = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access user details",
      });
    }

    const user = await User.findById(req.params.id)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("followedSubreddits", "name subscribers")
      .populate("moderatedSubreddits", "name subscribers");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get post count
    const postCount = await Post.countDocuments({ author: user._id });

    // Get comment count
    const commentCount = await Comment.countDocuments({ author: user._id });

    // Get report count filed against this user
    const reportCount = await Report.countDocuments({
      targetType: "user",
      targetId: user._id,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          postCount,
          commentCount,
          reportCount,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update user roles",
      });
    }

    const { role } = req.body;

    // Validate role
    if (!["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    // Admitty Manager can't create another Admitty Manager
    if (role === "admitty_manager" && req.user.role !== "admitty_manager") {
      return res.status(403).json({
        success: false,
        message: "Only Admitty Managers can create other Admitty Managers",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow changing the role of Admitty Managers unless you're also an Admitty Manager
    if (
      user.role === "admitty_manager" &&
      req.user.role !== "admitty_manager"
    ) {
      return res.status(403).json({
        success: false,
        message: "Cannot modify the role of an Admitty Manager",
      });
    }

    // Update the role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Suspend a user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (admin only)
exports.suspendUser = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to suspend users",
      });
    }

    const { reason, duration } = req.body; // duration in days

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow suspending Admitty Managers or Admins
    if (["admin", "admitty_manager"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Cannot suspend administrators",
      });
    }

    // Set suspension details
    user.isSuspended = true;
    user.suspensionReason = reason || "Violation of community guidelines";

    // Set suspension end date if duration is provided
    if (duration) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);
      user.suspensionEndDate = endDate;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        isSuspended: user.isSuspended,
        suspensionReason: user.suspensionReason,
        suspensionEndDate: user.suspensionEndDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get subreddits for admin
// @route   GET /api/admin/subreddits
// @access  Private (admin only)
exports.getSubreddits = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access community management",
      });
    }

    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const search = req.query.search || "";
    const sort = req.query.sort || "subscribers";
    const order = req.query.order === "asc" ? 1 : -1;

    // Build search query
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order;

    // Get total count
    const total = await Subreddit.countDocuments(searchQuery);

    // Get communities with pagination and sorting
    const subreddits = await Subreddit.find(searchQuery)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .populate("creator", "username")
      .select(
        "name subscribers isPrivate isRestricted isNSFW createdAt icon description"
      );

    res.status(200).json({
      success: true,
      count: subreddits.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: subreddits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get reports for admin
// @route   GET /api/admin/reports
// @access  Private (admin only)
exports.getReports = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access reports",
      });
    }

    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const status = req.query.status || "pending"; // default to pending reports
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    // Build query
    const query = { status };

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order;

    // Get total count
    const total = await Report.countDocuments(query);

    // Get reports with pagination and sorting
    const reports = await Report.find(query)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .populate("reportedBy", "username")
      .populate("resolvedBy", "username");

    res.status(200).json({
      success: true,
      count: reports.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Unsuspend a user
// @route   PUT /api/admin/users/:id/unsuspend
// @access  Private (admin only)
exports.unsuspendUser = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to unsuspend users",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove suspension
    user.isSuspended = false;
    user.suspensionReason = undefined;
    user.suspensionEndDate = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        isSuspended: user.isSuspended,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Remove a post
// @route   DELETE /api/admin/posts/:id
// @access  Private (admin only)
exports.removePost = async (req, res) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove posts",
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason for removal is required",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Mark post as removed
    post.isRemoved = true;
    post.removedReason = reason;
    post.removedBy = req.user._id;
    post.removedAt = Date.now();
    post.content = "[This post was removed by a moderator]";

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post removed successfully",
    });
  } catch (error) {
    console.error("Error removing post:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Remove a comment
// @route   DELETE /api/admin/comments/:id
// @access  Private (admin only)
exports.removeComment = async (req, res) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove comments",
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason for removal is required",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Mark comment as removed
    comment.isRemoved = true;
    comment.content = "[This comment was removed by a moderator]";
    comment.removedReason = reason;
    comment.removedBy = req.user._id;
    comment.removedAt = Date.now();

    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment removed successfully",
    });
  } catch (error) {
    console.error("Error removing comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Resolve a report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private (admin only)
exports.resolveReport = async (req, res, next) => {
  try {
    // Make sure only admins and admitty managers can access this
    if (!["admin", "admitty_manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to resolve reports",
      });
    }

    const { resolution, action } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Update report status
    report.status = "resolved";
    report.resolution = resolution || "No action needed";
    report.resolvedBy = req.user._id;
    report.resolvedAt = Date.now();
    report.actionTaken = action || "none";

    await report.save();

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = exports;
