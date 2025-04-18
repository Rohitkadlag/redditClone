// server/models/Report.js
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    // Type of content being reported
    targetType: {
      type: String,
      enum: ["post", "comment", "user", "subreddit"],
      required: true,
    },

    // ID of the content being reported
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },

    // Who reported the content
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reason for the report
    reason: {
      type: String,
      required: true,
      enum: [
        "spam",
        "harassment",
        "threatening_violence",
        "hate",
        "self_harm",
        "misinformation",
        "copyright",
        "impersonation",
        "sexual_minors",
        "prohibited_transaction",
        "breaking_subreddit_rules",
        "other",
      ],
    },

    // Additional description provided by the reporter
    description: {
      type: String,
      default: "",
    },

    // Current status of the report
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },

    // Resolution note added by moderator
    resolution: {
      type: String,
      default: "",
    },

    // Moderator who resolved the report
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // When the report was resolved
    resolvedAt: {
      type: Date,
    },

    // Action taken on the reported content
    actionTaken: {
      type: String,
      enum: [
        "none",
        "removed",
        "user_warned",
        "user_suspended",
        "user_banned",
        "post_removed", // Add this
        "comment_removed",
      ],
      default: "none",
    },

    // Subreddit where the report was made (if applicable)
    subreddit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subreddit",
    },

    // Preview of the reported content
    contentPreview: {
      type: String,
      default: "",
    },

    // URL to the reported content
    contentUrl: {
      type: String,
      default: "",
    },

    // Timestamps
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

// Update the updatedAt timestamp before saving
ReportSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Helper method to get the target content
ReportSchema.methods.getTargetContent = async function () {
  let Model;

  switch (this.targetType) {
    case "post":
      Model = require("./Post");
      break;
    case "comment":
      Model = require("./Comment");
      break;
    case "user":
      Model = require("./User");
      break;
    case "subreddit":
      Model = require("./Subreddit");
      break;
    default:
      return null;
  }

  return await Model.findById(this.targetId);
};

module.exports = mongoose.model("Report", ReportSchema);
