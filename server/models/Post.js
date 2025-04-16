// server/models/Post.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    slug: {
      type: String,
    },
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["text", "link", "image", "video", "poll"],
      default: "text",
    },
    url: {
      type: String,
      default: "",
    },
    media: [
      {
        type: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subreddit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subreddit",
      required: true,
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
    commentCount: {
      type: Number,
      default: 0,
    },
    flair: {
      name: {
        type: String,
        default: "",
      },
      color: {
        type: String,
        default: "",
      },
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    removedReason: {
      type: String,
      default: "",
    },
    removedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for comments
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

// Create post slug from the title
PostSchema.pre("save", function (next) {
  if (!this.isModified("title")) {
    next();
    return;
  }

  // Create slug with random suffix to avoid duplicates
  const randomSuffix = Math.floor(Math.random() * 1000000).toString(36);
  this.slug = slugify(this.title.toLowerCase()) + "-" + randomSuffix;
  next();
});

// Update post score
PostSchema.pre("save", function (next) {
  if (this.isModified("upvotes") || this.isModified("downvotes")) {
    this.score = this.upvotes.length - this.downvotes.length;
  }

  if (this.isModified("content")) {
    this.updatedAt = Date.now();
  }

  next();
});

// Method to add an upvote
PostSchema.methods.upvote = function (userId) {
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
PostSchema.methods.downvote = function (userId) {
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
PostSchema.methods.getUserVote = function (userId) {
  if (this.upvotes.some((id) => id.toString() === userId.toString())) {
    return "upvote";
  } else if (this.downvotes.some((id) => id.toString() === userId.toString())) {
    return "downvote";
  } else {
    return null;
  }
};

// Method to save edit history
PostSchema.methods.saveEdit = function (newContent) {
  // Add current content to edit history
  this.editHistory.push({ content: this.content });

  // Update content
  this.content = newContent;

  return this.save();
};

module.exports = mongoose.model("Post", PostSchema);
