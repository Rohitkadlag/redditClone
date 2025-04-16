// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSubreddits,
//   joinSubreddit,
// } from "../../features/subreddits/subredditsSlice";
// import { Link } from "react-router-dom";
// import { UsersIcon, FireIcon } from "@heroicons/react/outline";

// const PopularCommunities = () => {
//   const dispatch = useDispatch();
//   const { subreddits, loading, error } = useSelector(
//     (state) => state.subreddits
//   );
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     // Fetch subreddits sorted by subscribers (most popular first)
//     dispatch(
//       fetchSubreddits({
//         sort: "subscribers",
//         limit: 20,
//       })
//     );
//   }, [dispatch]);

//   // Handle join/leave community
//   const handleJoinToggle = (subredditId, isJoined) => {
//     if (!isAuthenticated) {
//       // Redirect to login if not authenticated
//       window.location.href = "/login?redirect=/popular";
//       return;
//     }

//     const action = isJoined ? "leave" : "join";
//     dispatch(joinSubreddit({ subredditId, action }));
//   };

//   return (
//     <div className="container mx-auto px-4 py-6 max-w-5xl">
//       <div className="flex items-center mb-6">
//         <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
//         <h1 className="text-2xl font-bold text-gray-900">
//           Popular Communities
//         </h1>
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//           <div className="flex">
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Loading state */}
//       {loading && (
//         <div className="flex justify-center items-center p-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       )}

//       {/* Empty state */}
//       {!loading && subreddits.length === 0 && (
//         <div className="text-center py-10">
//           <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900">
//             No communities found
//           </h3>
//           <p className="mt-1 text-sm text-gray-500">
//             There are no communities available at this time.
//           </p>
//         </div>
//       )}

//       {/* Communities list */}
//       {!loading && subreddits.length > 0 && (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <ul className="divide-y divide-gray-200">
//             {subreddits.map((subreddit) => (
//               <li key={subreddit._id} className="hover:bg-gray-50">
//                 <div className="px-6 py-4 flex items-center justify-between">
//                   <div className="flex items-center flex-1 min-w-0">
//                     <div className="flex-shrink-0">
//                       {subreddit.icon ? (
//                         <img
//                           src={subreddit.icon}
//                           alt={subreddit.name}
//                           className="h-10 w-10 rounded-full"
//                         />
//                       ) : (
//                         <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
//                           <UsersIcon className="h-5 w-5 text-white" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="ml-4 flex-1 min-w-0">
//                       <Link to={`/r/${subreddit.name}`}>
//                         <h3 className="text-base font-medium text-gray-900 truncate hover:text-blue-600">
//                           r/{subreddit.name}
//                         </h3>
//                       </Link>
//                       <p className="text-sm text-gray-500 truncate">
//                         {subreddit.subscribers} members
//                       </p>
//                     </div>
//                     <div className="ml-4 flex-shrink-0">
//                       <p className="text-sm text-gray-500">
//                         {subreddit.posts ? `${subreddit.posts} posts` : ""}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <button
//                       onClick={() =>
//                         handleJoinToggle(subreddit._id, subreddit.isJoined)
//                       }
//                       className={`px-3 py-1 text-sm font-medium rounded-full ${
//                         subreddit.isJoined
//                           ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                           : "bg-blue-600 text-white hover:bg-blue-700"
//                       } transition-colors`}
//                     >
//                       {subreddit.isJoined ? "Joined" : "Join"}
//                     </button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopularCommunities;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UsersIcon, FireIcon } from "@heroicons/react/outline";
import api from "../../services/api";

const PopularCommunities = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Local state
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinLoadingStates, setJoinLoadingStates] = useState({});

  // Debug user state
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Current user:", user);
    }
  }, [isAuthenticated, user]);

  // Fetch communities
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      console.log("Fetching popular communities");

      const response = await api.get("/subreddits", {
        params: {
          sort: "subscribers",
          limit: 20,
        },
      });

      console.log("Communities data received:", response.data);
      setCommunities(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load communities");
      console.error("Error fetching communities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCommunities();
  }, []);

  // Refetch when auth state changes to update join status
  useEffect(() => {
    if (communities.length > 0) {
      fetchCommunities();
    }
  }, [isAuthenticated]);

  // Handle join/leave action
  const handleJoinToggle = async (subredditId, isJoined) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/popular" } });
      return;
    }

    const action = isJoined ? "leave" : "join";

    // Set this specific button to loading
    setJoinLoadingStates((prev) => ({
      ...prev,
      [subredditId]: true,
    }));

    try {
      console.log(`Sending ${action} request for subreddit ${subredditId}`);

      const response = await api.post(`/subreddits/${subredditId}/join`, {
        action,
      });

      console.log(`${action} response:`, response.data);

      // Update local state with new data
      setCommunities((prev) =>
        prev.map((community) =>
          community._id === subredditId
            ? {
                ...community,
                isJoined: response.data.data.isJoined,
                subscribers: response.data.data.subscribers,
              }
            : community
        )
      );

      // After joining/leaving, fetch communities again to ensure consistency
      // This is optional but helps ensure the UI is in sync with the backend
      setTimeout(() => {
        fetchCommunities();
      }, 500);
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      setError(`Failed to ${action} community. Please try again.`);
    } finally {
      setTimeout(() => {
        setJoinLoadingStates((prev) => ({
          ...prev,
          [subredditId]: false,
        }));
      }, 300);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex items-center mb-6">
        <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900">
          Popular Communities
        </h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && communities.length === 0 && (
        <div className="text-center py-10">
          <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No communities found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no communities available at this time.
          </p>
        </div>
      )}

      {/* Communities grid layout */}
      {!loading && communities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((subreddit) => {
            const isButtonLoading = joinLoadingStates[subreddit._id];

            return (
              <div
                key={subreddit._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Banner/header */}
                <div
                  className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500"
                  style={{
                    backgroundImage: subreddit.banner
                      ? `url(${subreddit.banner})`
                      : "",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <Link to={`/r/${subreddit.name}`} className="group">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white -mt-8">
                          {subreddit.icon ? (
                            <img
                              src={subreddit.icon}
                              alt={subreddit.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UsersIcon className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                        <h3 className="ml-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          r/{subreddit.name}
                        </h3>
                      </div>
                    </Link>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {subreddit.description || "No description available."}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">
                        {subreddit.subscribers}
                      </span>{" "}
                      members
                    </div>

                    <button
                      onClick={() =>
                        handleJoinToggle(subreddit._id, subreddit.isJoined)
                      }
                      disabled={isButtonLoading}
                      className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${
                        isButtonLoading
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : subreddit.isJoined
                          ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isButtonLoading
                        ? "Processing..."
                        : subreddit.isJoined
                        ? "Joined ✓"
                        : "Join"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PopularCommunities;
