// server/controllers/reportController.js
const Report = require("../models/Report");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Subreddit = require("../models/Subreddit");

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    // Validate report type
    if (!["user", "post", "comment", "subreddit"].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report type",
      });
    }

    // Check if target exists
    let target;
    let contentPreview = "";
    let contentUrl = "";
    let subredditId = null;

    switch (targetType) {
      case "user":
        target = await User.findById(targetId);
        contentPreview = `User: ${target ? target.username : "Unknown"}`;
        contentUrl = `/user/${target ? target.username : "unknown"}`;
        break;
      case "post":
        target = await Post.findById(targetId).populate("subreddit", "name");
        contentPreview = target ? target.title : "Post content unavailable";
        contentUrl = target
          ? `/r/${target.subreddit.name}/posts/${target._id}`
          : "#";
        subredditId = target ? target.subreddit._id : null;
        break;
      case "comment":
        target = await Comment.findById(targetId).populate({
          path: "post",
          select: "subreddit",
          populate: {
            path: "subreddit",
            select: "name",
          },
        });
        contentPreview = target
          ? target.content.substring(0, 100) +
            (target.content.length > 100 ? "..." : "")
          : "Comment content unavailable";
        contentUrl =
          target && target.post
            ? `/r/${target.post.subreddit.name}/posts/${target.post._id}#comment-${target._id}`
            : "#";
        subredditId = target && target.post ? target.post.subreddit._id : null;
        break;
      case "subreddit":
        target = await Subreddit.findById(targetId);
        contentPreview = target
          ? `Subreddit: r/${target.name}`
          : "Subreddit unavailable";
        contentUrl = target ? `/r/${target.name}` : "#";
        subredditId = target ? target._id : null;
        break;
    }

    if (!target) {
      return res.status(404).json({
        success: false,
        message: `${
          targetType.charAt(0).toUpperCase() + targetType.slice(1)
        } not found`,
      });
    }

    // Create report
    const report = await Report.create({
      targetType,
      targetId,
      reportedBy: req.user._id,
      reason,
      description: description || "",
      status: "pending",
      contentPreview,
      contentUrl,
      subreddit: subredditId,
    });

    // Populate reportedBy for the response
    await report.populate("reportedBy", "username");

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get reports for current user
// @route   GET /api/reports/my-reports
// @access  Private
exports.getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("targetId", "username title content name")
      .populate("resolvedBy", "username");

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Cancel a report
// @route   DELETE /api/reports/:id
// @access  Private (only for the user who created the report)
exports.cancelReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Make sure user owns the report
    if (report.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this report",
      });
    }

    // Don't allow canceling if already resolved
    if (report.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a report that has already been processed",
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error canceling report:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
