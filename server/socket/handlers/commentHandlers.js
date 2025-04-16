// server/socket/handlers/commentHandlers.js
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const setupCommentHandlers = (io, socket) => {
  // Handle new comment creation
  socket.on("newComment", async (data) => {
    try {
      const { postId, content, parentId } = data;

      // Create new comment
      const newComment = new Comment({
        content,
        author: socket.user._id,
        post: postId,
        parent: parentId || null,
      });

      // Save to database
      await newComment.save();

      // Populate author details for frontend display
      await newComment.populate({
        path: "author",
        select: "username avatar",
      });

      // Broadcast the new comment to everyone in the post room
      io.to(`post:${postId}`).emit("commentCreated", newComment);

      // Update comment count in post
      await Post.findByIdAndUpdate(postId, {
        $inc: { commentCount: 1 },
      });

      // If this is a reply, notify the parent comment author
      if (parentId) {
        const parentComment = await Comment.findById(parentId);
        if (
          parentComment &&
          parentComment.author.toString() !== socket.user._id.toString()
        ) {
          io.to(`user:${parentComment.author}`).emit("notification", {
            type: "reply",
            message: `${socket.user.username} replied to your comment`,
            data: {
              postId,
              commentId: newComment._id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      socket.emit("error", { message: "Error creating comment" });
    }
  });

  // Handle comment editing
  socket.on("editComment", async (data) => {
    try {
      const { commentId, content } = data;

      // Find comment
      const comment = await Comment.findById(commentId);

      // Check if comment exists and user is the author
      if (!comment) {
        return socket.emit("error", { message: "Comment not found" });
      }

      if (comment.author.toString() !== socket.user._id.toString()) {
        return socket.emit("error", { message: "Unauthorized" });
      }

      // Update comment
      comment.content = content;
      comment.edited = true;
      comment.editedAt = Date.now();

      await comment.save();

      // Broadcast the updated comment
      io.to(`post:${comment.post}`).emit("commentUpdated", {
        _id: comment._id,
        content: comment.content,
        edited: comment.edited,
        editedAt: comment.editedAt,
      });
    } catch (error) {
      console.error("Error editing comment:", error);
      socket.emit("error", { message: "Error editing comment" });
    }
  });

  // Handle comment deletion
  socket.on("deleteComment", async (data) => {
    try {
      const { commentId } = data;

      // Find comment
      const comment = await Comment.findById(commentId);

      // Check if comment exists and user is the author
      if (!comment) {
        return socket.emit("error", { message: "Comment not found" });
      }

      if (comment.author.toString() !== socket.user._id.toString()) {
        return socket.emit("error", { message: "Unauthorized" });
      }

      const postId = comment.post;

      // Don't actually delete, just mark as deleted to preserve thread structure
      comment.deleted = true;
      comment.content = "[deleted]";

      await comment.save();

      // Broadcast the deleted comment
      io.to(`post:${postId}`).emit("commentDeleted", {
        _id: comment._id,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      socket.emit("error", { message: "Error deleting comment" });
    }
  });

  // Handle comment voting
  socket.on("voteComment", async (data) => {
    try {
      const { commentId, voteType } = data;

      // Find comment
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return socket.emit("error", { message: "Comment not found" });
      }

      const userId = socket.user._id.toString();

      // Check if user already voted
      const upvoted = comment.upvotes.includes(userId);
      const downvoted = comment.downvotes.includes(userId);

      // Handle vote changes
      if (voteType === "upvote") {
        if (upvoted) {
          // Remove upvote if already upvoted
          comment.upvotes.pull(userId);
        } else {
          // Add upvote and remove downvote if exists
          comment.upvotes.push(userId);
          if (downvoted) {
            comment.downvotes.pull(userId);
          }
        }
      } else if (voteType === "downvote") {
        if (downvoted) {
          // Remove downvote if already downvoted
          comment.downvotes.pull(userId);
        } else {
          // Add downvote and remove upvote if exists
          comment.downvotes.push(userId);
          if (upvoted) {
            comment.upvotes.pull(userId);
          }
        }
      }

      await comment.save();

      // Calculate vote score
      const score = comment.upvotes.length - comment.downvotes.length;

      // Broadcast the updated vote count
      io.to(`post:${comment.post}`).emit("commentVoted", {
        _id: comment._id,
        score,
        upvotes: comment.upvotes.length,
        downvotes: comment.downvotes.length,
      });
    } catch (error) {
      console.error("Error voting on comment:", error);
      socket.emit("error", { message: "Error voting on comment" });
    }
  });
};

module.exports = setupCommentHandlers;
