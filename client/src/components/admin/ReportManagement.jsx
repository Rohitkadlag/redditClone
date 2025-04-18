// client/src/components/admin/ReportManagement.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FlagIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  DocumentTextIcon,
  ChatIcon,
  UsersIcon,
  TrashIcon,
  BanIcon,
  EyeIcon,
} from "@heroicons/react/outline";
import api from "../../services/api";
import Loading from "../common/Loading";
import Pagination from "../common/Pagination";
import Alert from "../common/Alert";

function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [resolutionNote, setResolutionNote] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Fetch reports on component mount and when filter or page changes
  useEffect(() => {
    fetchReports();
  }, [filterStatus, currentPage]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/admin/reports", {
        params: {
          status: filterStatus,
          page: currentPage,
          limit: 10,
        },
      });

      setReports(response.data.data);
      setTotalPages(Math.ceil(response.data.pagination.total / 10));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (reportId) => {
    if (expandedReport === reportId) {
      setExpandedReport(null);
    } else {
      setExpandedReport(reportId);
      setResolutionNote("");
    }
  };

  const handleViewContent = (url) => {
    navigate(url);
  };

  const handleResolveReport = async (reportId, action = "none") => {
    if (!resolutionNote && expandedReport === reportId) {
      setError("Please add a resolution note");
      return;
    }

    setActionLoading({ ...actionLoading, [reportId]: true });

    try {
      await api.put(`/admin/reports/${reportId}/resolve`, {
        resolution: resolutionNote || "Issue addressed by moderator",
        action: action,
      });

      // Update the local state
      setReports(
        reports.map((report) =>
          report._id === reportId
            ? {
                ...report,
                status: "resolved",
                resolution: resolutionNote || "Issue addressed by moderator",
              }
            : report
        )
      );

      setSuccessMessage("Report resolved successfully");
      setExpandedReport(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error resolving report:", error);
      setError(error.response?.data?.message || "Failed to resolve report");
    } finally {
      setActionLoading({ ...actionLoading, [reportId]: false });
    }
  };

  const handleRejectReport = async (reportId) => {
    setActionLoading({ ...actionLoading, [reportId]: true });

    try {
      await api.put(`/admin/reports/${reportId}/reject`, {
        resolution: resolutionNote || "Report rejected",
      });

      // Update the local state
      setReports(
        reports.map((report) =>
          report._id === reportId
            ? {
                ...report,
                status: "rejected",
                resolution: resolutionNote || "Report rejected",
              }
            : report
        )
      );

      setSuccessMessage("Report rejected");
      setExpandedReport(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error rejecting report:", error);
      setError(error.response?.data?.message || "Failed to reject report");
    } finally {
      setActionLoading({ ...actionLoading, [reportId]: false });
    }
  };

  // Handle taking action on a user
  const handleUserAction = async (userId, action, reportId) => {
    try {
      setActionLoading({ ...actionLoading, [reportId]: true });

      if (action === "ban") {
        const reason = prompt(
          "Enter reason for ban:",
          "Violation of community guidelines"
        );
        if (reason === null) return; // User canceled

        await api.put(`/admin/users/${userId}/ban`, { reason });
        await handleResolveReport(reportId, "user_banned");

        setSuccessMessage("User has been banned");
      } else if (action === "suspend") {
        const duration = prompt("Enter suspension duration in days:", "7");
        const reason = prompt(
          "Enter reason for suspension:",
          "Violation of community guidelines"
        );

        if (reason === null) return; // User canceled

        await api.put(`/admin/users/${userId}/suspend`, {
          reason,
          duration: duration ? parseInt(duration, 10) : 7,
        });

        await handleResolveReport(reportId, "user_suspended");
        setSuccessMessage(`User has been suspended for ${duration || 7} days`);
      } else if (action === "warn") {
        const warning = prompt(
          "Enter warning message:",
          "This is a warning for violating community guidelines."
        );

        if (warning === null) return; // User canceled

        await api.post(`/admin/users/${userId}/warn`, { message: warning });
        await handleResolveReport(reportId, "user_warned");

        setSuccessMessage("Warning has been sent to the user");
      } else if (action === "view") {
        // Find the user's username from the report
        const report = reports.find((r) => r._id === reportId);
        if (report && report.targetType === "user") {
          const targetUser = await api.get(`/users/${userId}`);
          if (targetUser.data.data.username) {
            navigate(`/user/${targetUser.data.data.username}`);
          }
        }
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error taking action on user:", error);
      setError(
        error.response?.data?.message || "Failed to take action on user"
      );
    } finally {
      setActionLoading({ ...actionLoading, [reportId]: false });
    }
  };

  // Handle taking action on a post
  const handlePostAction = async (postId, action, reportId) => {
    try {
      setActionLoading({ ...actionLoading, [reportId]: true });

      if (action === "remove") {
        const reason = prompt(
          "Enter reason for removal:",
          "Violation of community guidelines"
        );
        if (reason === null) return; // User canceled

        await api.delete(`/admin/posts/${postId}`, { data: { reason } });
        await handleResolveReport(reportId, "post_removed");

        setSuccessMessage("Post has been removed");
      } else if (action === "view") {
        // Navigate to the post - we'll need to get the subreddit name
        const reportData = reports.find((r) => r._id === reportId);
        if (reportData && reportData.contentUrl) {
          navigate(reportData.contentUrl);
        }
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error taking action on post:", error);
      setError(
        error.response?.data?.message || "Failed to take action on post"
      );
    } finally {
      setActionLoading({ ...actionLoading, [reportId]: false });
    }
  };

  // Handle taking action on a comment
  const handleCommentAction = async (commentId, action, reportId) => {
    try {
      setActionLoading({ ...actionLoading, [reportId]: true });

      if (action === "remove") {
        const reason = prompt(
          "Enter reason for removal:",
          "Violation of community guidelines"
        );
        if (reason === null) return; // User canceled

        await api.delete(`/admin/comments/${commentId}`, { data: { reason } });
        await handleResolveReport(reportId, "comment_removed");

        setSuccessMessage("Comment has been removed");
      } else if (action === "view") {
        // Navigate to the comment
        const reportData = reports.find((r) => r._id === reportId);
        if (reportData && reportData.contentUrl) {
          navigate(reportData.contentUrl);
        }
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error taking action on comment:", error);
      setError(
        error.response?.data?.message || "Failed to take action on comment"
      );
    } finally {
      setActionLoading({ ...actionLoading, [reportId]: false });
    }
  };

  // Handle taking action on a subreddit
  const handleSubredditAction = async (subredditId, action, reportId) => {
    try {
      setActionLoading({ ...actionLoading, [reportId]: true });

      if (action === "quarantine") {
        const reason = prompt(
          "Enter reason for quarantine:",
          "Violation of platform guidelines"
        );
        if (reason === null) return; // User canceled

        await api.put(`/admin/subreddits/${subredditId}/quarantine`, {
          reason,
        });
        await handleResolveReport(reportId, "subreddit_quarantined");

        setSuccessMessage("Subreddit has been quarantined");
      } else if (action === "ban") {
        const reason = prompt(
          "Enter reason for ban:",
          "Severe violation of platform guidelines"
        );
        if (reason === null) return; // User canceled

        await api.put(`/admin/subreddits/${subredditId}/ban`, { reason });
        await handleResolveReport(reportId, "subreddit_banned");

        setSuccessMessage("Subreddit has been banned");
      } else if (action === "view") {
        // Navigate to the subreddit
        const reportData = reports.find((r) => r._id === reportId);
        if (reportData && reportData.contentUrl) {
          navigate(reportData.contentUrl);
        }
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error taking action on subreddit:", error);
      setError(
        error.response?.data?.message || "Failed to take action on subreddit"
      );
    } finally {
      setActionLoading({ ...actionLoading, [reportId]: false });
    }
  };

  // Render target icon based on target type
  const renderTargetIcon = (targetType) => {
    switch (targetType) {
      case "user":
        return <UserIcon className="h-5 w-5 text-indigo-500" />;
      case "post":
        return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
      case "comment":
        return <ChatIcon className="h-5 w-5 text-blue-500" />;
      case "subreddit":
        return <UsersIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <FlagIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ExclamationCircleIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Resolved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Render action buttons based on target type
  const renderActionButtons = (report) => {
    const { _id, targetType, targetId } = report;

    switch (targetType) {
      case "user":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleUserAction(targetId, "ban", _id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <BanIcon className="h-3 w-3 mr-1" />
              Ban
            </button>
            <button
              onClick={() => handleUserAction(targetId, "suspend", _id)}
              className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <XCircleIcon className="h-3 w-3 mr-1" />
              Suspend
            </button>
            <button
              onClick={() => handleUserAction(targetId, "warn", _id)}
              className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <ExclamationCircleIcon className="h-3 w-3 mr-1" />
              Warn
            </button>
            <button
              onClick={() => handleUserAction(targetId, "view", _id)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <EyeIcon className="h-3 w-3 mr-1" />
              View
            </button>
          </div>
        );
      case "post":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handlePostAction(targetId, "remove", _id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <TrashIcon className="h-3 w-3 mr-1" />
              Remove
            </button>
            <button
              onClick={() => handlePostAction(targetId, "view", _id)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <EyeIcon className="h-3 w-3 mr-1" />
              View
            </button>
          </div>
        );
      case "comment":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleCommentAction(targetId, "remove", _id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <TrashIcon className="h-3 w-3 mr-1" />
              Remove
            </button>
            <button
              onClick={() => handleCommentAction(targetId, "view", _id)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <EyeIcon className="h-3 w-3 mr-1" />
              View
            </button>
          </div>
        );
      case "subreddit":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleSubredditAction(targetId, "quarantine", _id)}
              className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <ExclamationCircleIcon className="h-3 w-3 mr-1" />
              Quarantine
            </button>
            <button
              onClick={() => handleSubredditAction(targetId, "ban", _id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <BanIcon className="h-3 w-3 mr-1" />
              Ban
            </button>
            <button
              onClick={() => handleSubredditAction(targetId, "view", _id)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={actionLoading[_id]}
            >
              <EyeIcon className="h-3 w-3 mr-1" />
              View
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && reports.length === 0) {
    return <Loading />;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <FlagIcon className="h-5 w-5 mr-2 text-red-500" />
          Report Management
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage user reports
        </p>
      </div>

      {successMessage && (
        <div className="p-4">
          <Alert type="success" message={successMessage} />
        </div>
      )}

      {/* Filter controls */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <button
            onClick={() => {
              setFilterStatus("pending");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 text-sm rounded-full ${
              filterStatus === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              setFilterStatus("resolved");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 text-sm rounded-full ${
              filterStatus === "resolved"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => {
              setFilterStatus("rejected");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 text-sm rounded-full ${
              filterStatus === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => {
              setFilterStatus("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 text-sm rounded-full ${
              filterStatus === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            All
          </button>
        </div>
        <button
          onClick={fetchReports}
          className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4">
          <Alert type="error" message={error} />
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <FlagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No reports found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus === "pending"
              ? "There are no pending reports to review."
              : filterStatus === "resolved"
              ? "There are no resolved reports."
              : filterStatus === "rejected"
              ? "There are no rejected reports."
              : "There are no reports to display."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Content
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reason
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reporter
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderTargetIcon(report.targetType)}
                      <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                        {report.targetType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {report.contentPreview}
                    </div>
                    <button
                      onClick={() => handleViewContent(report.contentUrl)}
                      className="text-xs text-indigo-600 hover:text-indigo-900 mt-1"
                    >
                      View Content
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {report.reason.replace(/_/g, " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {report.reportedBy?.username || "Anonymous"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {report.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleToggleExpand(report._id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          {expandedReport === report._id ? "Cancel" : "Review"}
                        </button>
                        {renderActionButtons(report)}
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {report.resolution || "No details available"}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expanded report details and actions */}
      {expandedReport && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {reports.find((r) => r._id === expandedReport) && (
            <>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Resolution Details
              </h4>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Enter resolution details..."
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              ></textarea>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleRejectReport(expandedReport)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded flex items-center"
                  disabled={actionLoading[expandedReport]}
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject Report
                </button>
                <button
                  onClick={() => handleResolveReport(expandedReport)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded flex items-center"
                  disabled={actionLoading[expandedReport]}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Resolve Report
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}

export default ReportManagement;
