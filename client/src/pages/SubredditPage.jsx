// // src/pages/SubredditPage.jsx
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSubreddit,
//   joinSubreddit,
// } from "../features/subreddits/subredditsSlice";
// import { fetchPosts } from "../features/posts/postsSlice";
// import { joinSubreddit as joinSubredditSocket } from "../services/socket";
// import PostsList from "../components/post/PostsList";
// import Loading from "../components/common/Loading";
// import Alert from "../components/common/Alert";
// import Pagination from "../components/common/Pagination";
// import { UserIcon, UsersIcon, CalendarIcon } from "@heroicons/react/outline";
// import { formatDistanceToNow } from "date-fns";

// function SubredditPage() {
//   const { subredditName } = useParams();
//   const dispatch = useDispatch();
//   const {
//     currentSubreddit,
//     loading: subredditLoading,
//     error: subredditError,
//   } = useSelector((state) => state.subreddits);
//   const {
//     posts,
//     loading: postsLoading,
//     pagination,
//   } = useSelector((state) => state.posts);
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const [sortBy, setSortBy] = useState("new");

//   useEffect(() => {
//     if (subredditName) {
//       dispatch(fetchSubreddit(subredditName));
//     }
//   }, [dispatch, subredditName]);

//   useEffect(() => {
//     if (currentSubreddit) {
//       dispatch(fetchPosts({ subreddit: currentSubreddit._id, sortBy }));

//       // Join websocket room for real-time updates
//       joinSubredditSocket(currentSubreddit._id);
//     }
//   }, [dispatch, currentSubreddit, sortBy]);

//   const handleJoinLeave = () => {
//     if (isAuthenticated && currentSubreddit) {
//       const action = currentSubreddit.isJoined ? "leave" : "join";
//       dispatch(
//         joinSubreddit({
//           subredditId: currentSubreddit._id,
//           action,
//         })
//       );
//     }
//   };

//   const handleSortChange = (newSortBy) => {
//     setSortBy(newSortBy);
//   };

//   if (subredditLoading) {
//     return <Loading />;
//   }

//   if (subredditError) {
//     return <Alert type="error" message={subredditError} />;
//   }

//   if (!currentSubreddit) {
//     return <Alert type="error" message="Subreddit not found" />;
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Subreddit Banner */}
//       <div
//         className="h-32 bg-cover bg-center rounded-t-lg"
//         style={{
//           backgroundColor: "#0079D3",
//           backgroundImage: currentSubreddit.banner
//             ? `url(${currentSubreddit.banner})`
//             : "none",
//         }}
//       ></div>

//       {/* Subreddit Info */}
//       <div className="bg-white border border-reddit-border shadow rounded-b-lg p-4 mb-4">
//         <div className="flex items-start">
//           {/* Subreddit Icon */}
//           <div className="flex-shrink-0 -mt-8 mr-4">
//             <div className="w-16 h-16 rounded-full bg-white p-1 border border-reddit-border shadow-sm">
//               <div
//                 className="w-full h-full rounded-full bg-cover bg-center"
//                 style={{
//                   backgroundColor: "#FF4500",
//                   backgroundImage: currentSubreddit.icon
//                     ? `url(${currentSubreddit.icon})`
//                     : "none",
//                 }}
//               ></div>
//             </div>
//           </div>

//           {/* Subreddit Details */}
//           <div className="flex-1">
//             <div className="flex flex-col md:flex-row md:items-center justify-between">
//               <h1 className="text-2xl font-bold">r/{currentSubreddit.name}</h1>

//               {isAuthenticated && (
//                 <button
//                   onClick={handleJoinLeave}
//                   className={`mt-2 md:mt-0 btn ${
//                     currentSubreddit.isJoined ? "btn-secondary" : "btn-primary"
//                   }`}
//                 >
//                   {currentSubreddit.isJoined ? "Joined" : "Join"}
//                 </button>
//               )}
//             </div>

//             <p className="text-sm text-gray-500 mt-1">
//               {currentSubreddit.description}
//             </p>

