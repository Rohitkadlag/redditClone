// // src/pages/SearchResults.jsx
// import { useState, useEffect } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Loading from "../components/common/Loading";
// import Alert from "../components/common/Alert";
// import Pagination from "../components/common/Pagination";
// import PostsList from "../components/post/PostsList";
// import api from "../services/api";

// function SearchResults() {
//   const location = useLocation();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   const [activeTab, setActiveTab] = useState("posts");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Results state
//   const [posts, setPosts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [communities, setCommunities] = useState([]);
//   const [discussions, setDiscussions] = useState([]);

//   // Pagination state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     pages: 1,
//     total: 0,
//   });

//   // Extract search query from URL
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const query = params.get("q") || "";
//     setSearchQuery(query);

//     if (query) {
//       performSearch(query, activeTab, 1);
//     }
//   }, [location.search]);

//   // Handle tab change
//   useEffect(() => {
//     if (searchQuery) {
//       performSearch(searchQuery, activeTab, 1);
//     }
//   }, [activeTab]);

//   // Perform search based on active tab
//   const performSearch = async (query, tab, page = 1) => {
//     if (!query.trim()) return;

//     setLoading(true);
//     setError(null);

//     try {
//       let response;

//       switch (tab) {
//         case "posts":
//           response = await api.get("/search/posts", {
//             params: { q: query, page, limit: 10 },
//           });
//           setPosts(response.data.data);
//           setPagination(response.data.pagination);
//           break;

//         case "users":
//           response = await api.get("/search/users", {
//             params: { q: query, page, limit: 10 },
//           });
//           setUsers(response.data.data);
//           setPagination(response.data.pagination);
//           break;

//         case "communities":
//           response = await api.get("/search/subreddits", {
//             params: { q: query, page, limit: 10 },
//           });
//           setCommunities(response.data.data);
//           setPagination(response.data.pagination);
//           break;

//         case "discussions":
//           response = await api.get("/search/discussions", {
//             params: { q: query, page, limit: 10 },
//           });
//           setDiscussions(response.data.data);
//           setPagination(response.data.pagination);
//           break;

//         default:
//           break;
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Error performing search");
//       console.error("Search error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     performSearch(searchQuery, activeTab, newPage);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h1 className="text-2xl font-bold mb-2">
//           Search results for "{searchQuery}"
//         </h1>

//         {/* Tabs */}
//         <div className="flex border-b mb-6">
//           <button
//             className={`px-4 py-2 ${
//               activeTab === "posts"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("posts")}
//           >
//             Posts
//           </button>
//           <button
//             className={`px-4 py-2 ${
//               activeTab === "communities"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("communities")}
//           >
//             Communities
//           </button>
//           <button
//             className={`px-4 py-2 ${
//               activeTab === "users"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("users")}
//           >
//             People
//           </button>
//           <button
//             className={`px-4 py-2 ${
//               activeTab === "discussions"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("discussions")}
//           >
//             Discussions
//           </button>
//         </div>

//         {/* Error state */}
//         {error && <Alert type="error" message={error} />}

