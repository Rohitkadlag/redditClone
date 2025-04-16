// // server/controllers/commentController.js
// const Comment = require("../models/Comment");
// const Post = require("../models/Post");
// const User = require("../models/User");

// // @desc    Get comments for a post
// // @route   GET /api/comments/:postId
// // @access  Public
// exports.getComments = async (req, res, next) => {
//   try {
//     const postId = req.params.postId;

//     // Check if post exists
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     // Query parameters
//     const sortBy = req.query.sortBy || "top";
//     let sortOptions = {};

//     switch (sortBy) {
//       case "new":
//         sortOptions = { createdAt: -1 };
//         break;
//       case "old":
//         sortOptions = { createdAt: 1 };
//         break;
//       case "controversial":
//         // A simple implementation of controversial
//         // In a real app, this would be more sophisticated
//         sortOptions = {
//           score: 1, // Low score first
//           upvotes: -1, // High activity
//           downvotes: -1, // High activity
//         };
//         break;
//       case "top":
//       default:
//         sortOptions = { score: -1 };
//         break;
//     }

//     // Get top-level comments (parent is null)
//     const topLevelComments = await Comment.find({
//       post: postId,
//       parent: null,
//     })
//       .sort(sortOptions)
//       .populate("author", "username avatar karma")
//       .lean();

//     // Function to recursively get replies with a depth limit
//     const getNestedReplies = async (
//       comments,
//       currentDepth = 0,
//       maxDepth = 3
//     ) => {
//       // Process in batches to avoid blocking
//       const batchSize = 10;

//       for (let i = 0; i < comments.length; i += batchSize) {
//         const batch = comments.slice(i, i + batchSize);

//         // Process each comment in batch
//         await Promise.all(
//           batch.map(async (comment) => {
//             // Only fetch nested replies if we're within max depth
//             if (currentDepth < maxDepth) {
//               // Get replies for this comment
//               const replies = await Comment.find({ parent: comment._id })
//                 .sort(sortOptions)
//                 .populate("author", "username avatar karma")
//                 .lean();

//               // Add user vote status if logged in
//               if (req.user) {
//                 replies.forEach((reply) => {
//                   reply.userVote = reply.upvotes.includes(req.user._id)
//                     ? "upvote"
//                     : reply.downvotes.includes(req.user._id)
//                     ? "downvote"
//                     : null;

//                   // Clean upvotes and downvotes arrays
//                   delete reply.upvotes;
//                   delete reply.downvotes;
//                 });
//               }

//               // Add replies to comment
//               comment.replies = replies;

//               // Recursively get nested replies
//               if (replies.length > 0) {
//                 await getNestedReplies(replies, currentDepth + 1, maxDepth);
//               }
//             } else {
//               // At max depth, just add a count of how many more replies there are
//               const replyCount = await Comment.countDocuments({
//                 parent: comment._id,
//               });

//               comment.hasMoreReplies = replyCount > 0;
//               comment.replyCount = replyCount;
//               comment.replies = [];
//             }
//           })
//         );
//       }

//       return comments;
//     };

//     // Add user vote status if logged in
//     if (req.user) {
//       topLevelComments.forEach((comment) => {
//         comment.userVote = comment.upvotes.includes(req.user._id)
//           ? "upvote"
//           : comment.downvotes.includes(req.user._id)
//           ? "downvote"
//           : null;

//         // Clean upvotes and downvotes arrays
//         delete comment.upvotes;
//         delete comment.downvotes;
//       });
//     }

//     // Get nested replies with depth limit
//     const commentsWithReplies = await getNestedReplies(topLevelComments);

//     res.status(200).json({
//       success: true,
//       count: commentsWithReplies.length,
//       data: commentsWithReplies,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // @desc    Get more replies for a specific comment (used for pagination of deep threads)
// // @route   GET /api/comments/:postId/:commentId/replies
// // @access  Public
// exports.getMoreReplies = async (req, res, next) => {
//   try {
//     const { postId, commentId } = req.params;

//     // Query parameters
//     const sortBy = req.query.sortBy || "top";
//     let sortOptions = {};

