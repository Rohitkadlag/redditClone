// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {
//   UsersIcon,
//   FireIcon,
//   FilterIcon,
//   SearchIcon,
// } from "@heroicons/react/outline";
// import api from "../../services/api";
// import Pagination from "../common/Pagination";

// const PopularCommunities = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useSelector((state) => state.auth);

//   // Local state
//   const [communities, setCommunities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [joinLoadingStates, setJoinLoadingStates] = useState({});

//   // Search, filter, and pagination state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortBy, setSortBy] = useState("subscribers");
//   const [communityType, setCommunityType] = useState("all"); // "all", "university", "general"
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(12);

//   // Fetch all communities
//   const fetchCommunities = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching popular communities");

//       const response = await api.get("/subreddits", {
//         params: {
//           sort: sortBy,
//           limit: 1000, // Fetch a large number to handle client-side
//         },
//       });

//       console.log("Communities data received:", response.data);
//       setCommunities(response.data.data);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load communities");
//       console.error("Error fetching communities:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial data load
//   useEffect(() => {
//     fetchCommunities();
//   }, [sortBy]);

//   // Refetch when auth state changes to update join status
//   useEffect(() => {
//     if (communities.length > 0) {
//       fetchCommunities();
//     }
//   }, [isAuthenticated]);

//   // Handle join/leave action
//   const handleJoinToggle = async (subredditId, isJoined) => {
//     if (!isAuthenticated) {
//       navigate("/login", { state: { from: "/popular" } });
//       return;
//     }

//     const action = isJoined ? "leave" : "join";

//     // Set this specific button to loading
//     setJoinLoadingStates((prev) => ({
//       ...prev,
//       [subredditId]: true,
//     }));

//     try {
//       console.log(`Sending ${action} request for subreddit ${subredditId}`);

//       const response = await api.post(`/subreddits/${subredditId}/join`, {
//         action,
//       });

//       console.log(`${action} response:`, response.data);

//       // Update local state with new data
//       setCommunities((prev) =>
//         prev.map((community) =>
//           community._id === subredditId
//             ? {
//                 ...community,
//                 isJoined: response.data.data.isJoined,
//                 subscribers: response.data.data.subscribers,
//               }
//             : community
//         )
//       );
//     } catch (err) {
//       console.error(`Error during ${action}:`, err);
//       setError(`Failed to ${action} community. Please try again.`);
//     } finally {
//       setTimeout(() => {
//         setJoinLoadingStates((prev) => ({
//           ...prev,
//           [subredditId]: false,
//         }));
//       }, 300);
//     }
//   };

//   // Handle search input
//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); // Reset to first page on new search
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm("");
//     setCurrentPage(1);
//   };

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     console.log("Changing to page:", newPage);
//     setCurrentPage(newPage);
//     window.scrollTo(0, 0);
//   };

//   // Filter communities by type and search term
//   const filteredCommunities = communities.filter((community) => {
//     // Apply search filter
//     const matchesSearch =
//       !searchTerm ||
//       community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (community.description &&
//         community.description.toLowerCase().includes(searchTerm.toLowerCase()));

//     if (!matchesSearch) return false;

//     // Apply community type filter
//     if (communityType === "all") return true;

//     const isUniversity = community.description
//       ?.toLowerCase()
//       .includes("official community for");

//     if (communityType === "university") return isUniversity;
//     if (communityType === "general") return !isUniversity;

//     return true;
//   });

//   // Function to determine if a community is a university
//   const isUniversityCommunity = (description) => {
//     return description?.toLowerCase().includes("official community for");
//   };

//   // Client-side pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCommunities = filteredCommunities.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );
//   const totalPages = Math.ceil(filteredCommunities.length / itemsPerPage);

//   return (
//     <div className="container mx-auto px-4 py-6 max-w-6xl">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div className="flex items-center mb-4 md:mb-0">
//           <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
//           <h1 className="text-2xl font-bold text-gray-900">
//             Popular Communities
//           </h1>
//         </div>

//         {/* Search form */}
//         <form onSubmit={handleSearch} className="w-full md:w-auto">
//           <div className="relative">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search communities..."
//               className="w-full md:w-64 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             <button
//               type="submit"
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               <SearchIcon className="h-5 w-5" />
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Filters */}
//       <div className="mb-6">
//         <div className="flex justify-between items-center">
//           <button
//             className="flex items-center text-sm text-gray-600 hover:text-gray-900"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <FilterIcon className="h-4 w-4 mr-1" />
//             {showFilters ? "Hide Filters" : "Show Filters"}
//           </button>