//         {/* Loading state */}
//         {loading ? (
//           <Loading />
//         ) : (
//           <div>
//             {/* Posts tab content */}
//             {activeTab === "posts" && (
//               <>
//                 {posts.length > 0 ? (
//                   <PostsList posts={posts} />
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">
//                       No posts found matching "{searchQuery}"
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Communities tab content */}
//             {activeTab === "communities" && (
//               <div className="space-y-4">
//                 {communities.length > 0 ? (
//                   communities.map((community) => (
//                     <div
//                       key={community._id}
//                       className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
//                     >
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 mr-3">
//                           <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
//                             {community.icon ? (
//                               <img
//                                 src={community.icon}
//                                 alt={community.name}
//                                 className="h-full w-full object-cover"
//                               />
//                             ) : (
//                               <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
//                                 {community.name.charAt(0).toUpperCase()}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <Link
//                             to={`/r/${community.name}`}
//                             className="text-lg font-medium hover:text-blue-600"
//                           >
//                             r/{community.name}
//                           </Link>
//                           <p className="text-sm text-gray-600">
//                             {community.subscribers} members
//                           </p>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {community.description.length > 100
//                               ? `${community.description.substring(0, 100)}...`
//                               : community.description}
//                           </p>
//                         </div>
//                         <div>
//                           {isAuthenticated && (
//                             <button
//                               className={`px-4 py-1 rounded-full text-sm font-medium ${
//                                 community.isJoined
//                                   ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                                   : "bg-blue-500 text-white hover:bg-blue-600"
//                               }`}
//                             >
//                               {community.isJoined ? "Joined" : "Join"}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">
//                       No communities found matching "{searchQuery}"
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Users tab content */}
//             {activeTab === "users" && (
//               <div className="space-y-4">
//                 {users.length > 0 ? (
//                   users.map((user) => (
//                     <div
//                       key={user._id}
//                       className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
//                     >
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 mr-3">
//                           <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
//                             {user.avatar ? (
//                               <img
//                                 src={user.avatar}
//                                 alt={user.username}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
//                                 <svg
//                                   className="w-8 h-8"
//                                   fill="currentColor"
//                                   viewBox="0 0 20 20"
//                                 >
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <Link
//                             to={`/user/${user.username}`}
//                             className="text-lg font-medium hover:text-blue-600"
//                           >
//                             u/{user.username}
//                           </Link>
//                           <p className="text-sm text-gray-600">
//                             {user.karma} karma
//                           </p>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {user.bio
//                               ? user.bio.length > 100
//                                 ? `${user.bio.substring(0, 100)}...`
//                                 : user.bio
//                               : "No bio available"}
//                           </p>
//                         </div>
//                         <div>
//                           {isAuthenticated &&
//                             user.username !==
//                               useSelector((state) => state.auth.user)
//                                 ?.username && (
//                               <button
//                                 className={`px-4 py-1 rounded-full text-sm font-medium ${
//                                   user.isFollowing
//                                     ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                                     : "bg-blue-500 text-white hover:bg-blue-600"
//                                 }`}
//                               >
//                                 {user.isFollowing ? "Following" : "Follow"}
//                               </button>
//                             )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">
//                       No users found matching "{searchQuery}"
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Discussions tab content */}
//             {activeTab === "discussions" && (
//               <div className="space-y-4">
//                 {discussions.length > 0 ? (
//                   discussions.map((discussion) => (
//                     <Link
//                       key={discussion._id}
//                       to={`/discussions/${discussion._id}`}
//                       className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
//                     >
//                       <h3 className="text-lg font-medium mb-1">
//                         {discussion.title}
//                       </h3>
//                       <div className="text-sm text-gray-500 mb-2">
//                         Posted by u/{discussion.author.username} •{" "}
//                         {new Date(discussion.createdAt).toLocaleDateString()}
//                       </div>
//                       <p className="text-gray-600 mb-2">
//                         {discussion.content.length > 150
//                           ? `${discussion.content.substring(0, 150)}...`
//                           : discussion.content}
//                       </p>
//                       <div className="text-sm text-gray-500">
//                         <span className="mr-4">{discussion.score} points</span>
//                         <span>{discussion.commentCount} comments</span>
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">
//                       No discussions found matching "{searchQuery}"
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Pagination */}
//             {!loading && pagination.pages > 1 && (
//               <div className="mt-6">
//                 <Pagination
//                   currentPage={pagination.page}
//                   totalPages={pagination.pages}
//                   onPageChange={handlePageChange}
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SearchResults;

// src/pages/SearchResults.jsx
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import Pagination from "../components/common/Pagination";
import PostsList from "../components/post/PostsList";
import api from "../services/api";

