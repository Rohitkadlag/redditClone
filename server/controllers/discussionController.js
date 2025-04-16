// server/controllers/discussionController.js
const Discussion = require("../models/Discussion");
const User = require("../models/User");

// @desc    Get all discussions with pagination
// @route   GET /api/discussions
// @access  Public
exports.getDiscussions = async (req, res, next) => {
  try {
    // Build query
    let query = {};

    // Filter by author if provided
    if (req.query.author) {
      const author = await User.findOne({ username: req.query.author });
      if (author) {
        query.author = author._id;
      }
    }

    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sort options
    let sortOptions = {};
    const sortBy = req.query.sortBy || "new";

    switch (sortBy) {
      case "top":
        sortOptions = { score: -1 };
        break;
      case "active":
        sortOptions = { commentCount: -1, createdAt: -1 };
        break;
      case "new":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Execute query with pagination
    const total = await Discussion.countDocuments(query);

    const discussions = await Discussion.find(query)
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit)
      .populate("author", "username avatar karma")
      .lean();

    // Add vote status if user is logged in
    if (req.user) {
      discussions.forEach((discussion) => {
        discussion.userVote = discussion.upvotes.includes(req.user._id)
          ? "upvote"
          : discussion.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Remove upvotes and downvotes arrays for privacy
        delete discussion.upvotes;
        delete discussion.downvotes;
      });
    }

    // Pagination result
    const pagination = {
      page,
      pages: Math.ceil(total / limit),
    };

    res.status(200).json({
      success: true,
      count: discussions.length,
      pagination,
      total,
      data: discussions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get a single discussion with comments
// @route   GET /api/discussions/:id
// @access  Public
exports.getDiscussion = async (req, res, next) => {
  try {
    const discussionId = req.params.id;

    // Find discussion by id or slug
    const discussion = await Discussion.findOne({
      $or: [{ _id: discussionId }, { slug: discussionId }],
    })
      .populate("author", "username avatar karma")
      .lean();

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Add user vote status if logged in
    if (req.user) {
      discussion.userVote = discussion.upvotes.includes(req.user._id)
        ? "upvote"
        : discussion.downvotes.includes(req.user._id)
        ? "downvote"
        : null;

      // Remove upvotes and downvotes arrays for privacy
      delete discussion.upvotes;
      delete discussion.downvotes;
    }

    // Increment view count in background (don't await)
    Discussion.findByIdAndUpdate(discussion._id, {
      $inc: { viewCount: 1 },
    }).exec();

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Create discussion
    const discussion = await Discussion.create({
      title,
      content,
      author: req.user._id,
    });

    // Populate author info
    await discussion.populate("author", "username avatar karma");

    // Notify with socket.io for real-time updates
    const io = req.app.get("io");
    io.emit("newDiscussion", {
      discussion: {
        _id: discussion._id,
        title: discussion.title,
        author: discussion.author,
        createdAt: discussion.createdAt,
        commentCount: 0,
        score: 0,
      },
    });

    res.status(201).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update a discussion
// @route   PUT /api/discussions/:id
// @access  Private (owner only)
exports.updateDiscussion = async (req, res, next) => {
  try {
    const discussionId = req.params.id;
    const { title, content } = req.body;

    let discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Check ownership
    if (
      discussion.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this discussion",
      });
    }

    // Check if discussion is locked
    if (discussion.isLocked) {
      return res.status(403).json({
        success: false,
        message: "Discussion is locked and cannot be updated",
      });
    }

    // Update fields
    if (title) discussion.title = title;
    if (content) discussion.content = content;
    discussion.updatedAt = Date.now();

    await discussion.save();

    // Populate for response
    await discussion.populate("author", "username avatar karma");

    // Notify with socket.io
    const io = req.app.get("io");
    io.emit("discussionUpdated", {
      _id: discussion._id,
      title: discussion.title,
      content: discussion.content,
      updatedAt: discussion.updatedAt,
    });

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Private (owner or admin only)
exports.deleteDiscussion = async (req, res, next) => {
  try {
    const discussionId = req.params.id;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Check ownership
    if (
      discussion.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this discussion",
      });
    }

    await discussion.deleteOne();

    // Notify with socket.io
    const io = req.app.get("io");
    io.emit("discussionDeleted", {
      _id: discussion._id,
    });

    res.status(200).json({
      success: true,
      message: "Discussion deleted",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Vote on a discussion (upvote/downvote)
// @route   POST /api/discussions/:id/vote
// @access  Private
exports.voteDiscussion = async (req, res, next) => {
  try {
    const { voteType } = req.body;
    const discussionId = req.params.id;

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vote type",
      });
    }

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Get current vote status
    const userId = req.user._id;
    const isUpvoted = discussion.upvotes.includes(userId);
    const isDownvoted = discussion.downvotes.includes(userId);

    // Handle vote change
    if (voteType === "upvote") {
      if (isUpvoted) {
        // Remove upvote (toggle off)
        discussion.upvotes.pull(userId);
      } else {
        // Add upvote and remove downvote if exists
        discussion.upvotes.push(userId);

        if (isDownvoted) {
          discussion.downvotes.pull(userId);
        }
      }
    } else if (voteType === "downvote") {
      if (isDownvoted) {
        // Remove downvote (toggle off)
        discussion.downvotes.pull(userId);
      } else {
        // Add downvote and remove upvote if exists
        discussion.downvotes.push(userId);

        if (isUpvoted) {
          discussion.upvotes.pull(userId);
        }
      }
    }

    // Save discussion with updated votes
    await discussion.save();

    // Update score
    discussion.score = discussion.upvotes.length - discussion.downvotes.length;
    await discussion.save();

    // Update author's karma
    await User.findByIdAndUpdate(discussion.author, {
      $inc: { karma: discussion.score },
    });

    // Notify with socket.io
    const io = req.app.get("io");
    io.emit("discussionVoted", {
      _id: discussion._id,
      score: discussion.score,
      upvotes: discussion.upvotes.length,
      downvotes: discussion.downvotes.length,
    });

    res.status(200).json({
      success: true,
      data: {
        score: discussion.score,
        userVote: discussion.upvotes.includes(userId)
          ? "upvote"
          : discussion.downvotes.includes(userId)
          ? "downvote"
          : null,
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