//     switch (sortBy) {
//       case "new":
//         sortOptions = { createdAt: -1 };
//         break;
//       case "old":
//         sortOptions = { createdAt: 1 };
//         break;
//       case "controversial":
//         sortOptions = {
//           score: 1,
//           upvotes: -1,
//           downvotes: -1,
//         };
//         break;
//       case "top":
//       default:
//         sortOptions = { score: -1 };
//         break;
//     }

//     // Get replies for the specified comment
//     const replies = await Comment.find({ parent: commentId })
//       .sort(sortOptions)
//       .populate("author", "username avatar karma")
//       .lean();

//     // Add user vote status if logged in
//     if (req.user) {
//       replies.forEach((reply) => {
//         reply.userVote = reply.upvotes.includes(req.user._id)
//           ? "upvote"
//           : reply.downvotes.includes(req.user._id)
//           ? "downvote"
//           : null;

//         // Clean upvotes and downvotes arrays
//         delete reply.upvotes;
//         delete reply.downvotes;
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: replies.length,
//       data: replies,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // @desc    Create a new comment
// // @route   POST /api/comments/:postId
// // @access  Private
// exports.createComment = async (req, res, next) => {
//   try {
//     const { content, parentId } = req.body;
//     const postId = req.params.postId;

//     // Check if post exists
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     // Check if parent comment exists if provided
//     if (parentId) {
//       const parentComment = await Comment.findById(parentId);
//       if (!parentComment) {
//         return res.status(404).json({
//           success: false,
//           message: "Parent comment not found",
//         });
//       }
//     }

//     // Create comment
//     const comment = await Comment.create({
//       content,
//       author: req.user._id,
//       post: postId,
//       parent: parentId || null,
//     });

//     // Update comment count in post
//     await Post.findByIdAndUpdate(postId, {
//       $inc: { commentCount: 1 },
//     });

//     // Populate author details
//     await comment.populate("author", "username avatar karma");

//     // If this is a reply, notify the parent comment author
//     if (parentId) {
//       const parentComment = await Comment.findById(parentId);

//       if (
//         parentComment &&
//         parentComment.author.toString() !== req.user._id.toString()
//       ) {
//         // Find the parent author
//         const parentAuthor = await User.findById(parentComment.author);

//         // Add notification
//         await parentAuthor.addNotification(
//           "reply",
//           `${req.user.username} replied to your comment`,
//           {
//             postId,
//             commentId: comment._id,
//           }
//         );

//         // Send real-time notification
//         const io = req.app.get("io");
//         io.to(`user:${parentComment.author}`).emit("notification", {
//           type: "reply",
//           message: `${req.user.username} replied to your comment`,
//           data: {
//             postId,
//             commentId: comment._id,
//           },
//         });
//       }
//     } else {
//       // This is a direct comment on the post, notify post author
//       if (post.author.toString() !== req.user._id.toString()) {
//         // Find the post author
//         const postAuthor = await User.findById(post.author);

//         // Add notification
//         await postAuthor.addNotification(
//           "comment",
//           `${req.user.username} commented on your post`,
//           {
//             postId,
//             commentId: comment._id,
//           }
//         );

//         // Send real-time notification
//         const io = req.app.get("io");
//         io.to(`user:${post.author}`).emit("notification", {
//           type: "comment",
//           message: `${req.user.username} commented on your post`,
//           data: {
//             postId,
//             commentId: comment._id,
//           },
//         });
//       }
//     }

//     // Broadcast new comment to users viewing the post
//     const io = req.app.get("io");
//     io.to(`post:${postId}`).emit("newComment", {
//       comment: {
//         _id: comment._id,
//         content: comment.content,
//         author: comment.author,
//         createdAt: comment.createdAt,
//         parent: comment.parent,
//         level: comment.level,
//         score: 0,
//         replies: [],
//       },
//     });

//     res.status(201).json({
//       success: true,
//       data: comment,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // @desc    Update a comment
// // @route   PUT /api/comments/:id
// // @access  Private (owner only)
// exports.updateComment = async (req, res, next) => {
//   try {
//     const { content } = req.body;
//     const commentId = req.params.id;

