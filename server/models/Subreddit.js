// server/models/Subreddit.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const SubredditSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a subreddit name"],
      unique: true,
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [21, "Name cannot exceed 21 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    sidebar: {
      type: String,
      default: "",
      maxlength: [10000, "Sidebar cannot exceed 10000 characters"],
    },
    icon: {
      type: String,
      default: "default-subreddit.png",
    },
    banner: {
      type: String,
      default: "default-banner.png",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subscribers: {
      type: Number,
      default: 0,
    },
    rules: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    flairs: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        color: {
          type: String,
          default: "#FF4500", // Reddit orange
        },
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isRestricted: {
      type: Boolean,
      default: false,
    },
    isNSFW: {
      type: Boolean,
      default: false,
    },
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

// Virtual field for posts in this subreddit
SubredditSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "subreddit",
  justOne: false,
});

// Create subreddit slug from the name
SubredditSchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    next();
    return;
  }

  this.slug = slugify(this.name.toLowerCase());
  next();
});

// Add moderator to subreddit
SubredditSchema.methods.addModerator = function (userId) {
  if (!this.moderators.includes(userId)) {
    this.moderators.push(userId);
  }
};

// Remove moderator from subreddit
SubredditSchema.methods.removeModerator = function (userId) {
  this.moderators = this.moderators.filter(
    (modId) => modId.toString() !== userId.toString()
  );
};

// Check if user is a moderator
SubredditSchema.methods.isModerator = function (userId) {
  return this.moderators.some(
    (modId) => modId.toString() === userId.toString()
  );
};

// Add subscriber count
SubredditSchema.methods.updateSubscriberCount = async function () {
  const User = mongoose.model("User");

  const subscriberCount = await User.countDocuments({
    followedSubreddits: this._id,
  });

  this.subscribers = subscriberCount;
  await this.save();
};

module.exports = mongoose.model("Subreddit", SubredditSchema);
