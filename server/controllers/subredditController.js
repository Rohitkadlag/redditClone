// server/controllers/subredditController.js
const Subreddit = require("../models/Subreddit");
const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require("mongoose");
// @desc    Get all subreddits with optional filtering
// @route   GET /api/subreddits
// @access  Public
exports.getSubreddits = async (req, res, next) => {
  try {
    // Build query
    let query = {};

    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    // Filter private subreddits for non-members
    if (req.user) {
      // If user is logged in, only filter private subreddits they don't follow
      query.$or = [
        { isPrivate: { $ne: true } },
        {
          isPrivate: true,
          $or: [{ creator: req.user._id }, { moderators: req.user._id }],
        },
        {
          isPrivate: true,
          _id: { $in: req.user.followedSubreddits },
        },
      ];
    } else {
      // If not logged in, filter all private subreddits
      query.isPrivate = { $ne: true };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort options
    let sortOptions = {};
    const sortBy = req.query.sortBy || "subscribers";

    switch (sortBy) {
      case "new":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "subscribers":
      default:
        sortOptions = { subscribers: -1 };
        break;
    }

    // Execute query with pagination
    const total = await Subreddit.countDocuments(query);

    const subreddits = await Subreddit.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(sortOptions)
      .populate("creator", "username")
      .populate("moderators", "username")
      .lean();

    // Add join status for logged-in users
    if (req.user) {
      subreddits.forEach((subreddit) => {
        subreddit.isJoined = req.user.followedSubreddits.some(
          (id) => id.toString() === subreddit._id.toString()
        );

        subreddit.isModerator =
          subreddit.creator._id.toString() === req.user._id.toString() ||
          subreddit.moderators.some(
            (mod) => mod._id.toString() === req.user._id.toString()
          );
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
      count: subreddits.length,
      pagination,
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

// // @desc    Get single subreddit
// // @route   GET /api/subreddits/:id
// // @access  Public (unless private)
// exports.getSubreddit = async (req, res, next) => {
//   try {
//     const subredditId = req.params.id;

//     // Find by id or slug
//     const subreddit = await Subreddit.findOne({
//       $or: [{ _id: subredditId }, { slug: subredditId }],
//     })
//       .populate("creator", "username avatar")
//       .populate("moderators", "username avatar")
//       .lean();

//     if (!subreddit) {
//       return res.status(404).json({
//         success: false,
//         message: "Subreddit not found",
//       });
//     }

//     // Check if private and user has access
//     if (subreddit.isPrivate) {
//       if (!req.user) {
//         return res.status(403).json({
//           success: false,
//           message: "This is a private community",
//         });
//       }

//       const isMember = req.user.followedSubreddits.includes(subreddit._id);
//       const isModerator =
//         subreddit.creator._id.toString() === req.user._id.toString() ||
//         subreddit.moderators.some(
//           (mod) => mod._id.toString() === req.user._id.toString()
//         );

//       if (!isMember && !isModerator && !req.user.isAdmin) {
//         return res.status(403).json({
//           success: false,
//           message: "This is a private community",
//         });
//       }
//     }

//     // Add join status for logged-in users
//     if (req.user) {
//       subreddit.isJoined = req.user.followedSubreddits.includes(subreddit._id);
//       subreddit.isModerator =
//         subreddit.creator._id.toString() === req.user._id.toString() ||
//         subreddit.moderators.some(
//           (mod) => mod._id.toString() === req.user._id.toString()
//         );
//     }

//     res.status(200).json({
//       success: true,
//       data: subreddit,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// @desc    Get single subreddit
// @route   GET /api/subreddits/:id
// @access  Public (unless private)
exports.getSubreddit = async (req, res, next) => {
  try {
    const subredditId = req.params.id;
    let subreddit;

    // First try to find by mongoose ObjectId if valid
    if (mongoose.Types.ObjectId.isValid(subredditId)) {
      subreddit = await Subreddit.findById(subredditId)
        .populate("creator", "username avatar")
        .populate("moderators", "username avatar")
        .lean();
    }

    // If not found by id, try to find by slug
    if (!subreddit) {
      subreddit = await Subreddit.findOne({ slug: subredditId })
        .populate("creator", "username avatar")
        .populate("moderators", "username avatar")
        .lean();
    }

    if (!subreddit) {
      return res.status(404).json({
        success: false,
        message: "Subreddit not found",
      });
    }

    // Check if private and user has access
    if (subreddit.isPrivate) {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: "This is a private community",
        });
      }

      const isMember = req.user.followedSubreddits.some(
        (id) => id.toString() === subreddit._id.toString()
      );

      const isModerator =
        subreddit.creator._id.toString() === req.user._id.toString() ||
        subreddit.moderators.some(
          (mod) => mod._id.toString() === req.user._id.toString()
        );

      if (!isMember && !isModerator && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "This is a private community",
        });
      }
    }

    // Add join status for logged-in users
    if (req.user) {
      // IMPORTANT: This is the key fix - accurately determine if user has joined
      const user = await User.findById(req.user._id);

      if (user) {
        subreddit.isJoined = user.followedSubreddits.some(
          (id) => id.toString() === subreddit._id.toString()
        );

        subreddit.isModerator =
          subreddit.creator._id.toString() === req.user._id.toString() ||
          subreddit.moderators.some(
            (mod) => mod._id.toString() === req.user._id.toString()
          );

        console.log(
          `User ${user.username} isJoined status for r/${subreddit.name}: ${subreddit.isJoined}`
        );
      }
    } else {
      subreddit.isJoined = false;
    }

    res.status(200).json({
      success: true,
      data: subreddit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create new subreddit
// @route   POST /api/subreddits
// @access  Private
exports.createSubreddit = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Check if name is already taken
    const existingSubreddit = await Subreddit.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingSubreddit) {
      return res.status(400).json({
        success: false,
        message: "A subreddit with that name already exists",
      });
    }

    // Create subreddit
    const subreddit = await Subreddit.create({
      name,
      description,
      creator: req.user._id,
      moderators: [req.user._id],
    });

    // Add subreddit to user's followed subreddits
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { followedSubreddits: subreddit._id },
    });

    // Update subscriber count
    await subreddit.updateSubscriberCount();

    res.status(201).json({
      success: true,
      data: subreddit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update subreddit
// @route   PUT /api/subreddits/:id
// @access  Private (mod/admin only)
exports.updateSubreddit = async (req, res, next) => {
  try {
    const subredditId = req.params.id;
    const {
      description,
      sidebar,
      icon,
      banner,
      rules,
      flairs,
      isPrivate,
      isRestricted,
      isNSFW,
    } = req.body;

    // Find subreddit
    const subreddit = await Subreddit.findById(subredditId);

    if (!subreddit) {
      return res.status(404).json({
        success: false,
        message: "Subreddit not found",
      });
    }

    // Check if user is moderator or admin
    const isModerator =
      subreddit.creator.toString() === req.user._id.toString() ||
      subreddit.moderators.includes(req.user._id);

    if (!isModerator && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this subreddit",
      });
    }

    // Update fields
    if (description) subreddit.description = description;
    if (sidebar) subreddit.sidebar = sidebar;
    if (icon) subreddit.icon = icon;
    if (banner) subreddit.banner = banner;
    if (rules) subreddit.rules = rules;
    if (flairs) subreddit.flairs = flairs;

    // Only the creator or admin can change these settings
    if (
      subreddit.creator.toString() === req.user._id.toString() ||
      req.user.isAdmin
    ) {
      if (typeof isPrivate !== "undefined") subreddit.isPrivate = isPrivate;
      if (typeof isRestricted !== "undefined")
        subreddit.isRestricted = isRestricted;
      if (typeof isNSFW !== "undefined") subreddit.isNSFW = isNSFW;
    }

    await subreddit.save();

    res.status(200).json({
      success: true,
      data: subreddit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Join/leave subreddit
// @route   POST /api/subreddits/:id/join
// @access  Private
exports.joinLeaveSubreddit = async (req, res, next) => {
  try {
    const subredditId = req.params.id;
    const { action } = req.body;

    // Validate action
    if (action !== "join" && action !== "leave") {
      return res.status(400).json({
        success: false,
        message: "Action must be either 'join' or 'leave'",
      });
    }

    // Find the subreddit
    const subreddit = await Subreddit.findById(subredditId);
    if (!subreddit) {
      return res.status(404).json({
        success: false,
        message: "Subreddit not found",
      });
    }

    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already following/not following
    const alreadyFollowing = user.followedSubreddits.some(
      (id) => id.toString() === subredditId
    );

    // Only perform action if necessary
    if (action === "join" && !alreadyFollowing) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { followedSubreddits: subredditId },
      });
    } else if (action === "leave" && alreadyFollowing) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { followedSubreddits: subredditId },
      });
    }

    // Update subscriber count
    await subreddit.updateSubscriberCount();

    // Get updated subreddit
    const updatedSubreddit = await Subreddit.findById(subredditId);

    // Get updated user to check if now following
    const updatedUser = await User.findById(req.user._id);
    const isFollowing = updatedUser.followedSubreddits.some(
      (id) => id.toString() === subredditId
    );

    res.status(200).json({
      success: true,
      data: {
        action,
        isJoined: isFollowing,
        subscribers: updatedSubreddit.subscribers,
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

// @desc    Manage moderators
// @route   POST /api/subreddits/:id/moderators
// @access  Private (creator/admin only)
exports.manageSubredditModerators = async (req, res, next) => {
  try {
    const subredditId = req.params.id;
    const { action, username } = req.body;

    if (!["add", "remove"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    // Find subreddit
    const subreddit = await Subreddit.findById(subredditId);

    if (!subreddit) {
      return res.status(404).json({
        success: false,
        message: "Subreddit not found",
      });
    }

    // Check if user is creator or admin
    if (
      subreddit.creator.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to manage moderators",
      });
    }

    // Find user to add/remove as moderator
    const userToModify = await User.findOne({ username });

    if (!userToModify) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (action === "add") {
      // Add user as moderator
      subreddit.addModerator(userToModify._id);

      // Add subreddit to user's followed subreddits if not already following
      if (!userToModify.followedSubreddits.includes(subredditId)) {
        userToModify.followedSubreddits.push(subredditId);
        await userToModify.save();
      }

      // Notify the user
      await userToModify.addNotification(
        "mod",
        `You are now a moderator of r/${subreddit.name}`,
        { subredditId }
      );
    } else {
      // Remove user as moderator
      subreddit.removeModerator(userToModify._id);

      // Notify the user
      await userToModify.addNotification(
        "mod",
        `You are no longer a moderator of r/${subreddit.name}`,
        { subredditId }
      );
    }

    await subreddit.save();

    res.status(200).json({
      success: true,
      data: {
        action,
        username,
        moderators: await User.find(
          { _id: { $in: subreddit.moderators } },
          "username avatar"
        ),
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

// @desc    Check if user is a member of a subreddit
// @route   GET /api/subreddits/:id/check-membership
// @access  Private
exports.checkMembership = async (req, res, next) => {
  try {
    const subredditId = req.params.id;

    // If not logged in, return false
    if (!req.user) {
      return res.status(200).json({
        success: true,
        isJoined: false,
      });
    }

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user follows this subreddit
    const isJoined = user.followedSubreddits.some(
      (id) => id.toString() === subredditId
    );

    res.status(200).json({
      success: true,
      isJoined,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get subreddit stats
// @route   GET /api/subreddits/:id/stats
// @access  Public (unless private)
exports.getSubredditStats = async (req, res, next) => {
  try {
    const subredditId = req.params.id;

    // Find subreddit
    const subreddit = await Subreddit.findById(subredditId);

    if (!subreddit) {
      return res.status(404).json({
        success: false,
        message: "Subreddit not found",
      });
    }

    // Check if private
    if (subreddit.isPrivate) {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: "This is a private community",
        });
      }

      const isMember = req.user.followedSubreddits.includes(subreddit._id);
      const isModerator =
        subreddit.creator.toString() === req.user._id.toString() ||
        subreddit.moderators.includes(req.user._id);

      if (!isMember && !isModerator && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "This is a private community",
        });
      }
    }

    // Get post count
    const postCount = await Post.countDocuments({ subreddit: subredditId });

    // Get top posts
    const topPosts = await Post.find({ subreddit: subredditId })
      .sort({ score: -1 })
      .limit(5)
      .populate("author", "username")
      .select("title score commentCount createdAt")
      .lean();

    // Get most active users (by post count)
    const mostActiveUsers = await Post.aggregate([
      { $match: { subreddit: subreddit._id } },
      { $group: { _id: "$author", postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
    ]);

    // Populate user details
    const activeUserIds = mostActiveUsers.map((user) => user._id);
    const activeUsers = await User.find({ _id: { $in: activeUserIds } }).select(
      "username avatar"
    );

    // Map user details back to results
    const activeUsersWithDetails = mostActiveUsers.map((user) => {
      const userDetails = activeUsers.find(
        (u) => u._id.toString() === user._id.toString()
      );
      return {
        user: userDetails,
        postCount: user.postCount,
      };
    });

    // Get growth stats (new members over time)
    // This would require tracking join dates in a real app
    // Simplified version with random data for example
    const growthStats = {
      lastWeek: Math.floor(Math.random() * 100),
      lastMonth: Math.floor(Math.random() * 500),
      total: subreddit.subscribers,
    };

    res.status(200).json({
      success: true,
      data: {
        subscribers: subreddit.subscribers,
        postCount,
        topPosts,
        mostActiveUsers: activeUsersWithDetails,
        growthStats,
        createdAt: subreddit.createdAt,
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
