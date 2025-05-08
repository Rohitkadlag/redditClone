// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSubreddits,
//   joinSubreddit,
// } from "../../features/subreddits/subredditsSlice";
// import { Link } from "react-router-dom";
// import {
//   UsersIcon,
//   SearchIcon,
//   FilterIcon,
//   AcademicCapIcon,
// } from "@heroicons/react/outline";

// const Communities = () => {
//   const dispatch = useDispatch();
//   const { subreddits, loading, error, pagination } = useSelector(
//     (state) => state.subreddits
//   );
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("subscribers");
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [communityType, setCommunityType] = useState("all"); // "all", "university", "general"

//   useEffect(() => {
//     // Fetch subreddits with pagination and sorting
//     dispatch(
//       fetchSubreddits({
//         page: currentPage,
//         limit: pagination.limit || 24,
//         sort: sortBy,
//         search: searchTerm.trim() || undefined,
//       })
//     );
//   }, [dispatch, currentPage, sortBy, searchTerm]);

//   // Handle join/leave community
//   const handleJoinToggle = (subredditId, isJoined) => {
//     if (!isAuthenticated) {
//       // Redirect to login if not authenticated
//       window.location.href = "/login?redirect=/communities";
//       return;
//     }

//     const action = isJoined ? "leave" : "join";
//     dispatch(joinSubreddit({ subredditId, action }));
//   };

//   // Handle search input
//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); // Reset to first page on new search
//     // Search is triggered by the useEffect dependency on searchTerm
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm("");
//     setCurrentPage(1);
//   };

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     if (
//       newPage > 0 &&
//       newPage <= Math.ceil(pagination.total / pagination.limit)
//     ) {
//       setCurrentPage(newPage);
//       window.scrollTo(0, 0);
//     }
//   };

//   // Filter communities by type
//   const filteredCommunities = subreddits.filter((community) => {
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

//   return (
//     <div className="container mx-auto px-4 py-6 max-w-6xl">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div className="flex items-center mb-4 md:mb-0">
//           <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
//           <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
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
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-red-400"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
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

//       {/* Communities grid */}
//       {!loading && filteredCommunities.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {filteredCommunities.map((subreddit) => (
//             <div
//               key={subreddit._id}
//               className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//             >
//               {/* Banner/header */}
//               <div
//                 className="h-16 bg-gradient-to-r from-blue-400 to-indigo-500"
//                 style={{
//                   backgroundImage: subreddit.bannerImage
//                     ? `url(${subreddit.bannerImage})`
//                     : "",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               ></div>

//               {/* Content */}
//               <div className="p-4">
//                 <div className="flex justify-between items-start">
//                   <Link to={`/r/${subreddit.name}`} className="group">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white -mt-6">
//                         {subreddit.icon ? (
//                           <img
//                             src={subreddit.icon}
//                             alt={subreddit.name}
//                             className="h-full w-full object-cover"
//                           />
//                         ) : isUniversityCommunity(subreddit.description) ? (
//                           <AcademicCapIcon className="h-5 w-5 text-indigo-500" />
//                         ) : (
//                           <UsersIcon className="h-5 w-5 text-gray-500" />
//                         )}
//                       </div>
//                       <h3 className="ml-2 text-md font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[140px]">
//                         r/{subreddit.name}
//                       </h3>
//                     </div>
//                   </Link>
//                 </div>

//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 line-clamp-2 h-8">
//                     {subreddit.description || "No description available."}
//                   </p>
//                 </div>

//                 <div className="mt-2 flex justify-between items-center">
//                   <div className="text-xs text-gray-500">
//                     <span className="font-medium text-gray-900">
//                       {subreddit.subscribers}
//                     </span>{" "}
//                     members
//                   </div>

//                   <button
//                     onClick={() =>
//                       handleJoinToggle(subreddit._id, subreddit.isJoined)
//                     }
//                     className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       subreddit.isJoined
//                         ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     } transition-colors`}
//                   >
//                     {subreddit.isJoined ? "Joined" : "Join"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading &&
//         filteredCommunities.length > 0 &&
//         pagination.total > pagination.limit && (
//           <div className="flex justify-center mt-8">
//             <nav className="flex items-center">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-2 py-1 mx-1 rounded ${
//                   currentPage === 1
//                     ? "text-gray-400 cursor-not-allowed"
//                     : "text-blue-600 hover:bg-blue-50"
//                 }`}
//               >
//                 Previous
//               </button>

//               {/* Page numbers */}
//               {Array.from(
//                 {
//                   length: Math.min(
//                     5,
//                     Math.ceil(pagination.total / pagination.limit)
//                   ),
//                 },
//                 (_, i) => {
//                   const pageNum = i + 1;
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handlePageChange(pageNum)}
//                       className={`px-3 py-1 mx-1 rounded ${
//                         currentPage === pageNum
//                           ? "bg-blue-600 text-white"
//                           : "text-blue-600 hover:bg-blue-50"
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 }
//               )}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={
//                   currentPage >= Math.ceil(pagination.total / pagination.limit)
//                 }
//                 className={`px-2 py-1 mx-1 rounded ${
//                   currentPage >= Math.ceil(pagination.total / pagination.limit)
//                     ? "text-gray-400 cursor-not-allowed"
//                     : "text-blue-600 hover:bg-blue-50"
//                 }`}
//               >
//                 Next
//               </button>
//             </nav>
//           </div>
//         )}
//     </div>
//   );
// };