//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     // Check ownership
//     if (
//       comment.author.toString() !== req.user._id.toString() &&
//       !req.user.isAdmin
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to update this comment",
//       });
//     }

//     // Save current content to history
//     comment.editHistory.push({
//       content: comment.content,
//       editedAt: Date.now(),
//     });

//     // Update content
//     comment.content = content;
//     comment.edited = true;
//     comment.editedAt = Date.now();

//     await comment.save();

//     // Broadcast update to users viewing the post
//     const io = req.app.get("io");
//     io.to(`post:${comment.post}`).emit("commentUpdated", {
//       _id: comment._id,
//       content: comment.content,
//       edited: comment.edited,
//       editedAt: comment.editedAt,
//     });

//     res.status(200).json({
//       success: true,
//       data: comment,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // @desc    Delete a comment
// // @route   DELETE /api/comments/:id
// // @access  Private (owner or admin only)
// exports.deleteComment = async (req, res, next) => {
//   try {
//     const commentId = req.params.id;

//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     // Check permissions
//     const isAuthor = comment.author.toString() === req.user._id.toString();
//     const isAdmin = req.user.isAdmin;

//     if (!isAuthor && !isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to delete this comment",
//       });
//     }

//     // Don't actually delete - mark as deleted to preserve thread structure
//     comment.deleted = true;
//     comment.content = "[deleted]";
//     await comment.save();

//     // Broadcast deletion to users viewing the post
//     const io = req.app.get("io");
//     io.to(`post:${comment.post}`).emit("commentDeleted", {
//       _id: comment._id,
//     });

//     res.status(200).json({
//       success: true,
//       data: {},
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // @desc    Vote on a comment
// // @route   POST /api/comments/:id/vote
// // @access  Private
// exports.voteComment = async (req, res, next) => {
//   try {
//     const { voteType } = req.body;
//     const commentId = req.params.id;

//     if (!["upvote", "downvote"].includes(voteType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid vote type",
//       });
//     }

//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({
//         success: false,
//         message: "Comment not found",
//       });
//     }

//     // Get current vote status
//     const userId = req.user._id;
//     const isUpvoted = comment.upvotes.includes(userId);
//     const isDownvoted = comment.downvotes.includes(userId);

//     // Handle vote change
//     if (voteType === "upvote") {
//       if (isUpvoted) {
//         // Remove upvote (toggle off)
//         comment.upvotes.pull(userId);
//       } else {
//         // Add upvote and remove downvote if exists
//         comment.upvotes.push(userId);

//         if (isDownvoted) {
//           comment.downvotes.pull(userId);
//         }
//       }
//     } else if (voteType === "downvote") {
//       if (isDownvoted) {
//         // Remove downvote (toggle off)
//         comment.downvotes.pull(userId);
//       } else {
//         // Add downvote and remove upvote if exists
//         comment.downvotes.push(userId);

//         if (isUpvoted) {
//           comment.upvotes.pull(userId);
//         }
//       }
//     }

//     // Save comment with updated votes
//     await comment.save();

//     // Update author's karma
//     const scoreChange =
//       comment.upvotes.length - comment.downvotes.length - comment.score;
//     await User.findByIdAndUpdate(comment.author, {
//       $inc: { karma: scoreChange },
//     });

//     // Update comment score
//     comment.score = comment.upvotes.length - comment.downvotes.length;
//     await comment.save();