//             <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
//               <div className="flex items-center">
//                 <UsersIcon className="h-4 w-4 mr-1" />
//                 {currentSubreddit.subscribers.toLocaleString()} members
//               </div>

//               <div className="flex items-center">
//                 <UserIcon className="h-4 w-4 mr-1" />
//                 Created by u/{currentSubreddit.creator?.username || "unknown"}
//               </div>

//               <div className="flex items-center">
//                 <CalendarIcon className="h-4 w-4 mr-1" />
//                 Created{" "}
//                 {formatDistanceToNow(new Date(currentSubreddit.createdAt), {
//                   addSuffix: true,
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Posts List */}
//         <div className="md:col-span-2">
//           <div className="bg-white rounded-lg shadow border border-reddit-border">
//             {/* Create Post Bar */}
//             {isAuthenticated && (
//               <div className="p-4 border-b">
//                 <Link
//                   to="/submit"
//                   className="input flex items-center text-gray-500 hover:bg-gray-100"
//                 >
//                   <span>Create Post</span>
//                 </Link>
//               </div>
//             )}

//             {/* Sort Options */}
//             <div className="flex space-x-4 p-4 border-b">
//               <button
//                 className={`font-medium ${
//                   sortBy === "new"
//                     ? "text-reddit-orange"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//                 onClick={() => handleSortChange("new")}
//               >
//                 New
//               </button>
//               <button
//                 className={`font-medium ${
//                   sortBy === "top"
//                     ? "text-reddit-orange"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//                 onClick={() => handleSortChange("top")}
//               >
//                 Top
//               </button>
//               <button
//                 className={`font-medium ${
//                   sortBy === "hot"
//                     ? "text-reddit-orange"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//                 onClick={() => handleSortChange("hot")}
//               >
//                 Hot
//               </button>
//             </div>

//             {/* Posts */}
//             <div className="p-4">
//               {postsLoading ? (
//                 <Loading />
//               ) : posts.length > 0 ? (
//                 <>
//                   <PostsList posts={posts} />

//                   {pagination.pages > 1 && (
//                     <Pagination
//                       currentPage={pagination.page}
//                       totalPages={pagination.pages}
//                       onPageChange={(page) =>
//                         dispatch(
//                           fetchPosts({
//                             subreddit: currentSubreddit._id,
//                             sortBy,
//                             page,
//                           })
//                         )
//                       }
//                     />
//                   )}
//                 </>
//               ) : (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No posts yet</p>
//                   {isAuthenticated && (
//                     <Link to="/submit" className="btn btn-primary mt-4">
//                       Create the first post
//                     </Link>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="md:col-span-1">
//           {/* About Community */}
//           <div className="bg-white rounded-lg shadow border border-reddit-border p-4 mb-4">
//             <h2 className="text-lg font-semibold mb-3">About Community</h2>
//             <p className="mb-4">{currentSubreddit.description}</p>

//             <div className="border-t pt-3">
//               <div className="font-medium mb-1">
//                 {currentSubreddit.subscribers.toLocaleString()} Members
//               </div>
//               <div className="text-sm text-gray-500">
//                 Created{" "}
//                 {new Date(currentSubreddit.createdAt).toLocaleDateString()}
//               </div>
//             </div>

//             {isAuthenticated && (
//               <div className="mt-4">
//                 <Link to="/submit" className="btn btn-primary w-full">
//                   Create Post
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Rules */}
//           {currentSubreddit.rules && currentSubreddit.rules.length > 0 && (
//             <div className="bg-white rounded-lg shadow border border-reddit-border p-4">
//               <h2 className="text-lg font-semibold mb-3">
//                 r/{currentSubreddit.name} Rules
//               </h2>

//               <div className="space-y-3">
//                 {currentSubreddit.rules.map((rule, index) => (
//                   <div
//                     key={index}
//                     className="border-b pb-2 last:border-b-0 last:pb-0"
//                   >
//                     <div className="font-medium">
//                       {index + 1}. {rule.title}
//                     </div>
//                     {rule.description && (
//                       <div className="text-sm text-gray-600 mt-1">
//                         {rule.description}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubredditPage;