// export default Communities;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSubreddits,
//   joinSubreddit,
// } from "../../features/subreddits/subredditsSlice";
// import { Link } from "react-router-dom";
// import {
//   UsersIcon,
//   SearchIcon,
//   FilterIcon,
//   AcademicCapIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   ChevronDoubleLeftIcon,
//   ChevronDoubleRightIcon,
// } from "@heroicons/react/outline";

// const Communities = () => {
//   const dispatch = useDispatch();
//   const { subreddits, loading, error, pagination } = useSelector(
//     (state) => state.subreddits
//   );
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("subscribers");
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [communityType, setCommunityType] = useState("all"); // "all", "university", "general"
//   const [itemsPerPage, setItemsPerPage] = useState(24); // Default items per page

//   useEffect(() => {
//     // Fetch subreddits with pagination and sorting
//     dispatch(
//       fetchSubreddits({
//         page: currentPage,
//         limit: itemsPerPage,
//         sort: sortBy,
//         search: searchTerm.trim() || undefined,
//       })
//     );
//   }, [dispatch, currentPage, sortBy, searchTerm, itemsPerPage]);

//   // Handle join/leave community
//   const handleJoinToggle = (subredditId, isJoined) => {
//     if (!isAuthenticated) {
//       // Redirect to login if not authenticated
//       window.location.href = "/login?redirect=/communities";
//       return;
//     }

//     const action = isJoined ? "leave" : "join";
//     dispatch(joinSubreddit({ subredditId, action }));
//   };

//   // Handle search input
//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); // Reset to first page on new search
//     // Search is triggered by the useEffect dependency on searchTerm
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm("");
//     setCurrentPage(1);
//   };

//   // Calculate total pages
//   const totalPages = pagination.total
//     ? Math.ceil(pagination.total / itemsPerPage)
//     : 0;

//   // Generate array of page numbers to display
//   const getPageNumbers = () => {
//     // Show appropriate numbers based on position
//     let pages = [];

//     if (totalPages <= 7) {
//       // If there are 7 or fewer pages, show all of them
//       pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//     } else {
//       // Always include first and last page
//       if (currentPage <= 4) {
//         // Near the start
//         pages = [1, 2, 3, 4, 5, "...", totalPages];
//       } else if (currentPage >= totalPages - 3) {
//         // Near the end
//         pages = [
//           1,
//           "...",
//           totalPages - 4,
//           totalPages - 3,
//           totalPages - 2,
//           totalPages - 1,
//           totalPages,
//         ];
//       } else {
//         // Somewhere in the middle
//         pages = [
//           1,
//           "...",
//           currentPage - 1,
//           currentPage,
//           currentPage + 1,
//           "...",
//           totalPages,
//         ];
//       }
//     }

//     return pages;
//   };

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       window.scrollTo(0, 0);
//     }
//   };

//   // Filter communities by type
//   const filteredCommunities = subreddits.filter((community) => {
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

