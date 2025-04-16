// server/models/Discussion.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const DiscussionSchema = new mongoose.Schema(
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
      required: [true, "Please provide content"],
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    isPinned: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
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

// Create discussion slug from the title
DiscussionSchema.pre("save", function (next) {
  if (!this.isModified("title")) {
    next();
    return;
  }

  // Create slug with random suffix to avoid duplicates
  const randomSuffix = Math.floor(Math.random() * 1000000).toString(36);
  this.slug = slugify(this.title.toLowerCase()) + "-" + randomSuffix;
  next();
});

// Virtual field for comments
DiscussionSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "discussion",
  justOne: false,
});

module.exports = mongoose.model("Discussion", DiscussionSchema);
