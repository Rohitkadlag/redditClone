// server/controllers/userController.js
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username })
      .select("-notifications -resetPasswordToken -resetPasswordExpire")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if current user is following this user
    if (req.user) {
      user.isFollowing = req.user.followedUsers.includes(user._id);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user posts
// @route   GET /api/users/:username/posts
// @access  Public
exports.getUserPosts = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort options
    let sortOptions = {};
    const sortBy = req.query.sortBy || "new";

    switch (sortBy) {
      case "top":
        sortOptions = { score: -1 };
        break;
      case "new":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Get total count
    const total = await Post.countDocuments({ author: user._id });

    // Get posts
    const posts = await Post.find({ author: user._id })
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit)
      .populate("subreddit", "name slug icon")
      .lean();

    // Add vote status if user is logged in
    if (req.user) {
      posts.forEach((post) => {
        post.userVote = post.upvotes.includes(req.user._id)
          ? "upvote"
          : post.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Remove upvotes and downvotes arrays for privacy
        delete post.upvotes;
        delete post.downvotes;
      });
    }

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user comments
// @route   GET /api/users/:username/comments
// @access  Public
exports.getUserComments = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort options
    let sortOptions = {};
    const sortBy = req.query.sortBy || "new";

    switch (sortBy) {
      case "top":
        sortOptions = { score: -1 };
        break;
      case "new":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Get total count
    const total = await Comment.countDocuments({
      author: user._id,
      deleted: { $ne: true },
    });

    // Get comments
    const comments = await Comment.find({
      author: user._id,
      deleted: { $ne: true },
    })
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit)
      .populate("post", "title slug")
      .populate({
        path: "post",
        populate: {
          path: "subreddit",
          select: "name slug icon",
        },
      })
      .lean();

    // Add vote status if user is logged in
    if (req.user) {
      comments.forEach((comment) => {
        comment.userVote = comment.upvotes.includes(req.user._id)
          ? "upvote"
          : comment.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Remove upvotes and downvotes arrays for privacy
        delete comment.upvotes;
        delete comment.downvotes;
      });
    }

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: comments.length,
      pagination,
      data: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { bio, avatar } = req.body;

    // Get user
    const user = await User.findById(req.user._id);

    // Update fields
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Follow/unfollow user
// @route   POST /api/users/:username/follow
// @access  Private
exports.followUser = async (req, res, next) => {
  try {
    const username = req.params.username;
    const { action } = req.body;

    if (!["follow", "unfollow"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    // Get target user
    const targetUser = await User.findOne({ username });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cannot follow yourself
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    // Get current user
    const currentUser = await User.findById(req.user._id);

    if (action === "follow") {
      // Add to followed users if not already following
      if (!currentUser.followedUsers.includes(targetUser._id)) {
        currentUser.followedUsers.push(targetUser._id);

        // Notify target user
        await targetUser.addNotification(
          "follow",
          `${currentUser.username} started following you`,
          { userId: currentUser._id }
        );

        // Send real-time notification
        const io = req.app.get("io");
        io.to(`user:${targetUser._id}`).emit("notification", {
          type: "follow",
          message: `${currentUser.username} started following you`,
          data: { userId: currentUser._id },
        });
      }
    } else {
      // Remove from followed users
      currentUser.followedUsers = currentUser.followedUsers.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );
    }

    await currentUser.save();

    res.status(200).json({
      success: true,
      data: {
        action,
        isFollowing: action === "follow",
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

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Sort notifications by most recent first
    const notifications = user.notifications.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id
// @access  Private
exports.markNotificationRead = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const user = await User.findById(req.user._id);

    // Find the notification
    const notification = user.notifications.id(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Mark as read
    notification.read = true;
    await user.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications
// @access  Private
exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Mark all as read
    user.notifications.forEach((notification) => {
      notification.read = true;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user's followed subreddits
// @route   GET /api/users/me/subreddits
// @access  Private
exports.getUserSubreddits = async (req, res, next) => {
  try {
    // Find user with their followed subreddits
    const user = await User.findById(req.user._id)
      .populate({
        path: "followedSubreddits",
        select: "name slug icon subscribers",
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return followed subreddits
    res.status(200).json({
      success: true,
      count: user.followedSubreddits.length,
      data: user.followedSubreddits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/users/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const user = await User.findById(req.user._id);

    // Remove notification
    user.notifications.pull(notificationId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