//   return (
//     <div className="container mx-auto px-4 py-6 max-w-6xl">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div className="flex items-center mb-4 md:mb-0">
//           <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
//           <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
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
//                   <option value={24}>24</option>
//                   <option value={48}>48</option>
//                   <option value={96}>96</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-red-400"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
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

//       {/* Communities grid */}
//       {!loading && filteredCommunities.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {filteredCommunities.map((subreddit) => (
//             <div
//               key={subreddit._id}
//               className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//             >
//               {/* Banner/header */}
//               <div
//                 className="h-16 bg-gradient-to-r from-blue-400 to-indigo-500"
//                 style={{
//                   backgroundImage: subreddit.bannerImage
//                     ? `url(${subreddit.bannerImage})`
//                     : "",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               ></div>

//               {/* Content */}
//               <div className="p-4">
//                 <div className="flex justify-between items-start">
//                   <Link to={`/r/${subreddit.name}`} className="group">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white -mt-6">
//                         {subreddit.icon ? (
//                           <img
//                             src={subreddit.icon}
//                             alt={subreddit.name}
//                             className="h-full w-full object-cover"
//                           />
//                         ) : isUniversityCommunity(subreddit.description) ? (
//                           <AcademicCapIcon className="h-5 w-5 text-indigo-500" />
//                         ) : (
//                           <UsersIcon className="h-5 w-5 text-gray-500" />
//                         )}
//                       </div>
//                       <h3 className="ml-2 text-md font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[140px]">
//                         r/{subreddit.name}
//                       </h3>
//                     </div>
//                   </Link>
//                 </div>

//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 line-clamp-2 h-8">
//                     {subreddit.description || "No description available."}
//                   </p>
//                 </div>

//                 <div className="mt-2 flex justify-between items-center">
//                   <div className="text-xs text-gray-500">
//                     <span className="font-medium text-gray-900">
//                       {subreddit.subscribers}
//                     </span>{" "}
//                     members
//                   </div>

//                   <button
//                     onClick={() =>
//                       handleJoinToggle(subreddit._id, subreddit.isJoined)
//                     }
//                     className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       subreddit.isJoined
//                         ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     } transition-colors`}
//                   >
//                     {subreddit.isJoined ? "Joined" : "Join"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Enhanced Pagination */}
//       {!loading && filteredCommunities.length > 0 && totalPages > 1 && (
//         <div className="flex flex-col items-center mt-8">
//           {/* Status of shown items */}
//           <div className="text-sm text-gray-500 mb-4">
//             Showing {filteredCommunities.length} of {pagination.total}{" "}
//             communities | Page {currentPage} of {totalPages}
//           </div>

//           <nav className="flex items-center">
//             {/* First page and Previous page buttons */}
//             <button
//               onClick={() => handlePageChange(1)}
//               disabled={currentPage === 1}
//               className={`p-2 mx-1 rounded ${
//                 currentPage === 1
//                   ? "text-gray-400 cursor-not-allowed"
//                   : "text-blue-600 hover:bg-blue-50"
//               }`}
//               aria-label="First page"
//             >
//               <ChevronDoubleLeftIcon className="h-5 w-5" />
//             </button>

//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`p-2 mx-1 rounded ${
//                 currentPage === 1
//                   ? "text-gray-400 cursor-not-allowed"
//                   : "text-blue-600 hover:bg-blue-50"
//               }`}
//               aria-label="Previous page"
//             >
//               <ChevronLeftIcon className="h-5 w-5" />
//             </button>

//             {/* Page numbers */}
//             <div className="flex">
//               {getPageNumbers().map((page, index) => (
//                 <React.Fragment key={index}>
//                   {page === "..." ? (
//                     <span className="px-3 py-2 mx-1">...</span>
//                   ) : (
//                     <button
//                       onClick={() => handlePageChange(page)}
//                       className={`px-3 py-1 mx-1 rounded ${
//                         currentPage === page
//                           ? "bg-blue-600 text-white"
//                           : "text-blue-600 hover:bg-blue-50"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>

