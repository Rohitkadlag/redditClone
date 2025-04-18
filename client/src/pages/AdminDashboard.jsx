// // src/pages/AdminDashboard.jsx
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import api from "../services/api";
// import Alert from "../components/common/Alert";
// import Loading from "../components/common/Loading";

// function AdminDashboard() {
//   const { user } = useSelector((state) => state.auth);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [stats, setStats] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [communities, setCommunities] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // Fetch overview statistics
//         const statsResponse = await api.get("/admin/stats");
//         setStats(statsResponse.data.data);

//         // Fetch users
//         const usersResponse = await api.get("/admin/users?limit=10");
//         setUsers(usersResponse.data.data);

//         // Fetch communities
//         const communitiesResponse = await api.get("/admin/subreddits?limit=10");
//         setCommunities(communitiesResponse.data.data);

//         // Fetch reports
//         const reportsResponse = await api.get("/admin/reports?limit=10");
//         setReports(reportsResponse.data.data);

//         setLoading(false);
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Error fetching dashboard data"
//         );
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Handle promoting a user to moderator
//   const handlePromoteToModerator = async (userId) => {
//     try {
//       await api.put(`/admin/users/${userId}/role`, { role: "moderator" });

//       // Update the local state
//       setUsers(
//         users.map((user) =>
//           user._id === userId ? { ...user, role: "moderator" } : user
//         )
//       );
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update user role");
//     }
//   };

//   // Handle suspending a user
//   const handleSuspendUser = async (userId) => {
//     if (window.confirm("Are you sure you want to suspend this user?")) {
//       try {
//         await api.put(`/admin/users/${userId}/suspend`);

//         // Update the local state
//         setUsers(
//           users.map((user) =>
//             user._id === userId ? { ...user, isSuspended: true } : user
//           )
//         );
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to suspend user");
//       }
//     }
//   };

//   // Handle fixing a reported issue
//   const handleResolveReport = async (reportId) => {
//     try {
//       await api.put(`/admin/reports/${reportId}/resolve`);

//       // Update the local state
//       setReports(reports.filter((report) => report._id !== reportId));
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to resolve report");
//     }
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   // Check if user has admin permissions
//   const isAdmittyManager = user?.role === "admitty_manager";
//   const isAdmin = user?.role === "admin" || isAdmittyManager;

//   if (!isAdmin) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <Alert
//           type="error"
//           message="You don't have permission to access this page"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">
//           {isAdmittyManager ? "Admitty Manager Dashboard" : "Admin Dashboard"}
//         </h1>
//         <div className="flex items-center">
//           <span className="mr-2 text-sm">Logged in as:</span>
//           <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
//             {isAdmittyManager ? "Admitty Manager" : "Admin"}
//           </span>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b mb-6">
//         <button
//           className={`px-4 py-2 ${
//             activeTab === "overview"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("overview")}
//         >
//           Overview
//         </button>
//         <button
//           className={`px-4 py-2 ${
//             activeTab === "users"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("users")}
//         >
//           Users
//         </button>
//         <button
//           className={`px-4 py-2 ${
//             activeTab === "communities"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("communities")}
//         >
//           Communities
//         </button>
//         <button
//           className={`px-4 py-2 ${
//             activeTab === "reports"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-600"
//           }`}
//           onClick={() => setActiveTab("reports")}
//         >
//           Reports
//         </button>
//       </div>

//       {error && <Alert type="error" message={error} />}