// src/pages/SubredditPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";
import PostsList from "../components/post/PostsList";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import Pagination from "../components/common/Pagination";
import { UserIcon, UsersIcon, CalendarIcon } from "@heroicons/react/outline";
import { formatDistanceToNow } from "date-fns";

function SubredditPage() {
  const { subredditName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Local state
  const [subreddit, setSubreddit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("new");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Debug user state
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Current user:", user);
    }
  }, [isAuthenticated, user]);

  // Fetch subreddit data
  const fetchSubredditData = async () => {
    try {
      setLoading(true);
      console.log("Fetching subreddit data for:", subredditName);

      const response = await api.get(`/subreddits/${subredditName}`);
      const subredditData = response.data.data;

      console.log("Subreddit data received:", subredditData);

      // Make sure we have the correct joined status
      if (isAuthenticated && user) {
        // Check if this subreddit is in the user's followedSubreddits
        // (This assumes your auth state includes the user's followedSubreddits)
        console.log("Checking join status");

        if (!subredditData.isJoined) {
          // If the server didn't already set isJoined, let's check manually
          // You might want to add a dedicated endpoint for this check if needed
          try {
            // You can either check against user.followedSubreddits if it exists in your auth state,
            // or make an additional API call to check membership status
            const membershipResponse = await api.get(
              `/subreddits/${subredditData._id}/check-membership`
            );
            subredditData.isJoined = membershipResponse.data.isJoined;
            console.log("Membership check result:", subredditData.isJoined);
          } catch (membershipErr) {
            console.error("Error checking membership:", membershipErr);
            // Fallback to the server-provided isJoined value
          }
        }
      }

      setSubreddit(subredditData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subreddit");
      console.error("Error fetching subreddit:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts
  const fetchPosts = async (page = 1) => {
    if (!subreddit) return;

    try {
      setPostsLoading(true);
      const response = await api.get("/posts", {
        params: {
          subreddit: subreddit._id,
          sortBy,
          page,
        },
      });

      setPosts(response.data.data);
      setPagination({
        page: response.data.pagination?.page || 1,
        pages: response.data.pagination?.pages || 1,
        total: response.data.count || 0,
      });
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Initial data load - trigger whenever auth state changes
  useEffect(() => {
    if (subredditName) {
      fetchSubredditData();
    }
  }, [subredditName, isAuthenticated]);

  // Fetch posts when subreddit changes or sort changes
  useEffect(() => {
    if (subreddit) {
      fetchPosts();
    }
  }, [subreddit, sortBy]);

  // Handle join/leave action
  const handleJoinLeave = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/r/${subredditName}` } });
      return;
    }

    if (!subreddit) return;

    const action = subreddit.isJoined ? "leave" : "join";

    try {
      setJoinLoading(true);
      console.log(`Sending ${action} request for subreddit ${subreddit._id}`);

      const response = await api.post(`/subreddits/${subreddit._id}/join`, {
        action,
      });

      console.log(`${action} response:`, response.data);

      // Update local state with new data
      setSubreddit((prev) => ({
        ...prev,
        isJoined: response.data.data.isJoined,
        subscribers: response.data.data.subscribers,
      }));

      // After joining/leaving, fetch the subreddit data again to ensure consistency
      // This is optional but helps ensure the UI is in sync with the backend
      setTimeout(() => {
        fetchSubredditData();
      }, 500);
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      setError(`Failed to ${action} subreddit. Please try again.`);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!subreddit) {
    return <Alert type="error" message="Subreddit not found" />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Subreddit Banner */}
      <div
        className="h-32 bg-cover bg-center rounded-t-lg"
        style={{
          backgroundColor: "#0079D3",
          backgroundImage: subreddit.banner
            ? `url(${subreddit.banner})`
            : "none",
        }}
      ></div>

      {/* Subreddit Info */}
      <div className="bg-white border border-reddit-border shadow rounded-b-lg p-4 mb-4">
        <div className="flex items-start">
          {/* Subreddit Icon */}
          <div className="flex-shrink-0 -mt-8 mr-4">
            <div className="w-16 h-16 rounded-full bg-white p-1 border border-reddit-border shadow-sm">
              <div
                className="w-full h-full rounded-full bg-cover bg-center"
                style={{
                  backgroundColor: "#FF4500",
                  backgroundImage: subreddit.icon
                    ? `url(${subreddit.icon})`
                    : "none",
                }}
              ></div>
            </div>
          </div>

          {/* Subreddit Details */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h1 className="text-2xl font-bold">r/{subreddit.name}</h1>

              {isAuthenticated && (
                <button
                  onClick={handleJoinLeave}
                  disabled={joinLoading}
                  className={`mt-2 md:mt-0 px-4 py-2 rounded font-medium transition-colors ${
                    joinLoading
                      ? "opacity-50 cursor-not-allowed"
                      : subreddit.isJoined
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {joinLoading
                    ? "Processing..."
                    : subreddit.isJoined
                    ? "Joined ✓"
                    : "Join"}
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {subreddit.description}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 mr-1" />
                {subreddit.subscribers.toLocaleString()} members
              </div>

              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                Created by u/{subreddit.creator?.username || "unknown"}
              </div>

              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Created{" "}
                {formatDistanceToNow(new Date(subreddit.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Posts List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow border border-reddit-border">
            {/* Create Post Bar */}
            {isAuthenticated && (
              <div className="p-4 border-b">
                <Link
                  to={`/submit?subreddit=${subreddit._id}`}
                  className="input flex items-center text-gray-500 hover:bg-gray-100"
                >
                  <span>Create Post</span>
                </Link>
              </div>
            )}

            {/* Sort Options */}
            <div className="flex space-x-4 p-4 border-b">
              <button
                className={`font-medium ${
                  sortBy === "new"
                    ? "text-reddit-orange"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleSortChange("new")}
              >
                New
              </button>
              <button
                className={`font-medium ${
                  sortBy === "top"
                    ? "text-reddit-orange"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleSortChange("top")}
              >
                Top
              </button>
              <button
                className={`font-medium ${
                  sortBy === "hot"
                    ? "text-reddit-orange"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleSortChange("hot")}
              >
                Hot
              </button>
            </div>

            {/* Posts */}
            <div className="p-4">
              {postsLoading ? (
                <Loading />
              ) : posts.length > 0 ? (
                <>
                  <PostsList posts={posts} />

                  {pagination.pages > 1 && (
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts yet</p>
                  {isAuthenticated && (
                    <Link
                      to={`/submit?subreddit=${subreddit._id}`}
                      className="btn btn-primary mt-4"
                    >
                      Create the first post
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          {/* About Community */}
          <div className="bg-white rounded-lg shadow border border-reddit-border p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">About Community</h2>
            <p className="mb-4">{subreddit.description}</p>

            <div className="border-t pt-3">
              <div className="font-medium mb-1">
                {subreddit.subscribers.toLocaleString()} Members
              </div>
              <div className="text-sm text-gray-500">
                Created {new Date(subreddit.createdAt).toLocaleDateString()}
              </div>
            </div>

            {isAuthenticated && (
              <div className="mt-4">
                <Link
                  to={`/submit?subreddit=${subreddit._id}`}
                  className="btn btn-primary w-full"
                >
                  Create Post
                </Link>
              </div>
            )}
          </div>

          {/* Rules */}
          {subreddit.rules && subreddit.rules.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-reddit-border p-4">
              <h2 className="text-lg font-semibold mb-3">
                r/{subreddit.name} Rules
              </h2>

              <div className="space-y-3">
                {subreddit.rules.map((rule, index) => (
                  <div
                    key={index}
                    className="border-b pb-2 last:border-b-0 last:pb-0"
                  >
                    <div className="font-medium">
                      {index + 1}. {rule.title}
                    </div>
                    {rule.description && (
                      <div className="text-sm text-gray-600 mt-1">
                        {rule.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubredditPage;
