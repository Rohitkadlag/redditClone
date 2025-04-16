// // server/models/Comment.js
// const mongoose = require("mongoose");

// const CommentSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//       required: [true, "Please provide comment content"],
//       trim: true,
//       maxlength: [10000, "Comment cannot exceed 10000 characters"],
//     },
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     post: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Post",
//       required: true,
//     },
//     parent: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Comment",
//       default: null,
//     },
//     level: {
//       type: Number,
//       default: 0,
//     },
//     upvotes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     downvotes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     score: {
//       type: Number,
//       default: 0,
//     },
//     deleted: {
//       type: Boolean,
//       default: false,
//     },
//     edited: {
//       type: Boolean,
//       default: false,
//     },
//     editedAt: {
//       type: Date,
//     },
//     editHistory: [
//       {
//         content: String,
//         editedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // Virtual field for replies (child comments)
// CommentSchema.virtual("replies", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "parent",
//   justOne: false,
//   options: { sort: { createdAt: 1 } },
// });

// // Update comment score and level
// CommentSchema.pre("save", async function (next) {
//   // Calculate score
//   if (this.isModified("upvotes") || this.isModified("downvotes")) {
//     this.score = this.upvotes.length - this.downvotes.length;
//   }

//   // Calculate nesting level
//   if (this.isNew && this.parent) {
//     try {
//       const parentComment = await this.constructor.findById(this.parent);
//       if (parentComment) {
//         this.level = parentComment.level + 1;
//       }
//     } catch (error) {
//       console.error("Error calculating comment level:", error);
//     }
//   }

//   next();
// });

// // Method1 to add an upvote
// CommentSchema.methods.upvote = function (userId) {
//   // Remove from downvotes if exists
//   this.downvotes = this.downvotes.filter(
//     (id) => id.toString() !== userId.toString()
//   );

//   // Add to upvotes if not already upvoted
//   if (!this.upvotes.some((id) => id.toString() === userId.toString())) {
//     this.upvotes.push(userId);
//   } else {
//     // If already upvoted, remove the upvote (toggle behavior)
//     this.upvotes = this.upvotes.filter(
//       (id) => id.toString() !== userId.toString()
//     );
//   }

//   return this.save();
// };

// // Method to add a downvote
// CommentSchema.methods.downvote = function (userId) {
//   // Remove from upvotes if exists
//   this.upvotes = this.upvotes.filter(
//     (id) => id.toString() !== userId.toString()
//   );

//   // Add to downvotes if not already downvoted
//   if (!this.downvotes.some((id) => id.toString() === userId.toString())) {
//     this.downvotes.push(userId);
//   } else {
//     // If already downvoted, remove the downvote (toggle behavior)
//     this.downvotes = this.downvotes.filter(
//       (id) => id.toString() !== userId.toString()
//     );
//   }

//   return this.save();
// };

// // Method to check if a user has voted
// CommentSchema.methods.getUserVote = function (userId) {
//   if (this.upvotes.some((id) => id.toString() === userId.toString())) {
//     return "upvote";
//   } else if (this.downvotes.some((id) => id.toString() === userId.toString())) {
//     return "downvote";
//   } else {
//     return null;
//   }
// };

// // Method to save edit history
// CommentSchema.methods.saveEdit = function (newContent) {
//   // Add current content to edit history
//   this.editHistory.push({ content: this.content });

//   // Update content
//   this.content = newContent;
//   this.edited = true;
//   this.editedAt = Date.now();

//   return this.save();
// };

// // Static method to get comment tree
// CommentSchema.statics.getThreaded = async function (postId) {
//   // First get all top-level comments (no parent)
//   const topLevelComments = await this.find({
//     post: postId,
//     parent: null,
//   })
//     .sort({ score: -1, createdAt: -1 })
//     .populate("author", "username avatar karma")
//     .lean();

//   // Function to recursively get replies
//   const populateReplies = async (comments) => {
//     for (let comment of comments) {
//       const replies = await this.find({ parent: comment._id })
//         .sort({ score: -1, createdAt: -1 })
//         .populate("author", "username avatar karma")
//         .lean();