//             {/* Next page and Last page buttons */}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`p-2 mx-1 rounded ${
//                 currentPage === totalPages
//                   ? "text-gray-400 cursor-not-allowed"
//                   : "text-blue-600 hover:bg-blue-50"
//               }`}
//               aria-label="Next page"
//             >
//               <ChevronRightIcon className="h-5 w-5" />
//             </button>

//             <button
//               onClick={() => handlePageChange(totalPages)}
//               disabled={currentPage === totalPages}
//               className={`p-2 mx-1 rounded ${
//                 currentPage === totalPages
//                   ? "text-gray-400 cursor-not-allowed"
//                   : "text-blue-600 hover:bg-blue-50"
//               }`}
//               aria-label="Last page"
//             >
//               <ChevronDoubleRightIcon className="h-5 w-5" />
//             </button>
//           </nav>

//           {/* Jump to page input (for fast navigation) */}
//           <div className="mt-4 flex items-center">
//             <span className="text-sm text-gray-600 mr-2">Jump to page:</span>
//             <input
//               type="number"
//               min="1"
//               max={totalPages}
//               value={currentPage}
//               onChange={(e) => {
//                 const value = parseInt(e.target.value);
//                 if (!isNaN(value) && value >= 1 && value <= totalPages) {
//                   setCurrentPage(value);
//                 }
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   const value = parseInt(e.target.value);
//                   if (!isNaN(value) && value >= 1 && value <= totalPages) {
//                     handlePageChange(value);
//                   }
//                 }
//               }}
//               className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <span className="text-sm text-gray-600 ml-2">of {totalPages}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Communities;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSubreddits,
//   joinSubreddit,
// } from "../../features/subreddits/subredditsSlice";
// import { Link } from "react-router-dom";
// import {
//   UsersIcon,
//   SearchIcon,
//   FilterIcon,
//   AcademicCapIcon,
// } from "@heroicons/react/outline";
// import Pagination from "../common/Pagination"; // Import the Pagination component

// const Communities = () => {
//   const dispatch = useDispatch();
//   const { subreddits, loading, error, pagination } = useSelector(
//     (state) => state.subreddits
//   );
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("subscribers");
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [communityType, setCommunityType] = useState("all"); // "all", "university", "general"
//   const [itemsPerPage, setItemsPerPage] = useState(24); // Default items per page

//   useEffect(() => {
//     // Fetch subreddits with pagination and sorting
//     dispatch(
//       fetchSubreddits({
//         page: currentPage,
//         limit: itemsPerPage,
//         sort: sortBy,
//         search: searchTerm.trim() || undefined,
//       })
//     );
//   }, [dispatch, currentPage, sortBy, searchTerm, itemsPerPage]);

//   // Handle join/leave community
//   const handleJoinToggle = (subredditId, isJoined) => {
//     if (!isAuthenticated) {
//       // Redirect to login if not authenticated
//       window.location.href = "/login?redirect=/communities";
//       return;
//     }

//     const action = isJoined ? "leave" : "join";
//     dispatch(joinSubreddit({ subredditId, action }));
//   };

//   // Handle search input
//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); // Reset to first page on new search
//     // Search is triggered by the useEffect dependency on searchTerm
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm("");
//     setCurrentPage(1);
//   };

//   // Calculate total pages
//   const totalPages = pagination.total
//     ? Math.ceil(pagination.total / itemsPerPage)
//     : 0;

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       window.scrollTo(0, 0);
//     }
//   };

//   // Filter communities by type
//   const filteredCommunities = subreddits.filter((community) => {
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

//   return (
//     <div className="container mx-auto px-4 py-6 max-w-6xl">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div className="flex items-center mb-4 md:mb-0">
//           <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
//           <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
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
//                   <option value={24}>24</option>
//                   <option value={48}>48</option>
//                   <option value={96}>96</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-red-400"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
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

//       {/* Communities grid */}
//       {!loading && filteredCommunities.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {filteredCommunities.map((subreddit) => (
//             <div
//               key={subreddit._id}
//               className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//             >
//               {/* Banner/header */}
//               <div
//                 className="h-16 bg-gradient-to-r from-blue-400 to-indigo-500"
//                 style={{
//                   backgroundImage: subreddit.bannerImage
//                     ? `url(${subreddit.bannerImage})`
//                     : "",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               ></div>

