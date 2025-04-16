// Import required models
const Post = require("../models/Post");
const User = require("../models/User");
const Subreddit = require("../models/Subreddit");

// @desc Create a new post
// @route POST /api/posts
// @access Private
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, type, url, subredditId, flair } = req.body;

    // Check if subreddit exists
    const subreddit = await Subreddit.findById(subredditId);
    if (!subreddit) {
      return res
        .status(404)
        .json({ success: false, message: "Subreddit not found" });
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      type: type || "text",
      url: url || "",
      author: req.user._id,
      subreddit: subredditId,
      flair: flair || {},
    });

    // Populate author and subreddit info
    await post.populate([
      { path: "author", select: "username avatar karma" },
      { path: "subreddit", select: "name slug icon" },
    ]);

    // Send socket event for real-time updates
    const io = req.app.get("io");
    io.to(`subreddit:${subredditId}`).emit("newPost", {
      post: {
        id: post._id,
        title: post.title,
        author: post.author,
        subreddit: post.subreddit,
        createdAt: post.createdAt,
        commentCount: 0,
        score: 0,
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Get all posts (with filtering and pagination)
// @route GET /api/posts
// @access Public
exports.getPosts = async (req, res, next) => {
  try {
    // Build query
    let query = {};

    // Filter by subreddit
    if (req.query.subreddit) {
      const subreddit = await Subreddit.findOne({
        $or: [{ slug: req.query.subreddit }, { _id: req.query.subreddit }],
      });
      if (subreddit) {
        query.subreddit = subreddit._id;
      }
    }

    // Filter by author
    if (req.query.author) {
      const author = await User.findOne({ username: req.query.author });
      if (author) {
        query.author = author._id;
      }
    }

    // Add pagination, sorting, and return response
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar karma")
      .populate("subreddit", "name slug icon");

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
      },
      data: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get a single post with comments
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    // Find post by id or slug
    const post = await Post.findOne({
      $or: [{ _id: postId }, { slug: postId }],
    })
      .populate("author", "username avatar karma")
      .populate("subreddit", "name slug icon banner description rules")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Add user vote status if logged in
    if (req.user) {
      post.userVote = post.upvotes.includes(req.user._id)
        ? "upvote"
        : post.downvotes.includes(req.user._id)
        ? "downvote"
        : null;

      // Remove upvotes and downvotes arrays for privacy
      delete post.upvotes;
      delete post.downvotes;
    }

    // Increment view count in background (don't await)
    Post.findByIdAndUpdate(post._id, {
      $inc: { viewCount: 1 },
    }).exec();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (owner only)
exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { content, flair } = req.body;

    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    if (
      post.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    // Check if post is locked
    if (post.isLocked) {
      return res.status(403).json({
        success: false,
        message: "Post is locked and cannot be updated",
      });
    }

    // Save original content to edit history
    if (content && content !== post.content) {
      post.editHistory.push({
        content: post.content,
        editedAt: Date.now(),
      });

      post.content = content;
      post.updatedAt = Date.now();
    }

    // Update flair if provided
    if (flair) {
      post.flair = flair;
    }

    await post.save();

    // Populate for response
    await post.populate([
      { path: "author", select: "username avatar karma" },
      { path: "subreddit", select: "name slug icon" },
    ]);

    // Notify with socket.io
    const io = req.app.get("io");
    io.to(`post:${post._id}`).emit("postUpdated", {
      _id: post._id,
      content: post.content,
      flair: post.flair,
      updatedAt: post.updatedAt,
    });

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (owner or admin/mod only)
exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    const isAuthor = post.author.toString() === req.user._id.toString();

    // Check if mod/admin
    let isModerator = false;

    if (!isAuthor) {
      // Check if user is subreddit moderator or admin
      const subreddit = await Subreddit.findById(post.subreddit);

      isModerator =
        subreddit.moderators.includes(req.user._id) ||
        subreddit.creator.toString() === req.user._id.toString() ||
        req.user.isAdmin;
    }

    if (!isAuthor && !isModerator) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    // If moderator action, mark as removed instead of deleting
    if (!isAuthor && isModerator) {
      post.isRemoved = true;
      post.removedReason = req.body.reason || "Removed by moderator";
      post.removedBy = req.user._id;

      await post.save();

      // Notify with socket.io
      const io = req.app.get("io");
      io.to(`post:${post._id}`).emit("postRemoved", {
        _id: post._id,
        reason: post.removedReason,
      });

      return res.status(200).json({
        success: true,
        message: "Post removed by moderator",
        data: {},
      });
    }

    // If author, delete completely
    await post.deleteOne();

    // Notify with socket.io
    const io = req.app.get("io");
    io.to(`post:${post._id}`).emit("postDeleted", {
      _id: post._id,
    });

    res.status(200).json({
      success: true,
      message: "Post deleted",
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

// @desc    Vote on a post (upvote/downvote)
// @route   POST /api/posts/:id/vote
// @access  Private
exports.votePost = async (req, res, next) => {
  try {
    const { voteType } = req.body;
    const postId = req.params.id;

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vote type",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get current vote status
    const userId = req.user._id;
    const isUpvoted = post.upvotes.includes(userId);
    const isDownvoted = post.downvotes.includes(userId);

    // Handle vote change
    if (voteType === "upvote") {
      if (isUpvoted) {
        // Remove upvote (toggle off)
        post.upvotes.pull(userId);
      } else {
        // Add upvote and remove downvote if exists
        post.upvotes.push(userId);

        if (isDownvoted) {
          post.downvotes.pull(userId);
        }
      }
    } else if (voteType === "downvote") {
      if (isDownvoted) {
        // Remove downvote (toggle off)
        post.downvotes.pull(userId);
      } else {
        // Add downvote and remove upvote if exists
        post.downvotes.push(userId);

        if (isUpvoted) {
          post.upvotes.pull(userId);
        }
      }
    }

    // Save post with updated votes
    await post.save();

    // Update post score
    post.score = post.upvotes.length - post.downvotes.length;
    await post.save();

    // Update author's karma
    await User.findByIdAndUpdate(post.author, {
      $inc: { karma: post.score },
    });

    // Notify with socket.io
    const io = req.app.get("io");
    io.to(`post:${post._id}`).emit("postVoted", {
      _id: post._id,
      score: post.score,
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
    });

    res.status(200).json({
      success: true,
      data: {
        score: post.score,
        userVote: post.upvotes.includes(userId)
          ? "upvote"
          : post.downvotes.includes(userId)
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