//           {searchTerm && (
//             <button
//               onClick={clearSearch}
//               className="text-sm text-blue-600 hover:text-blue-800"
//             >
//               Clear Search
//             </button>
//           )}
//         </div>

//         {showFilters && (
//           <div className="mt-3 p-4 bg-gray-50 rounded-lg">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sort By
//                 </label>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 >
//                   <option value="subscribers">Most Members</option>
//                   <option value="-subscribers">Least Members</option>
//                   <option value="createdAt">Newest</option>
//                   <option value="-createdAt">Oldest</option>
//                   <option value="name">A-Z</option>
//                   <option value="-name">Z-A</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Community Type
//                 </label>
//                 <select
//                   value={communityType}
//                   onChange={(e) => setCommunityType(e.target.value)}
//                   className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 >
//                   <option value="all">All Communities</option>
//                   <option value="university">University Communities</option>
//                   <option value="general">General Communities</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Items Per Page
//                 </label>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(Number(e.target.value));
//                     setCurrentPage(1); // Reset to first page when changing items per page
//                   }}
//                   className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 >
//                   <option value={6}>6 per page</option>
//                   <option value={12}>12 per page</option>
//                   <option value={24}>24 per page</option>
//                   <option value={48}>48 per page</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Debug info */}
//       <div className="mb-4 text-xs text-gray-500">
//         Total communities: {filteredCommunities.length} | Page {currentPage} of{" "}
//         {totalPages} | Showing {indexOfFirstItem + 1}-
//         {Math.min(indexOfLastItem, filteredCommunities.length)} items
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
//       {!loading && filteredCommunities.length === 0 && (
//         <div className="text-center py-10">
//           <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900">
//             No communities found
//           </h3>
//           <p className="mt-1 text-sm text-gray-500">
//             {searchTerm ? (
//               <>
//                 No communities match your search "{searchTerm}".
//                 <button
//                   onClick={clearSearch}
//                   className="ml-2 text-blue-600 hover:text-blue-800"
//                 >
//                   Clear search
//                 </button>
//               </>
//             ) : (
//               "There are no communities available at this time."
//             )}
//           </p>
//         </div>
//       )}

//       {/* Communities grid layout */}
//       {!loading && currentCommunities.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentCommunities.map((subreddit) => {
//             const isButtonLoading = joinLoadingStates[subreddit._id];

//             return (
//               <div
//                 key={subreddit._id}
//                 className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//               >
//                 {/* Banner/header */}
//                 <div
//                   className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500"
//                   style={{
//                     backgroundImage: subreddit.banner
//                       ? `url(${subreddit.banner})`
//                       : "",
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                   }}
//                 ></div>

//                 {/* Content */}
//                 <div className="p-4">
//                   <div className="flex justify-between items-start">
//                     <Link to={`/r/${subreddit.name}`} className="group">
//                       <div className="flex items-center">
//                         <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white -mt-8">
//                           {subreddit.icon ? (
//                             <img
//                               src={subreddit.icon}
//                               alt={subreddit.name}
//                               className="h-full w-full object-cover"
//                             />
//                           ) : isUniversityCommunity(subreddit.description) ? (
//                             <div className="w-full h-full bg-indigo-500 flex items-center justify-center">
//                               <svg
//                                 className="h-6 w-6 text-white"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path d="M12 14l9-5-9-5-9 5 9 5z" />
//                                 <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
//                                 />
//                               </svg>
//                             </div>
//                           ) : (
//                             <UsersIcon className="h-6 w-6 text-gray-500" />
//                           )}
//                         </div>
//                         <h3 className="ml-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
//                           r/{subreddit.name}
//                         </h3>
//                       </div>
//                     </Link>
//                   </div>

//                   <div className="mt-3">
//                     <p className="text-sm text-gray-600 line-clamp-2">
//                       {subreddit.description || "No description available."}
//                     </p>
//                   </div>

//                   <div className="mt-4 flex justify-between items-center">
//                     <div className="text-sm text-gray-500">
//                       <span className="font-medium text-gray-900">
//                         {subreddit.subscribers}
//                       </span>{" "}
//                       members
//                     </div>