//               {/* Content */}
//               <div className="p-4">
//                 <div className="flex justify-between items-start">
//                   <Link to={`/r/${subreddit.name}`} className="group">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white -mt-6">
//                         {subreddit.icon ? (
//                           <img
//                             src={subreddit.icon}
//                             alt={subreddit.name}
//                             className="h-full w-full object-cover"
//                           />
//                         ) : isUniversityCommunity(subreddit.description) ? (
//                           <AcademicCapIcon className="h-5 w-5 text-indigo-500" />
//                         ) : (
//                           <UsersIcon className="h-5 w-5 text-gray-500" />
//                         )}
//                       </div>
//                       <h3 className="ml-2 text-md font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[140px]">
//                         r/{subreddit.name}
//                       </h3>
//                     </div>
//                   </Link>
//                 </div>

//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 line-clamp-2 h-8">
//                     {subreddit.description || "No description available."}
//                   </p>
//                 </div>

//                 <div className="mt-2 flex justify-between items-center">
//                   <div className="text-xs text-gray-500">
//                     <span className="font-medium text-gray-900">
//                       {subreddit.subscribers}
//                     </span>{" "}
//                     members
//                   </div>

//                   <button
//                     onClick={() =>
//                       handleJoinToggle(subreddit._id, subreddit.isJoined)
//                     }
//                     className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       subreddit.isJoined
//                         ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     } transition-colors`}
//                   >
//                     {subreddit.isJoined ? "Joined" : "Join"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* New Pagination Component */}
//       {!loading && filteredCommunities.length > 0 && (
//         <div className="mt-8">
//           {/* Status of shown items */}
//           <div className="text-sm text-gray-500 text-center mb-4">
//             Showing {filteredCommunities.length} of {pagination.total}{" "}
//             communities | Page {currentPage} of {totalPages}
//           </div>

//           {/* Apply the Pagination component */}
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />

//           {/* Jump to page input (kept from original for convenience) */}
//           <div className="mt-4 flex items-center justify-center">
//             <span className="text-sm text-gray-600 mr-2">Jump to page:</span>
//             <input
//               type="number"
//               min="1"
//               max={totalPages}
//               value={currentPage}
//               onChange={(e) => {
//                 const value = parseInt(e.target.value);
//                 if (!isNaN(value) && value >= 1 && value <= totalPages) {
//                   setCurrentPage(value);
//                 }
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   const value = parseInt(e.target.value);
//                   if (!isNaN(value) && value >= 1 && value <= totalPages) {
//                     handlePageChange(value);
//                   }
//                 }
//               }}
//               className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <span className="text-sm text-gray-600 ml-2">of {totalPages}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Communities;
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSubreddits,
//   joinSubreddit,
// } from "../../features/subreddits/subredditsSlice";
// import { Link } from "react-router-dom";
// import {
//   UsersIcon,
//   SearchIcon,
//   FilterIcon,
//   AcademicCapIcon,
// } from "@heroicons/react/outline";
// import Pagination from "../common/Pagination";

// const Communities = () => {
//   const dispatch = useDispatch();
//   const { subreddits, loading, error } = useSelector(
//     (state) => state.subreddits
//   );
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("subscribers");
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [communityType, setCommunityType] = useState("all"); // "all", "university", "general"

//   // Client-side pagination settings
//   const [itemsPerPage, setItemsPerPage] = useState(24);

//   useEffect(() => {
//     // Fetch ALL subreddits without server-side pagination
//     dispatch(
//       fetchSubreddits({
//         limit: 1000, // A large number to fetch all
//         sort: sortBy,
//         search: searchTerm.trim() || undefined,
//       })
//     );
//   }, [dispatch, sortBy, searchTerm]);

//   // Debug to see all subreddits
//   useEffect(() => {
//     console.log("Loaded subreddits:", subreddits.length);
//   }, [subreddits]);

//   // Handle join/leave community
//   const handleJoinToggle = (subredditId, isJoined) => {
//     if (!isAuthenticated) {
//       // Redirect to login if not authenticated
//       window.location.href = "/login?redirect=/communities";
//       return;
//     }