//     // Broadcast update to users viewing the post
//     const io = req.app.get("io");
//     io.to(`post:${comment.post}`).emit("commentVoted", {
//       _id: comment._id,
//       score: comment.score,
//       upvotes: comment.upvotes.length,
//       downvotes: comment.downvotes.length,
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         score: comment.score,
//         userVote: comment.upvotes.includes(userId)
//           ? "upvote"
//           : comment.downvotes.includes(userId)
//           ? "downvote"
//           : null,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// server/controllers/commentController.js
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const Discussion = require("../models/Discussion");

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Query parameters
    const sortBy = req.query.sortBy || "top";
    let sortOptions = {};

    switch (sortBy) {
      case "new":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "controversial":
        // A simple implementation of controversial
        sortOptions = {
          score: 1, // Low score first
          upvotes: -1, // High activity
          downvotes: -1, // High activity
        };
        break;
      case "top":
      default:
        sortOptions = { score: -1 };
        break;
    }

    // Get top-level comments (parent is null)
    const topLevelComments = await Comment.find({
      post: postId,
      parent: null,
    })
      .sort(sortOptions)
      .populate("author", "username avatar karma")
      .lean();

    // Function to recursively get replies with a depth limit
    const getNestedReplies = async (
      comments,
      currentDepth = 0,
      maxDepth = 3
    ) => {
      // Process in batches to avoid blocking
      const batchSize = 10;

      for (let i = 0; i < comments.length; i += batchSize) {
        const batch = comments.slice(i, i + batchSize);

        // Process each comment in batch
        await Promise.all(
          batch.map(async (comment) => {
            // Only fetch nested replies if we're within max depth
            if (currentDepth < maxDepth) {
              // Get replies for this comment
              const replies = await Comment.find({ parent: comment._id })
                .sort(sortOptions)
                .populate("author", "username avatar karma")
                .lean();

              // Add user vote status if logged in
              if (req.user) {
                replies.forEach((reply) => {
                  reply.userVote = reply.upvotes.includes(req.user._id)
                    ? "upvote"
                    : reply.downvotes.includes(req.user._id)
                    ? "downvote"
                    : null;

                  // Clean upvotes and downvotes arrays
                  delete reply.upvotes;
                  delete reply.downvotes;
                });
              }

              // Add replies to comment
              comment.replies = replies;

              // Recursively get nested replies
              if (replies.length > 0) {
                await getNestedReplies(replies, currentDepth + 1, maxDepth);
              }
            } else {
              // At max depth, just add a count of how many more replies there are
              const replyCount = await Comment.countDocuments({
                parent: comment._id,
              });

              comment.hasMoreReplies = replyCount > 0;
              comment.replyCount = replyCount;
              comment.replies = [];
            }
          })
        );
      }

      return comments;
    };

    // Add user vote status if logged in
    if (req.user) {
      topLevelComments.forEach((comment) => {
        comment.userVote = comment.upvotes.includes(req.user._id)
          ? "upvote"
          : comment.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Clean upvotes and downvotes arrays
        delete comment.upvotes;
        delete comment.downvotes;
      });
    }

    // Get nested replies with depth limit
    const commentsWithReplies = await getNestedReplies(topLevelComments);

    res.status(200).json({
      success: true,
      count: commentsWithReplies.length,
      data: commentsWithReplies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get comments for a discussion
// @route   GET /api/comments/discussions/:discussionId
// @access  Public
exports.getDiscussionComments = async (req, res, next) => {
  try {
    const discussionId = req.params.discussionId;

    // Check if discussion exists
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Query parameters
    const sortBy = req.query.sortBy || "top";
    let sortOptions = {};

    switch (sortBy) {
      case "new":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "controversial":
        sortOptions = {
          score: 1,
          upvotes: -1,
          downvotes: -1,
        };
        break;
      case "top":
      default:
        sortOptions = { score: -1 };
        break;
    }

    // Get top-level comments (parent is null)
    const topLevelComments = await Comment.find({
      discussion: discussionId,
      parent: null,
    })
      .sort(sortOptions)
      .populate("author", "username avatar karma")
      .lean();

    // Function to recursively get replies with a depth limit
    const getNestedReplies = async (
      comments,
      currentDepth = 0,
      maxDepth = 3
    ) => {
      // Process in batches to avoid blocking
      const batchSize = 10;

      for (let i = 0; i < comments.length; i += batchSize) {
        const batch = comments.slice(i, i + batchSize);

        // Process each comment in batch
        await Promise.all(
          batch.map(async (comment) => {
            // Only fetch nested replies if we're within max depth
            if (currentDepth < maxDepth) {
              // Get replies for this comment
              const replies = await Comment.find({ parent: comment._id })
                .sort(sortOptions)
                .populate("author", "username avatar karma")
                .lean();

              // Add user vote status if logged in
              if (req.user) {
                replies.forEach((reply) => {
                  reply.userVote = reply.upvotes.includes(req.user._id)
                    ? "upvote"
                    : reply.downvotes.includes(req.user._id)
                    ? "downvote"
                    : null;

                  // Clean upvotes and downvotes arrays
                  delete reply.upvotes;
                  delete reply.downvotes;
                });
              }

              // Add replies to comment
              comment.replies = replies;

              // Recursively get nested replies
              if (replies.length > 0) {
                await getNestedReplies(replies, currentDepth + 1, maxDepth);
              }
            } else {
              // At max depth, just add a count of how many more replies there are
              const replyCount = await Comment.countDocuments({
                parent: comment._id,
              });

              comment.hasMoreReplies = replyCount > 0;
              comment.replyCount = replyCount;
              comment.replies = [];
            }
          })
        );
      }

      return comments;
    };

    // Add user vote status if logged in
    if (req.user) {
      topLevelComments.forEach((comment) => {
        comment.userVote = comment.upvotes.includes(req.user._id)
          ? "upvote"
          : comment.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Clean upvotes and downvotes arrays
        delete comment.upvotes;
        delete comment.downvotes;
      });
    }

    // Get nested replies with depth limit
    const commentsWithReplies = await getNestedReplies(topLevelComments);

    res.status(200).json({
      success: true,
      count: commentsWithReplies.length,
      data: commentsWithReplies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get more replies for a specific comment (used for pagination of deep threads)
// @route   GET /api/comments/:postId/:commentId/replies
// @access  Public
exports.getMoreReplies = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    // Query parameters
    const sortBy = req.query.sortBy || "top";
    let sortOptions = {};

    switch (sortBy) {
      case "new":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "controversial":
        sortOptions = {
          score: 1,
          upvotes: -1,
          downvotes: -1,
        };
        break;
      case "top":
      default:
        sortOptions = { score: -1 };
        break;
    }

    // Get replies for the specified comment
    const replies = await Comment.find({ parent: commentId })
      .sort(sortOptions)
      .populate("author", "username avatar karma")
      .lean();

    // Add user vote status if logged in
    if (req.user) {
      replies.forEach((reply) => {
        reply.userVote = reply.upvotes.includes(req.user._id)
          ? "upvote"
          : reply.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Clean upvotes and downvotes arrays
        delete reply.upvotes;
        delete reply.downvotes;
      });
    }

    res.status(200).json({
      success: true,
      count: replies.length,
      data: replies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get more replies for a specific discussion comment
// @route   GET /api/comments/discussions/:discussionId/:commentId/replies
// @access  Public
exports.getDiscussionCommentReplies = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    // Query parameters
    const sortBy = req.query.sortBy || "top";
    let sortOptions = {};

    switch (sortBy) {
      case "new":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "controversial":
        sortOptions = {
          score: 1,
          upvotes: -1,
          downvotes: -1,
        };
        break;
      case "top":
      default:
        sortOptions = { score: -1 };
        break;
    }

    // Get replies for the specified comment
    const replies = await Comment.find({ parent: commentId })
      .sort(sortOptions)
      .populate("author", "username avatar karma")
      .lean();

    // Add user vote status if logged in
    if (req.user) {
      replies.forEach((reply) => {
        reply.userVote = reply.upvotes.includes(req.user._id)
          ? "upvote"
          : reply.downvotes.includes(req.user._id)
          ? "downvote"
          : null;

        // Clean upvotes and downvotes arrays
        delete reply.upvotes;
        delete reply.downvotes;
      });
    }

    res.status(200).json({
      success: true,
      count: replies.length,
      data: replies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create a new comment for a post
// @route   POST /api/comments/:postId
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    const { content, parentId } = req.body;
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if parent comment exists if provided
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
      parent: parentId || null,
    });

    // Update comment count in post
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    });

    // Populate author details
    await comment.populate("author", "username avatar karma");

    // If this is a reply, notify the parent comment author
    if (parentId) {
      const parentComment = await Comment.findById(parentId);

      if (
        parentComment &&
        parentComment.author.toString() !== req.user._id.toString()
      ) {
        // Find the parent author
        const parentAuthor = await User.findById(parentComment.author);

        // Add notification
        await parentAuthor.addNotification(
          "reply",
          `${req.user.username} replied to your comment`,
          {
            postId,
            commentId: comment._id,
          }
        );

        // Send real-time notification
        const io = req.app.get("io");
        io.to(`user:${parentComment.author}`).emit("notification", {
          type: "reply",
          message: `${req.user.username} replied to your comment`,
          data: {
            postId,
            commentId: comment._id,
          },
        });
      }
    } else {
      // This is a direct comment on the post, notify post author
      if (post.author.toString() !== req.user._id.toString()) {
        // Find the post author
        const postAuthor = await User.findById(post.author);

        // Add notification
        await postAuthor.addNotification(
          "comment",
          `${req.user.username} commented on your post`,
          {
            postId,
            commentId: comment._id,
          }
        );

        // Send real-time notification
        const io = req.app.get("io");
        io.to(`user:${post.author}`).emit("notification", {
          type: "comment",
          message: `${req.user.username} commented on your post`,
          data: {
            postId,
            commentId: comment._id,
          },
        });
      }
    }

    // Broadcast new comment to users viewing the post
    const io = req.app.get("io");
    io.to(`post:${postId}`).emit("newComment", {
      comment: {
        _id: comment._id,
        content: comment.content,
        author: comment.author,
        createdAt: comment.createdAt,
        parent: comment.parent,
        level: comment.level,
        score: 0,
        replies: [],
      },
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create a new comment for a discussion
// @route   POST /api/comments/discussions/:discussionId
// @access  Private
exports.createDiscussionComment = async (req, res, next) => {
  try {
    const { content, parentId } = req.body;
    const discussionId = req.params.discussionId;

    // Check if discussion exists
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Check if parent comment exists if provided
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user._id,
      discussion: discussionId,
      parent: parentId || null,
    });

    // Update comment count in discussion
    await Discussion.findByIdAndUpdate(discussionId, {
      $inc: { commentCount: 1 },
    });

    // Populate author details
    await comment.populate("author", "username avatar karma");

    // If this is a reply, notify the parent comment author
    if (parentId) {
      const parentComment = await Comment.findById(parentId);

      if (
        parentComment &&
        parentComment.author.toString() !== req.user._id.toString()
      ) {
        // Find the parent author
        const parentAuthor = await User.findById(parentComment.author);

        // Add notification
        await parentAuthor.addNotification(
          "reply",
          `${req.user.username} replied to your comment`,
          {
            discussionId,
            commentId: comment._id,
          }
        );

        // Send real-time notification
        const io = req.app.get("io");
        io.to(`user:${parentComment.author}`).emit("notification", {
          type: "reply",
          message: `${req.user.username} replied to your comment`,
          data: {
            discussionId,
            commentId: comment._id,
          },
        });
      }
    } else {
      // This is a direct comment on the discussion, notify discussion author
      if (discussion.author.toString() !== req.user._id.toString()) {
        // Find the discussion author
        const discussionAuthor = await User.findById(discussion.author);

        // Add notification
        await discussionAuthor.addNotification(
          "comment",
          `${req.user.username} commented on your discussion`,
          {
            discussionId,
            commentId: comment._id,
          }
        );

        // Send real-time notification
        const io = req.app.get("io");
        io.to(`user:${discussion.author}`).emit("notification", {
          type: "comment",
          message: `${req.user.username} commented on your discussion`,
          data: {
            discussionId,
            commentId: comment._id,
          },
        });
      }
    }

    // Broadcast new comment to users viewing the discussion
    const io = req.app.get("io");
    io.emit("newDiscussionComment", {
      comment: {
        _id: comment._id,
        content: comment.content,
        author: comment.author,
        createdAt: comment.createdAt,
        parent: comment.parent,
        level: comment.level,
        score: 0,
        replies: [],
      },
      discussionId,
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private (owner only)
exports.updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (
      comment.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this comment",
      });
    }

    // Save current content to history
    comment.editHistory.push({
      content: comment.content,
      editedAt: Date.now(),
    });

    // Update content
    comment.content = content;
    comment.edited = true;
    comment.editedAt = Date.now();

    await comment.save();

    // Determine if this is a post or discussion comment
    const targetRoom = comment.post ? `post:${comment.post}` : null;

    // Broadcast update to users viewing the post/discussion
    const io = req.app.get("io");

    if (targetRoom) {
      // Post comment update
      io.to(targetRoom).emit("commentUpdated", {
        _id: comment._id,
        content: comment.content,
        edited: comment.edited,
        editedAt: comment.editedAt,
      });
    } else {
      // Discussion comment update - broadcast globally
      io.emit("discussionCommentUpdated", {
        _id: comment._id,
        content: comment.content,
        edited: comment.edited,
        editedAt: comment.editedAt,
        discussionId: comment.discussion,
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (owner or admin only)
exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check permissions
    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Don't actually delete - mark as deleted to preserve thread structure
    comment.deleted = true;
    comment.content = "[deleted]";
    await comment.save();

    // Determine if this is a post or discussion comment
    const targetRoom = comment.post ? `post:${comment.post}` : null;

    // Broadcast deletion to users viewing the post/discussion
    const io = req.app.get("io");

    if (targetRoom) {
      // Post comment deletion
      io.to(targetRoom).emit("commentDeleted", {
        _id: comment._id,
      });
    } else {
      // Discussion comment deletion - broadcast globally
      io.emit("discussionCommentDeleted", {
        _id: comment._id,
        discussionId: comment.discussion,
      });
    }

    res.status(200).json({
      success: true,
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

// @desc    Vote on a comment
// @route   POST /api/comments/:id/vote
// @access  Private
exports.voteComment = async (req, res, next) => {
  try {
    const { voteType } = req.body;
    const commentId = req.params.id;

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vote type",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Get current vote status
    const userId = req.user._id;
    const isUpvoted = comment.upvotes.includes(userId);
    const isDownvoted = comment.downvotes.includes(userId);

    // Handle vote change
    if (voteType === "upvote") {
      if (isUpvoted) {
        // Remove upvote (toggle off)
        comment.upvotes.pull(userId);
      } else {
        // Add upvote and remove downvote if exists
        comment.upvotes.push(userId);

        if (isDownvoted) {
          comment.downvotes.pull(userId);
        }
      }
    } else if (voteType === "downvote") {
      if (isDownvoted) {
        // Remove downvote (toggle off)
        comment.downvotes.pull(userId);
      } else {
        // Add downvote and remove upvote if exists
        comment.downvotes.push(userId);

        if (isUpvoted) {
          comment.upvotes.pull(userId);
        }
      }
    }

    // Save comment with updated votes
    await comment.save();

    // Update author's karma
    const scoreChange =
      comment.upvotes.length - comment.downvotes.length - comment.score;
    await User.findByIdAndUpdate(comment.author, {
      $inc: { karma: scoreChange },
    });

    // Update comment score
    comment.score = comment.upvotes.length - comment.downvotes.length;
    await comment.save();

    // Determine if this is a post or discussion comment
    const targetRoom = comment.post ? `post:${comment.post}` : null;

    // Broadcast update to users viewing the post/discussion
    const io = req.app.get("io");

    if (targetRoom) {
      // Post comment vote
      io.to(targetRoom).emit("commentVoted", {
        _id: comment._id,
        score: comment.score,
        upvotes: comment.upvotes.length,
        downvotes: comment.downvotes.length,
      });
    } else {
      // Discussion comment vote - broadcast globally
      io.emit("discussionCommentVoted", {
        _id: comment._id,
        score: comment.score,
        upvotes: comment.upvotes.length,
        downvotes: comment.downvotes.length,
        discussionId: comment.discussion,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        score: comment.score,
        userVote: comment.upvotes.includes(userId)
          ? "upvote"
          : comment.downvotes.includes(userId)
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
