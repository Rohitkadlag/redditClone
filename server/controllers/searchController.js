// server/controllers/searchController.js
const Post = require("../models/Post");
const User = require("../models/User");
const Subreddit = require("../models/Subreddit");
const Discussion = require("../models/Discussion");
const mongoose = require("mongoose");

// @desc    Search posts
// @route   GET /api/search/posts
// @access  Public
exports.searchPosts = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Create search query
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };

    // Get posts count for pagination
    const totalPosts = await Post.countDocuments(searchQuery);

    // Get posts with pagination
    const posts = await Post.find(searchQuery)
      .sort({ score: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar karma")
      .populate("subreddit", "name slug icon");

    // Add user vote status if user is logged in
    if (req.user) {
      posts.forEach((post) => {
        post.userVote = post.upvotes.includes(req.user._id)
          ? "upvote"
          : post.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Remove upvotes and downvotes arrays for privacy
        post.upvotes = undefined;
        post.downvotes = undefined;
      });
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        page,
        pages: Math.ceil(totalPosts / limit),
        total: totalPosts,
      },
      data: posts,
    });
  } catch (error) {
    console.error("Search posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Search users
// @route   GET /api/search/users
// @access  Public
exports.searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Create search query
    const searchQuery = {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
      ],
    };

    // Get users count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    // Get users with pagination
    const users = await User.find(searchQuery)
      .sort({ karma: -1, username: 1 })
      .skip(skip)
      .limit(limit)
      .select("username avatar bio karma createdAt");

    // Add following status if user is logged in
    if (req.user) {
      const currentUser = await User.findById(req.user._id);
      users.forEach((user) => {
        user.isFollowing = currentUser.followedUsers.includes(user._id);
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        page,
        pages: Math.ceil(totalUsers / limit),
        total: totalUsers,
      },
      data: users,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Search subreddits (communities)
// @route   GET /api/search/subreddits
// @access  Public
exports.searchSubreddits = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Create search query
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
      // Only show public and restricted communities, not private ones
      // unless user is logged in and a member
      isPrivate: false,
    };

    // Get subreddits count for pagination
    const totalSubreddits = await Subreddit.countDocuments(searchQuery);

    // Get subreddits with pagination
    const subreddits = await Subreddit.find(searchQuery)
      .sort({ subscribers: -1, name: 1 })
      .skip(skip)
      .limit(limit)
      .populate("creator", "username")
      .select("name description subscribers createdAt icon");

    // Add joined status if user is logged in
    if (req.user) {
      const currentUser = await User.findById(req.user._id);
      subreddits.forEach((subreddit) => {
        subreddit.isJoined = currentUser.followedSubreddits.includes(
          subreddit._id
        );
      });
    }

    res.status(200).json({
      success: true,
      count: subreddits.length,
      pagination: {
        page,
        pages: Math.ceil(totalSubreddits / limit),
        total: totalSubreddits,
      },
      data: subreddits,
    });
  } catch (error) {
    console.error("Search subreddits error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Search discussions
// @route   GET /api/search/discussions
// @access  Public
exports.searchDiscussions = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Create search query
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };

    // Get discussions count for pagination
    const totalDiscussions = await Discussion.countDocuments(searchQuery);

    // Get discussions with pagination
    const discussions = await Discussion.find(searchQuery)
      .sort({ score: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar karma");

    // Add user vote status if user is logged in
    if (req.user) {
      discussions.forEach((discussion) => {
        discussion.userVote = discussion.upvotes.includes(req.user._id)
          ? "upvote"
          : discussion.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Remove upvotes and downvotes arrays for privacy
        discussion.upvotes = undefined;
        discussion.downvotes = undefined;
      });
    }

    res.status(200).json({
      success: true,
      count: discussions.length,
      pagination: {
        page,
        pages: Math.ceil(totalDiscussions / limit),
        total: totalDiscussions,
      },
      data: discussions,
    });
  } catch (error) {
    console.error("Search discussions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Search all content (combined search)
// @route   GET /api/search
// @access  Public
exports.searchAll = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Limit for each content type
    const limit = 5;

    // Create search queries
    const postQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };

    const userQuery = {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
      ],
    };

    const subredditQuery = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
      isPrivate: false,
    };

    const discussionQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };

    // Execute all searches in parallel
    const [posts, users, subreddits, discussions] = await Promise.all([
      Post.find(postQuery)
        .sort({ score: -1, createdAt: -1 })
        .limit(limit)
        .populate("author", "username avatar karma")
        .populate("subreddit", "name slug icon"),

      User.find(userQuery)
        .sort({ karma: -1, username: 1 })
        .limit(limit)
        .select("username avatar bio karma createdAt"),

      Subreddit.find(subredditQuery)
        .sort({ subscribers: -1, name: 1 })
        .limit(limit)
        .populate("creator", "username")
        .select("name description subscribers createdAt icon"),

      Discussion.find(discussionQuery)
        .sort({ score: -1, createdAt: -1 })
        .limit(limit)
        .populate("author", "username avatar karma"),
    ]);

    // Get counts for all content types
    const [postsCount, usersCount, subredditsCount, discussionsCount] =
      await Promise.all([
        Post.countDocuments(postQuery),
        User.countDocuments(userQuery),
        Subreddit.countDocuments(subredditQuery),
        Discussion.countDocuments(discussionQuery),
      ]);

    // Add joined/following status if user is logged in
    if (req.user) {
      const currentUser = await User.findById(req.user._id);

      // Add user vote status to posts
      posts.forEach((post) => {
        post.userVote = post.upvotes.includes(req.user._id)
          ? "upvote"
          : post.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Remove upvotes and downvotes arrays for privacy
        post.upvotes = undefined;
        post.downvotes = undefined;
      });

      // Add following status to users
      users.forEach((user) => {
        user.isFollowing = currentUser.followedUsers.includes(user._id);
      });

      // Add joined status to subreddits
      subreddits.forEach((subreddit) => {
        subreddit.isJoined = currentUser.followedSubreddits.includes(
          subreddit._id
        );
      });

      // Add user vote status to discussions
      discussions.forEach((discussion) => {
        discussion.userVote = discussion.upvotes.includes(req.user._id)
          ? "upvote"
          : discussion.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Remove upvotes and downvotes arrays for privacy
        discussion.upvotes = undefined;
        discussion.downvotes = undefined;
      });
    }

    res.status(200).json({
      success: true,
      posts: {
        data: posts,
        count: postsCount,
      },
      users: {
        data: users,
        count: usersCount,
      },
      communities: {
        data: subreddits,
        count: subredditsCount,
      },
      discussions: {
        data: discussions,
        count: discussionsCount,
      },
    });
  } catch (error) {
    console.error("Search all error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