function SearchResults() {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const currentUser = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Results state
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [discussions, setDiscussions] = useState([]);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearchQuery(query);

    if (query) {
      performSearch(query, activeTab, 1);
    }
  }, [location.search]);

  // Handle tab change
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery, activeTab, 1);
    }
  }, [activeTab]);

  // Perform search based on active tab
  const performSearch = async (query, tab, page = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let response;

      switch (tab) {
        case "posts":
          response = await api.get("/search/posts", {
            params: { q: query, page, limit: 10 },
          });
          setPosts(response.data.data);
          setPagination({
            page: parseInt(response.data.pagination?.page) || 1,
            pages: parseInt(response.data.pagination?.pages) || 1,
            total: parseInt(response.data.pagination?.total) || 0,
          });
          break;

        case "users":
          response = await api.get("/search/users", {
            params: { q: query, page, limit: 10 },
          });
          setUsers(response.data.data);
          setPagination({
            page: parseInt(response.data.pagination?.page) || 1,
            pages: parseInt(response.data.pagination?.pages) || 1,
            total: parseInt(response.data.pagination?.total) || 0,
          });
          break;

        case "communities":
          response = await api.get("/search/subreddits", {
            params: { q: query, page, limit: 10 },
          });
          setCommunities(response.data.data);
          setPagination({
            page: parseInt(response.data.pagination?.page) || 1,
            pages: parseInt(response.data.pagination?.pages) || 1,
            total: parseInt(response.data.pagination?.total) || 0,
          });
          break;

        case "discussions":
          response = await api.get("/search/discussions", {
            params: { q: query, page, limit: 10 },
          });
          setDiscussions(response.data.data);
          setPagination({
            page: parseInt(response.data.pagination?.page) || 1,
            pages: parseInt(response.data.pagination?.pages) || 1,
            total: parseInt(response.data.pagination?.total) || 0,
          });
          break;

        default:
          break;
      }

      console.log("Search response:", response.data);
      console.log("Pagination:", response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Error performing search");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    console.log("Changing to page:", newPage);
    performSearch(searchQuery, activeTab, newPage);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search results for "{searchQuery}"
        </h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 ${
              activeTab === "posts"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
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
              activeTab === "users"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("users")}
          >
            People
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "discussions"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("discussions")}
          >
            Discussions
          </button>
        </div>

        {/* Error state */}
        {error && <Alert type="error" message={error} />}

        {/* Loading state */}
        {loading ? (
          <Loading />
        ) : (
          <div>
            {/* Posts tab content */}
            {activeTab === "posts" && (
              <>
                {posts.length > 0 ? (
                  <PostsList posts={posts} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No posts found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Communities tab content */}
            {activeTab === "communities" && (
              <div className="space-y-4">
                {communities.length > 0 ? (
                  communities.map((community) => (
                    <div
                      key={community._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                            {community.icon ? (
                              <img
                                src={community.icon}
                                alt={community.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                                {community.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/r/${community.name}`}
                            className="text-lg font-medium hover:text-blue-600"
                          >
                            {community.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            {community.subscribers} members
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {community.description &&
                            community.description.length > 100
                              ? `${community.description.substring(0, 100)}...`
                              : community.description ||
                                "No description available"}
                          </p>
                        </div>
                        <div>
                          {isAuthenticated && (
                            <button
                              className={`px-4 py-1 rounded-full text-sm font-medium ${
                                community.isJoined
                                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                            >
                              {community.isJoined ? "Joined" : "Join"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No communities found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Users tab content */}
            {activeTab === "users" && (
              <div className="space-y-4">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                                <svg
                                  className="w-8 h-8"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/user/${user.username}`}
                            className="text-lg font-medium hover:text-blue-600"
                          >
                            {user.username}
                          </Link>
                          <p className="text-sm text-gray-600">
                            {user.karma || 0} karma
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {user.bio
                              ? user.bio.length > 100
                                ? `${user.bio.substring(0, 100)}...`
                                : user.bio
                              : "No bio available"}
                          </p>
                        </div>
                        <div>
                          {isAuthenticated &&
                            user.username !== currentUser?.username && (
                              <button
                                className={`px-4 py-1 rounded-full text-sm font-medium ${
                                  user.isFollowing
                                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                              >
                                {user.isFollowing ? "Following" : "Follow"}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No users found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Discussions tab content */}
            {activeTab === "discussions" && (
              <div className="space-y-4">
                {discussions.length > 0 ? (
                  discussions.map((discussion) => (
                    <Link
                      key={discussion._id}
                      to={`/discussions/${discussion._id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <h3 className="text-lg font-medium mb-1">
                        {discussion.title}
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        Posted by {discussion.author?.username || "deleted"} •{" "}
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {discussion.content && discussion.content.length > 150
                          ? `${discussion.content.substring(0, 150)}...`
                          : discussion.content || "No content available"}
                      </p>
                      <div className="text-sm text-gray-500">
                        <span className="mr-4">
                          {discussion.score || 0} points
                        </span>
                        <span>{discussion.commentCount || 0} comments</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No discussions found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