//     const action = isJoined ? "leave" : "join";
//     dispatch(joinSubreddit({ subredditId, action }));
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

//   // Filter communities by type
//   const filteredCommunities = subreddits.filter((community) => {
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
//           <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
//           <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
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
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
//                   <option value={12}>12 per page</option>
//                   <option value={24}>24 per page</option>
//                   <option value={48}>48 per page</option>
//                   <option value={96}>96 per page</option>
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
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-red-400"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
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

//       {/* Communities grid */}
//       {!loading && currentCommunities.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {currentCommunities.map((subreddit) => (
//             <div
//               key={subreddit._id}
//               className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//             >
//               {/* Banner/header */}
//               <div
//                 className="h-16 bg-gradient-to-r from-blue-400 to-indigo-500"
//                 style={{
//                   backgroundImage: subreddit.bannerImage
//                     ? `url(${subreddit.bannerImage})`
//                     : "",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               ></div>

//               {/* Content */}
//               <div className="p-4">
//                 <div className="flex justify-between items-start">
//                   <Link to={`/r/${subreddit.name}`} className="group">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white -mt-6">
//                         {subreddit.icon ? (
//                           <img
//                             src={subreddit.icon}
//                             alt={subreddit.name}
//                             className="h-full w-full object-cover"
//                           />
//                         ) : isUniversityCommunity(subreddit.description) ? (
//                           <AcademicCapIcon className="h-5 w-5 text-indigo-500" />
//                         ) : (
//                           <UsersIcon className="h-5 w-5 text-gray-500" />
//                         )}
//                       </div>
//                       <h3 className="ml-2 text-md font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[140px]">
//                         r/{subreddit.name}
//                       </h3>
//                     </div>
//                   </Link>
//                 </div>

//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 line-clamp-2 h-8">
//                     {subreddit.description || "No description available."}
//                   </p>
//                 </div>

//                 <div className="mt-2 flex justify-between items-center">
//                   <div className="text-xs text-gray-500">
//                     <span className="font-medium text-gray-900">
//                       {subreddit.subscribers}
//                     </span>{" "}
//                     members
//                   </div>

//                   <button
//                     onClick={() =>
//                       handleJoinToggle(subreddit._id, subreddit.isJoined)
//                     }
//                     className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       subreddit.isJoined
//                         ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     } transition-colors`}
//                   >
//                     {subreddit.isJoined ? "Joined" : "Join"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
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

// export default Communities;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubreddits,
  joinSubreddit,
} from "../../features/subreddits/subredditsSlice";
import { Link } from "react-router-dom";
import {
  UsersIcon,
  SearchIcon,
  FilterIcon,
  AcademicCapIcon,
} from "@heroicons/react/outline";
import Pagination from "../common/Pagination";

const Communities = () => {
  const dispatch = useDispatch();
  const { subreddits, loading, error } = useSelector(
    (state) => state.subreddits
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("subscribers");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [communityType, setCommunityType] = useState("all"); // "all", "university", "general"

  // Client-side pagination settings
  const [itemsPerPage, setItemsPerPage] = useState(24);

  useEffect(() => {
    // Fetch ALL subreddits without server-side pagination
    dispatch(
      fetchSubreddits({
        limit: 1000, // A large number to fetch all
        sort: sortBy,
        search: searchTerm.trim() || undefined,
      })
    );
  }, [dispatch, sortBy, searchTerm]);

  // Debug to see all subreddits
  useEffect(() => {
    console.log("Loaded subreddits:", subreddits.length);
  }, [subreddits]);

  // Handle join/leave community
  const handleJoinToggle = (subredditId, isJoined) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = "/login?redirect=/communities";
      return;
    }

    const action = isJoined ? "leave" : "join";
    dispatch(joinSubreddit({ subredditId, action }));
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

  // Filter communities by type
  const filteredCommunities = subreddits.filter((community) => {
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
          <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
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
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                  <option value={96}>96 per page</option>
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
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
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

      {/* Communities grid with new card styling */}
      {!loading && currentCommunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentCommunities.map((subreddit) => {
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
                      {subreddit.name}
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
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      subreddit.isJoined
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {subreddit.isJoined ? "Joined" : "Join"}
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

export default Communities;
