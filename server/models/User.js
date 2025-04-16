// Update to server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Notification schema (as a subdocument)
const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["comment", "reply", "mention", "post", "follow", "message", "mod"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must not be more than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    bio: {
      type: String,
      maxlength: [200, "Bio cannot be more than 200 characters"],
      default: "",
    },
    karma: {
      type: Number,
      default: 0,
    },
    // Updated role field with more granular permissions
    role: {
      type: String,
      enum: ["user", "moderator", "admin", "admitty_manager"],
      default: "user",
    },
    // Maintain backward compatibility with isAdmin field
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // List of subreddits this user has moderation powers for
    moderatedSubreddits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subreddit",
      },
    ],
    followedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followedSubreddits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subreddit",
      },
    ],
    notifications: [NotificationSchema],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
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

// Virtual field for posts
UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

// Set isAdmin based on role
UserSchema.pre("save", function (next) {
  // Set isAdmin field based on role for backward compatibility
  this.isAdmin = ["admin", "admitty_manager"].includes(this.role);

  next();
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role, // Include role in the JWT token
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add notification to user
UserSchema.methods.addNotification = async function (type, message, data = {}) {
  this.notifications.push({
    type,
    message,
    data,
    read: false,
  });

  await this.save();
};

// Check if user has specific permissions
UserSchema.methods.hasPermission = function (action) {
  const rolePermissions = {
    user: ["vote", "comment", "create_post"],
    moderator: [
      "vote",
      "comment",
      "create_post",
      "moderate_posts",
      "moderate_comments",
    ],
    admin: [
      "vote",
      "comment",
      "create_post",
      "moderate_posts",
      "moderate_comments",
      "manage_subreddits",
    ],
    admitty_manager: [
      "vote",
      "comment",
      "create_post",
      "moderate_posts",
      "moderate_comments",
      "manage_subreddits",
      "manage_users",
      "moderate_all_subreddits",
    ],
  };

  return rolePermissions[this.role]?.includes(action) || false;
};

// Check if user can moderate a specific subreddit
UserSchema.methods.canModerateSubreddit = function (subredditId) {
  // Admitty managers can moderate any subreddit
  if (this.role === "admitty_manager" || this.role === "admin") {
    return true;
  }

  // Check if user is a moderator for this specific subreddit
  return this.moderatedSubreddits.some(
    (id) => id.toString() === subredditId.toString()
  );
};

module.exports = mongoose.model("User", UserSchema);