//       if (replies.length > 0) {
//         comment.replies = replies;
//         await populateReplies(comment.replies);
//       } else {
//         comment.replies = [];
//       }
//     }

//     return comments;
//   };

//   // Populate the entire comment tree
//   return await populateReplies(topLevelComments);
// };

// module.exports = mongoose.model("Comment", CommentSchema);

// server/models/Comment.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please provide comment content"],
      trim: true,
      maxlength: [10000, "Comment cannot exceed 10000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    editHistory: [
      {
        content: String,
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for replies (child comments)
CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
  justOne: false,
  options: { sort: { createdAt: 1 } },
});

// Middleware to ensure either post or discussion is provided
CommentSchema.pre("validate", function (next) {
  if (!this.post && !this.discussion) {
    this.invalidate("post", "Either post or discussion must be provided");
  }
  next();
});

// Update comment score and level
CommentSchema.pre("save", async function (next) {
  // Calculate score
  if (this.isModified("upvotes") || this.isModified("downvotes")) {
    this.score = this.upvotes.length - this.downvotes.length;
  }

  // Calculate nesting level
  if (this.isNew && this.parent) {
    try {
      const parentComment = await this.constructor.findById(this.parent);
      if (parentComment) {
        this.level = parentComment.level + 1;
      }
    } catch (error) {
      console.error("Error calculating comment level:", error);
    }
  }

  next();
});

// Method to add an upvote
CommentSchema.methods.upvote = function (userId) {
  // Remove from downvotes if exists
  this.downvotes = this.downvotes.filter(
    (id) => id.toString() !== userId.toString()
  );

  // Add to upvotes if not already upvoted
  if (!this.upvotes.some((id) => id.toString() === userId.toString())) {
    this.upvotes.push(userId);
  } else {
    // If already upvoted, remove the upvote (toggle behavior)
    this.upvotes = this.upvotes.filter(
      (id) => id.toString() !== userId.toString()
    );
  }

  return this.save();
};

// Method to add a downvote
CommentSchema.methods.downvote = function (userId) {
  // Remove from upvotes if exists
  this.upvotes = this.upvotes.filter(
    (id) => id.toString() !== userId.toString()
  );

  // Add to downvotes if not already downvoted
  if (!this.downvotes.some((id) => id.toString() === userId.toString())) {
    this.downvotes.push(userId);
  } else {
    // If already downvoted, remove the downvote (toggle behavior)
    this.downvotes = this.downvotes.filter(
      (id) => id.toString() !== userId.toString()
    );
  }

  return this.save();
};

// Method to check if a user has voted
CommentSchema.methods.getUserVote = function (userId) {
  if (this.upvotes.some((id) => id.toString() === userId.toString())) {
    return "upvote";
  } else if (this.downvotes.some((id) => id.toString() === userId.toString())) {
    return "downvote";
  } else {
    return null;
  }
};

// Method to save edit history
CommentSchema.methods.saveEdit = function (newContent) {
  // Add current content to edit history
  this.editHistory.push({ content: this.content });

  // Update content
  this.content = newContent;
  this.edited = true;
  this.editedAt = Date.now();

  return this.save();
};

// Static method to get comment tree
CommentSchema.statics.getThreaded = async function (postId, discussionId) {
  // Build the query
  let query = {};
  if (postId) {
    query = { post: postId, parent: null };
  } else if (discussionId) {
    query = { discussion: discussionId, parent: null };
  } else {
    throw new Error("Either postId or discussionId is required");
  }

  // First get all top-level comments (no parent)
  const topLevelComments = await this.find(query)
    .sort({ score: -1, createdAt: -1 })
    .populate("author", "username avatar karma")
    .lean();

  // Function to recursively get replies
  const populateReplies = async (comments) => {
    for (let comment of comments) {
      const replies = await this.find({ parent: comment._id })
        .sort({ score: -1, createdAt: -1 })
        .populate("author", "username avatar karma")
        .lean();

      if (replies.length > 0) {
        comment.replies = replies;
        await populateReplies(comment.replies);
      } else {
        comment.replies = [];
      }
    }

    return comments;
  };

  // Populate the entire comment tree
  return await populateReplies(topLevelComments);
};

module.exports = mongoose.model("Comment", CommentSchema);
