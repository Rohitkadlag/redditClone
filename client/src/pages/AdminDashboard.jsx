// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../services/api";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch overview statistics
        const statsResponse = await api.get("/admin/stats");
        setStats(statsResponse.data.data);

        // Fetch users
        const usersResponse = await api.get("/admin/users?limit=10");
        setUsers(usersResponse.data.data);

        // Fetch communities
        const communitiesResponse = await api.get("/admin/subreddits?limit=10");
        setCommunities(communitiesResponse.data.data);

        // Fetch reports
        const reportsResponse = await api.get("/admin/reports?limit=10");
        setReports(reportsResponse.data.data);

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching dashboard data"
        );
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle promoting a user to moderator
  const handlePromoteToModerator = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: "moderator" });

      // Update the local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: "moderator" } : user
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user role");
    }
  };

  // Handle suspending a user
  const handleSuspendUser = async (userId) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      try {
        await api.put(`/admin/users/${userId}/suspend`);

        // Update the local state
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, isSuspended: true } : user
          )
        );
      } catch (err) {
        setError(err.response?.data?.message || "Failed to suspend user");
      }
    }
  };

  // Handle fixing a reported issue
  const handleResolveReport = async (reportId) => {
    try {
      await api.put(`/admin/reports/${reportId}/resolve`);

      // Update the local state
      setReports(reports.filter((report) => report._id !== reportId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resolve report");
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Check if user has admin permissions
  const isAdmittyManager = user?.role === "admitty_manager";
  const isAdmin = user?.role === "admin" || isAdmittyManager;

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert
          type="error"
          message="You don't have permission to access this page"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isAdmittyManager ? "Admitty Manager Dashboard" : "Admin Dashboard"}
        </h1>
        <div className="flex items-center">
          <span className="mr-2 text-sm">Logged in as:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
            {isAdmittyManager ? "Admitty Manager" : "Admin"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "overview"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "users"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "communities"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("communities")}
        >
          Communities
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "reports"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Tab content */}
      {activeTab === "overview" && stats && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Users
              </h3>
              <p className="text-3xl font-bold">{stats.userCount}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.newUsersToday} new today
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Communities
              </h3>
              <p className="text-3xl font-bold">{stats.communityCount}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.activeCommunitiesToday} active today
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Posts
              </h3>
              <p className="text-3xl font-bold">{stats.postCount}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.postsToday} created today
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Users</h3>
                <Link
                  to="/admin/users"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Reports</h3>
                <Link
                  to="/admin/reports"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div key={report._id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {report.type}: {report.targetId}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {report.reason}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reported by: {report.reportedBy.username}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">User Management</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search users..."
                className="border rounded px-3 py-1 text-sm"
              />
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Search
              </button>
            </div>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar || "/default-avatar.png"}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admitty_manager"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "moderator"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isSuspended
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      {user.role === "user" && (
                        <button
                          onClick={() => handlePromoteToModerator(user._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Promote
                        </button>
                      )}
                      {!user.isSuspended &&
                        user.role !== "admitty_manager" &&
                        user.role !== "admin" && (
                          <button
                            onClick={() => handleSuspendUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Suspend
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 flex justify-between items-center border-t">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{users.length}</span> of{" "}
              <span className="font-medium">
                {stats?.userCount || "loading..."}
              </span>{" "}
              users
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "communities" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Communities Management</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search communities..."
                className="border rounded px-3 py-1 text-sm"
              />
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Search
              </button>
            </div>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Community
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {communities.map((community) => (
                <tr key={community._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={community.icon || "/default-community.png"}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          r/{community.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {community.description?.substring(0, 30)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {community.subscribers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(community.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        community.isPrivate
                          ? "bg-yellow-100 text-yellow-800"
                          : community.isRestricted
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {community.isPrivate
                        ? "Private"
                        : community.isRestricted
                        ? "Restricted"
                        : "Public"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/r/${community.name}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/communities/${community._id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Manage
                      </Link>
                      {community.isNSFW && (
                        <button className="text-red-600 hover:text-red-900">
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 flex justify-between items-center border-t">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{communities.length}</span> of{" "}
              <span className="font-medium">
                {stats?.communityCount || "loading..."}
              </span>{" "}
              communities
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Reports Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage reported content and take action on violations
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {reports.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No pending reports</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report._id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                        {report.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        Reported{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium">
                      Report Reason: {report.reason}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {report.description}
                    </p>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                      <p className="font-medium">Reported Content:</p>
                      <p className="mt-1">
                        {report.contentPreview || "Content not available"}
                      </p>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Reported by: </span>
                      <Link
                        to={`/user/${report.reportedBy.username}`}
                        className="text-blue-600 hover:underline"
                      >
                        {report.reportedBy.username}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3 justify-end">
                    <button
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      onClick={() => window.open(report.contentUrl, "_blank")}
                    >
                      View Content
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => {
                        // This would be a more complex action in a real implementation
                        alert(
                          "Remove content and warn user functionality would go here"
                        );
                      }}
                    >
                      Remove & Warn
                    </button>
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handleResolveReport(report._id)}
                    >
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