//                     <button
//                       onClick={() =>
//                         handleJoinToggle(subreddit._id, subreddit.isJoined)
//                       }
//                       disabled={isButtonLoading}
//                       className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${
//                         isButtonLoading
//                           ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                           : subreddit.isJoined
//                           ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
//                           : "bg-blue-500 hover:bg-blue-600 text-white"
//                       }`}
//                     >
//                       {isButtonLoading
//                         ? "Processing..."
//                         : subreddit.isJoined
//                         ? "Joined ✓"
//                         : "Join"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading && filteredCommunities.length > 0 && totalPages > 1 && (
//         <div className="mt-8">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopularCommunities;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UsersIcon,
  FireIcon,
  FilterIcon,
  SearchIcon,
  AcademicCapIcon,
} from "@heroicons/react/outline";
import api from "../../services/api";
import Pagination from "../common/Pagination";

const PopularCommunities = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Local state
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinLoadingStates, setJoinLoadingStates] = useState({});

  // Search, filter, and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("subscribers");
  const [communityType, setCommunityType] = useState("all"); // "all", "university", "general"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      console.log("Fetching popular communities");

      const response = await api.get("/subreddits", {
        params: {
          sort: sortBy,
          limit: 1000, // Fetch a large number to handle client-side
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
  }, [sortBy]);

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

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    console.log("Changing to page:", newPage);
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // Filter communities by type and search term
  const filteredCommunities = communities.filter((community) => {
    // Apply search filter
    const matchesSearch =
      !searchTerm ||
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (community.description &&
        community.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Apply community type filter
    if (communityType === "all") return true;

    const isUniversity = community.description
      ?.toLowerCase()
      .includes("official community for");

    if (communityType === "university") return isUniversity;
    if (communityType === "general") return !isUniversity;

    return true;
  });

  // Function to determine if a community is a university
  const isUniversityCommunity = (description) => {
    return description?.toLowerCase().includes("official community for");
  };

  // Client-side pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommunities = filteredCommunities.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCommunities.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Popular Communities
          </h1>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search communities..."
              className="w-full md:w-64 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <button
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="h-4 w-4 mr-1" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Search
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="subscribers">Most Members</option>
                  <option value="-subscribers">Least Members</option>
                  <option value="createdAt">Newest</option>
                  <option value="-createdAt">Oldest</option>
                  <option value="name">A-Z</option>
                  <option value="-name">Z-A</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Community Type
                </label>
                <select
                  value={communityType}
                  onChange={(e) => setCommunityType(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Communities</option>
                  <option value="university">University Communities</option>
                  <option value="general">General Communities</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Items Per Page
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug info */}
      <div className="mb-4 text-xs text-gray-500">
        Total communities: {filteredCommunities.length} | Page {currentPage} of{" "}
        {totalPages} | Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, filteredCommunities.length)} items
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
      {!loading && filteredCommunities.length === 0 && (
        <div className="text-center py-10">
          <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No communities found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? (
              <>
                No communities match your search "{searchTerm}".
                <button
                  onClick={clearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              </>
            ) : (
              "There are no communities available at this time."
            )}
          </p>
        </div>
      )}

      {/* Communities grid layout - EXACTLY MATCH IMAGE 2 - NO HEADERS */}
      {!loading && currentCommunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentCommunities.map((subreddit) => {
            const isButtonLoading = joinLoadingStates[subreddit._id];
            const isUniversity = isUniversityCommunity(subreddit.description);

            return (
              <div
                key={subreddit._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden p-4"
              >
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {isUniversity ? (
                        <span className="text-xs font-medium text-gray-800">
                          Univ
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-800">
                          Tests
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Link
                      to={`/r/${subreddit.name}`}
                      className="text-base font-medium text-gray-900 hover:text-blue-600"
                    >
                      r/{subreddit.name}
                    </Link>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {subreddit.description || "No description available."}
                </p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {subreddit.subscribers} members
                  </div>

                  <button
                    onClick={() =>
                      handleJoinToggle(subreddit._id, subreddit.isJoined)
                    }
                    disabled={isButtonLoading}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      isButtonLoading
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : subreddit.isJoined
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isButtonLoading
                      ? "Processing..."
                      : subreddit.isJoined
                      ? "Joined"
                      : "Join"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredCommunities.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PopularCommunities;