//       {/* Tab content */}
//       {activeTab === "overview" && stats && (
//         <div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 Total Users
//               </h3>
//               <p className="text-3xl font-bold">{stats.userCount}</p>
//               <p className="text-sm text-gray-500 mt-2">
//                 {stats.newUsersToday} new today
//               </p>
//             </div>
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 Communities
//               </h3>
//               <p className="text-3xl font-bold">{stats.communityCount}</p>
//               <p className="text-sm text-gray-500 mt-2">
//                 {stats.activeCommunitiesToday} active today
//               </p>
//             </div>
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 Posts
//               </h3>
//               <p className="text-3xl font-bold">{stats.postCount}</p>
//               <p className="text-sm text-gray-500 mt-2">
//                 {stats.postsToday} created today
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Recent Users</h3>
//                 <Link
//                   to="/admin/users"
//                   className="text-blue-600 text-sm hover:underline"
//                 >
//                   View All
//                 </Link>
//               </div>
//               <div className="space-y-4">
//                 {users.slice(0, 5).map((user) => (
//                   <div
//                     key={user._id}
//                     className="flex items-center justify-between"
//                   >
//                     <div className="flex items-center">
//                       <img
//                         src={user.avatar || "/default-avatar.png"}
//                         alt={user.username}
//                         className="w-8 h-8 rounded-full mr-3"
//                       />
//                       <div>
//                         <p className="font-medium">{user.username}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                     <span className="text-xs px-2 py-1 bg-gray-100 rounded">
//                       {user.role}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Recent Reports</h3>
//                 <Link
//                   to="/admin/reports"
//                   className="text-blue-600 text-sm hover:underline"
//                 >
//                   View All
//                 </Link>
//               </div>
//               <div className="space-y-4">
//                 {reports.slice(0, 5).map((report) => (
//                   <div key={report._id} className="p-3 bg-gray-50 rounded-md">
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">
//                         {report.type}: {report.targetId}
//                       </span>
//                       <span
//                         className={`text-xs px-2 py-1 rounded ${
//                           report.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {report.status}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-1">
//                       {report.reason}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Reported by: {report.reportedBy.username}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeTab === "users" && (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="flex justify-between items-center p-4 border-b">
//             <h2 className="text-lg font-semibold">User Management</h2>
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 className="border rounded px-3 py-1 text-sm"
//               />
//               <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
//                 Search
//               </button>
//             </div>
//           </div>
//           <table className="min-w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   User
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Joined
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10">
//                         <img
//                           className="h-10 w-10 rounded-full"
//                           src={user.avatar || "/default-avatar.png"}
//                           alt=""
//                         />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.username}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         user.role === "admitty_manager"
//                           ? "bg-purple-100 text-purple-800"
//                           : user.role === "admin"
//                           ? "bg-red-100 text-red-800"
//                           : user.role === "moderator"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         user.isSuspended
//                           ? "bg-red-100 text-red-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {user.isSuspended ? "Suspended" : "Active"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex justify-end space-x-2">
//                       <Link
//                         to={`/admin/users/${user._id}`}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         View
//                       </Link>
//                       {user.role === "user" && (
//                         <button
//                           onClick={() => handlePromoteToModerator(user._id)}
//                           className="text-green-600 hover:text-green-900"
//                         >
//                           Promote
//                         </button>
//                       )}
//                       {!user.isSuspended &&
//                         user.role !== "admitty_manager" &&
//                         user.role !== "admin" && (
//                           <button
//                             onClick={() => handleSuspendUser(user._id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             Suspend
//                           </button>
//                         )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="px-6 py-4 flex justify-between items-center border-t">
//             <span className="text-sm text-gray-500">
//               Showing <span className="font-medium">1</span> to{" "}
//               <span className="font-medium">{users.length}</span> of{" "}
//               <span className="font-medium">
//                 {stats?.userCount || "loading..."}
//               </span>{" "}
//               users
//             </span>
//             <div className="flex space-x-2">
//               <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
//                 Previous
//               </button>
//               <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeTab === "communities" && (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="flex justify-between items-center p-4 border-b">
//             <h2 className="text-lg font-semibold">Communities Management</h2>
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 placeholder="Search communities..."
//                 className="border rounded px-3 py-1 text-sm"
//               />
//               <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
//                 Search
//               </button>
//             </div>
//           </div>
//           <table className="min-w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Community
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Members
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {communities.map((community) => (
//                 <tr key={community._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10">
//                         <img
//                           className="h-10 w-10 rounded-full"
//                           src={community.icon || "/default-community.png"}
//                           alt=""
//                         />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           r/{community.name}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {community.description?.substring(0, 30)}...
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {community.subscribers}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(community.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         community.isPrivate
//                           ? "bg-yellow-100 text-yellow-800"
//                           : community.isRestricted
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {community.isPrivate
//                         ? "Private"
//                         : community.isRestricted
//                         ? "Restricted"
//                         : "Public"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex justify-end space-x-2">
//                       <Link
//                         to={`/r/${community.name}`}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         View
//                       </Link>
//                       <Link
//                         to={`/admin/communities/${community._id}`}
//                         className="text-green-600 hover:text-green-900"
//                       >
//                         Manage
//                       </Link>
//                       {community.isNSFW && (
//                         <button className="text-red-600 hover:text-red-900">
//                           Review
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="px-6 py-4 flex justify-between items-center border-t">
//             <span className="text-sm text-gray-500">
//               Showing <span className="font-medium">1</span> to{" "}
//               <span className="font-medium">{communities.length}</span> of{" "}
//               <span className="font-medium">
//                 {stats?.communityCount || "loading..."}
//               </span>{" "}
//               communities
//             </span>
//             <div className="flex space-x-2">
//               <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
//                 Previous
//               </button>
//               <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeTab === "reports" && (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="p-4 border-b">
//             <h2 className="text-lg font-semibold">Reports Management</h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Manage reported content and take action on violations
//             </p>
//           </div>
//           <div className="divide-y divide-gray-200">
//             {reports.length === 0 ? (
//               <div className="p-6 text-center">
//                 <p className="text-gray-500">No pending reports</p>
//               </div>
//             ) : (
//               reports.map((report) => (
//                 <div key={report._id} className="p-4">
//                   <div className="flex justify-between">
//                     <div>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
//                         {report.type}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         Reported{" "}
//                         {new Date(report.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         report.status === "pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {report.status}
//                     </span>
//                   </div>
//                   <div className="mt-2">
//                     <h3 className="font-medium">
//                       Report Reason: {report.reason}
//                     </h3>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {report.description}
//                     </p>
//                     <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
//                       <p className="font-medium">Reported Content:</p>
//                       <p className="mt-1">
//                         {report.contentPreview || "Content not available"}
//                       </p>
//                     </div>
//                     <div className="mt-2 text-sm">
//                       <span className="text-gray-500">Reported by: </span>
//                       <Link
//                         to={`/user/${report.reportedBy.username}`}
//                         className="text-blue-600 hover:underline"
//                       >
//                         {report.reportedBy.username}
//                       </Link>
//                     </div>
//                   </div>
//                   <div className="mt-4 flex space-x-3 justify-end">
//                     <button
//                       className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
//                       onClick={() => window.open(report.contentUrl, "_blank")}
//                     >
//                       View Content
//                     </button>
//                     <button
//                       className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                       onClick={() => {
//                         // This would be a more complex action in a real implementation
//                         alert(
//                           "Remove content and warn user functionality would go here"
//                         );
//                       }}
//                     >
//                       Remove & Warn
//                     </button>
//                     <button
//                       className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                       onClick={() => handleResolveReport(report._id)}
//                     >
//                       Mark as Resolved
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;

// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../services/api";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";
import Pagination from "../components/common/Pagination";
import ReportManagement from "../components/admin/ReportManagement";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Pagination
  const [userPage, setUserPage] = useState(1);
  const [communityPage, setCommunityPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const [pagination, setPagination] = useState({
    users: { page: 1, pages: 1, total: 0 },
    communities: { page: 1, pages: 1, total: 0 },
    reports: { page: 1, pages: 1, total: 0 },
  });

  // Search filters
  const [userSearch, setUserSearch] = useState("");
  const [communitySearch, setCommunitySearch] = useState("");
  const [reportFilter, setReportFilter] = useState("pending");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch overview statistics
      const statsResponse = await api.get("/admin/stats");
      setStats(statsResponse.data.data);

      // Initial data load
      await loadUsers(1);
      await loadCommunities(1);
      await loadReports(1);

      setLoading(false);
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
      setError(err.response?.data?.message || "Error fetching dashboard data");
      setLoading(false);
    }
  };

  const loadUsers = async (page = 1, search = userSearch) => {
    try {
      setUserLoading(true);

      // Build query parameters
      const params = {
        page,
        limit: 10,
      };

      if (search) {
        params.search = search;
      }

      const response = await api.get("/admin/users", { params });
      setUsers(response.data.data);
      setPagination((prev) => ({
        ...prev,
        users: {
          page: response.data.pagination.page,
          pages: response.data.pagination.pages,
          total: response.data.pagination.total,
        },
      }));
      setUserLoading(false);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err.response?.data?.message || "Failed to load users");
      setUserLoading(false);
    }
  };

  const loadCommunities = async (page = 1, search = communitySearch) => {
    try {
      setCommunityLoading(true);

      // Build query parameters
      const params = {
        page,
        limit: 10,
      };

      if (search) {
        params.search = search;
      }

      const response = await api.get("/admin/subreddits", { params });
      setCommunities(response.data.data);
      setPagination((prev) => ({
        ...prev,
        communities: {
          page: response.data.pagination.page,
          pages: response.data.pagination.pages,
          total: response.data.pagination.total,
        },
      }));
      setCommunityLoading(false);
    } catch (err) {
      console.error("Error loading communities:", err);
      setError(err.response?.data?.message || "Failed to load communities");
      setCommunityLoading(false);
    }
  };

  const loadReports = async (page = 1, status = reportFilter) => {
    try {
      setReportLoading(true);

      // Build query parameters
      const params = {
        page,
        limit: 10,
        status,
      };

      const response = await api.get("/admin/reports", { params });
      setReports(response.data.data);
      setPagination((prev) => ({
        ...prev,
        reports: {
          page: response.data.pagination.page,
          pages: response.data.pagination.pages,
          total: response.data.pagination.total,
        },
      }));
      setReportLoading(false);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err.response?.data?.message || "Failed to load reports");
      setReportLoading(false);
    }
  };

  // Initialize dashboard data
  useEffect(() => {
    loadDashboard();
  }, []);

  // Handle promoting a user to moderator
  const handlePromoteToModerator = async (userId, username) => {
    try {
      setError(null);
      setUserLoading(true);

      // Call the API to update user role
      await api.put(`/admin/users/${userId}/role`, { role: "moderator" });

      // Update the local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: "moderator" } : user
        )
      );

      // Show success message
      setSuccessMessage(
        `User ${username} has been promoted to moderator successfully`
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

      setUserLoading(false);
    } catch (err) {
      console.error("Error promoting user:", err);
      setError(err.response?.data?.message || "Failed to update user role");
      setUserLoading(false);
    }
  };

  // Function to handle demoting a moderator to regular user
  const handleDemoteToUser = async (userId, username) => {
    try {
      if (
        !window.confirm(
          `Are you sure you want to demote ${username} to regular user?`
        )
      ) {
        return;
      }

      setError(null);
      setUserLoading(true);

      // Call the API to update user role
      await api.put(`/admin/users/${userId}/role`, { role: "user" });

      // Update the local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: "user" } : user
        )
      );

      // Show success message
      setSuccessMessage(`User ${username} has been demoted to regular user`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

      setUserLoading(false);
    } catch (err) {
      console.error("Error demoting user:", err);
      setError(err.response?.data?.message || "Failed to update user role");
      setUserLoading(false);
    }
  };
  // Handle suspending a user
  const handleSuspendUser = async (userId, username) => {
    try {
      const suspensionDuration = window.prompt(
        `Enter suspension duration in days for ${username} (Leave empty for permanent suspension):`,
        "7"
      );

      // If user cancels the prompt
      if (suspensionDuration === null) {
        return;
      }

      const duration = suspensionDuration
        ? parseInt(suspensionDuration, 10)
        : null;

      // Confirmation dialog
      if (
        !window.confirm(
          `Are you sure you want to suspend ${username}${
            duration ? ` for ${duration} days` : " permanently"
          }?`
        )
      ) {
        return;
      }

      setError(null);
      setUserLoading(true);

      // Get suspension reason
      const reason = window.prompt(
        "Enter reason for suspension (will be visible to the user):",
        "Violation of community guidelines"
      );

      if (reason === null) return; // User canceled

      // Call the API to suspend user
      await api.put(`/admin/users/${userId}/suspend`, {
        reason: reason || "Violation of community guidelines",
        duration: duration, // If null or undefined, it will be permanent
      });

      // Update the local state
      setUsers(
        users.map((user) =>
          user._id === userId
            ? {
                ...user,
                isSuspended: true,
                suspensionReason: reason || "Violation of community guidelines",
                suspensionEndDate: duration
                  ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
                  : null,
              }
            : user
        )
      );

      // Show success message
      setSuccessMessage(
        `User ${username} has been suspended${
          duration ? ` for ${duration} days` : " permanently"
        }`
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

      setUserLoading(false);
    } catch (err) {
      console.error("Error suspending user:", err);
      setError(err.response?.data?.message || "Failed to suspend user");
      setUserLoading(false);
    }
  };

  // Function to unsuspend a user
  const handleUnsuspendUser = async (userId, username) => {
    try {
      if (
        !window.confirm(
          `Are you sure you want to remove the suspension for ${username}?`
        )
      ) {
        return;
      }

      setError(null);
      setUserLoading(true);

      // Call the API to unsuspend user
      await api.put(`/admin/users/${userId}/unsuspend`);

      // Update the local state
      setUsers(
        users.map((user) =>
          user._id === userId
            ? {
                ...user,
                isSuspended: false,
                suspensionReason: null,
                suspensionEndDate: null,
              }
            : user
        )
      );

      // Show success message
      setSuccessMessage(`User ${username} has been unsuspended successfully`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

      setUserLoading(false);
    } catch (err) {
      console.error("Error unsuspending user:", err);
      setError(err.response?.data?.message || "Failed to unsuspend user");
      setUserLoading(false);
    }
  };
  // Handle resolving a report
  const handleResolveReport = async (reportId) => {
    try {
      await api.put(`/admin/reports/${reportId}/resolve`, {
        resolution: "Issue addressed by moderator",
        action: "removed",
      });

      // Update the local state - remove the resolved report
      setReports(reports.filter((report) => report._id !== reportId));

      // Show success message
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resolve report");
    }
  };

  // Handle search form submissions
  const handleUserSearch = (e) => {
    e.preventDefault();
    setUserPage(1);
    loadUsers(1, userSearch);
  };

  const handleCommunitySearch = (e) => {
    e.preventDefault();
    setCommunityPage(1);
    loadCommunities(1, communitySearch);
  };

  const handleReportFilterChange = (status) => {
    setReportFilter(status);
    setReportPage(1);
    loadReports(1, status);
  };

  // Handle pagination changes
  const handleUserPageChange = (page) => {
    setUserPage(page);
    loadUsers(page);
  };

  const handleCommunityPageChange = (page) => {
    setCommunityPage(page);
    loadCommunities(page);
  };

  const handleReportPageChange = (page) => {
    setReportPage(page);
    loadReports(page);
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

      {/* Show error message if there's an error */}
      {error && <Alert type="error" message={error} />}

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
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View All
                </button>
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
                <button
                  onClick={() => setActiveTab("reports")}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div key={report._id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {report.type}: {report.reason}
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
                      {report.description || "No description provided"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reported by: {report.reportedBy?.username || "Unknown"}
                    </p>
                  </div>
                ))}
                {reports.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No pending reports
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">User Management</h2>
            <form onSubmit={handleUserSearch} className="flex space-x-2">
              <input
                type="text"
                placeholder="Search users..."
                className="border rounded px-3 py-1 text-sm"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="m-4">
              <Alert type="success" message={successMessage} />
            </div>
          )}

          {userLoading ? (
            <div className="p-6">
              <Loading />
            </div>
          ) : (
            <>
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
                              alt={user.username}
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
                        {user.isSuspended ? (
                          <div>
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Suspended
                            </span>
                            {user.suspensionEndDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Until:{" "}
                                {new Date(
                                  user.suspensionEndDate
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {user.suspensionReason && (
                              <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                Reason: {user.suspensionReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/user/${user.username}`}
                            className="text-blue-600 hover:text-blue-900"
                            target="_blank"
                          >
                            View
                          </Link>

                          {/* Role management */}
                          {user.role === "user" &&
                            user.role !== "admitty_manager" &&
                            user.role !== "admin" && (
                              <button
                                onClick={() =>
                                  handlePromoteToModerator(
                                    user._id,
                                    user.username
                                  )
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                Promote
                              </button>
                            )}

                          {user.role === "moderator" && (
                            <button
                              onClick={() =>
                                handleDemoteToUser(user._id, user.username)
                              }
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Demote
                            </button>
                          )}

                          {/* Suspension management */}
                          {!user.isSuspended &&
                            user.role !== "admitty_manager" &&
                            user.role !== "admin" && (
                              <button
                                onClick={() =>
                                  handleSuspendUser(user._id, user.username)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Suspend
                              </button>
                            )}

                          {user.isSuspended && (
                            <button
                              onClick={() =>
                                handleUnsuspendUser(user._id, user.username)
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Unsuspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {pagination.users.pages > 1 && (
                <div className="px-6 py-4 flex justify-center border-t">
                  <Pagination
                    currentPage={pagination.users.page}
                    totalPages={pagination.users.pages}
                    onPageChange={handleUserPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
      {activeTab === "communities" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Communities Management</h2>
            <form onSubmit={handleCommunitySearch} className="flex space-x-2">
              <input
                type="text"
                placeholder="Search communities..."
                className="border rounded px-3 py-1 text-sm"
                value={communitySearch}
                onChange={(e) => setCommunitySearch(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Search
              </button>
            </form>
          </div>

          {communityLoading ? (
            <div className="p-6">
              <Loading />
            </div>
          ) : (
            <>
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
                            to={`/r/${community.name}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Manage
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {communities.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No communities found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {pagination.communities.pages > 1 && (
                <div className="px-6 py-4 flex justify-center border-t">
                  <Pagination
                    currentPage={pagination.communities.page}
                    totalPages={pagination.communities.pages}
                    onPageChange={handleCommunityPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "reports" && <ReportManagement />}
    </div>
  );
}

export default AdminDashboard;
