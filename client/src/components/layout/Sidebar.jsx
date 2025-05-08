// // src/components/layout/Sidebar.jsx
// import { Link, useLocation } from "react-router-dom";
// import {
//   HomeIcon,
//   UsersIcon,
//   FireIcon,
//   InboxIcon,
//   ChatIcon,
// } from "@heroicons/react/outline";

// function Sidebar() {
//   const location = useLocation();

//   // Function to check if a path is active
//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   // Sidebar item style classes
//   const baseClasses = "flex items-center px-3 py-2 text-sm rounded-md mb-1";
//   const activeClasses = "bg-gray-200 font-medium text-gray-900";
//   const inactiveClasses = "text-gray-700 hover:bg-gray-100";

//   return (
//     <div className="hidden md:block sticky top-16 w-56">
//       <div className="bg-white rounded-lg shadow border border-reddit-border p-3 mb-4">
//         <h3 className="font-medium text-gray-900 mb-2">Feeds</h3>

//         <nav className="mb-3">
//           <Link
//             to="/"
//             className={`${baseClasses} ${
//               isActive("/") ? activeClasses : inactiveClasses
//             }`}
//           >
//             <HomeIcon className="h-5 w-5 mr-2" />
//             Home
//           </Link>

//           <Link
//             to="/discussions"
//             className={`${baseClasses} ${
//               isActive("/discussions") ? activeClasses : inactiveClasses
//             }`}
//           >
//             <ChatIcon className="h-5 w-5 mr-2" />
//             Discussions
//           </Link>
//         </nav>

//         <h3 className="font-medium text-gray-900 mb-2">Communities</h3>

//         <nav>
//           <Link
//             to="/communities"
//             className={`${baseClasses} ${
//               isActive("/communities") ? activeClasses : inactiveClasses
//             }`}
//           >
//             <UsersIcon className="h-5 w-5 mr-2" />
//             All Communities
//           </Link>

//           <Link
//             to="/popular"
//             className={`${baseClasses} ${
//               isActive("/popular") ? activeClasses : inactiveClasses
//             }`}
//           >
//             <FireIcon className="h-5 w-5 mr-2" />
//             Popular
//           </Link>
//         </nav>
//       </div>

//       {/* My Subscriptions section */}
//       <div className="bg-white rounded-lg shadow border border-reddit-border p-3">
//         <h3 className="font-medium text-gray-900 mb-2">My Communities</h3>

//         <nav className="space-y-1">
//           {/* This would be dynamically generated from your subscribed communities */}
//           {/* For now, we'll add some sample communities */}
//           <Link
//             to="/r/testsubreddit"
//             className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
//           >
//             <div className="w-5 h-5 mr-2 rounded-full bg-reddit-orange"></div>
//             r/testsubreddit
//           </Link>

//           <Link
//             to="/r/testsubreddit2"
//             className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
//           >
//             <div className="w-5 h-5 mr-2 rounded-full bg-blue-500"></div>
//             r/testsubreddit2
//           </Link>
//         </nav>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;

// import { Link, useLocation } from "react-router-dom";
// import {
//   HomeIcon,
//   UsersIcon,
//   FireIcon,
//   InboxIcon,
//   ChatIcon,
// } from "@heroicons/react/outline";

// function Sidebar() {
//   const location = useLocation();

//   // Function to check if a path is active
//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const feedItems = [
//     {
//       to: "/",
//       label: "Home",
//       icon: <HomeIcon className="h-5 w-5" />,
//     },
//     {
//       to: "/discussions",
//       label: "Discussions",
//       icon: <ChatIcon className="h-5 w-5" />,
//     },
//   ];

//   const communityItems = [
//     {
//       to: "/communities",
//       label: "All Communities",
//       icon: <UsersIcon className="h-5 w-5" />,
//     },
//     {
//       to: "/popular",
//       label: "Popular",
//       icon: <FireIcon className="h-5 w-5" />,
//     },
//   ];

//   // Sample subscribed communities - this would be dynamic in your actual app
//   const myCommunities = [
//     {
//       to: "/r/testsubreddit",
//       label: "r/testsubreddit",
//       color: "bg-blue-500",
//     },
//     {
//       to: "/r/testsubreddit2",
//       label: "r/testsubreddit2",
//       color: "bg-red-500",
//     },
//   ];

//   return (
//     <div className="h-screen w-80 bg-white border-r border-neutral-200 flex flex-col py-6 px-4 shadow-sm">
//       {/* Logo */}
//       <div className="flex items-center gap-2 mb-6 px-4">
//         <h1 className="font-semibold text-xl text-red-600">Admitty Forum</h1>
//       </div>

//       <div className="flex-1 flex flex-col justify-between">
//         <div>
//           <h2 className="text-sm text-neutral-400 px-4 mb-2">Feeds</h2>
//           <nav className="space-y-1 mb-4">
//             {feedItems.map(({ to, label, icon }) => (
//               <Link
//                 key={label}
//                 to={to}
//                 className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
//                   isActive(to)
//                     ? "bg-blue-100 text-blue-600"
//                     : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
//                 }`}
//               >
//                 {icon}
//                 <span>{label}</span>
//               </Link>
//             ))}
//           </nav>

//           <h2 className="text-sm text-neutral-400 px-4 mb-2">Communities</h2>
//           <nav className="space-y-1 mb-4">
//             {communityItems.map(({ to, label, icon }) => (
//               <Link
//                 key={label}
//                 to={to}
//                 className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
//                   isActive(to)
//                     ? "bg-blue-100 text-blue-600"
//                     : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
//                 }`}
//               >
//                 {icon}
//                 <span>{label}</span>
//               </Link>
//             ))}
//           </nav>

//           <hr className="my-4 border-neutral-100" />
//           <h2 className="text-sm text-neutral-400 px-4 mb-2">My Communities</h2>
//           <nav className="space-y-1">
//             {myCommunities.map(({ to, label, color }) => (
//               <Link
//                 key={label}
//                 to={to}
//                 className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
//                   isActive(to)
//                     ? "bg-blue-100 text-blue-600"
//                     : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
//                 }`}
//               >
//                 <div className={`w-5 h-5 rounded-full ${color}`}></div>
//                 <span>{label}</span>
//               </Link>
//             ))}
//           </nav>
//         </div>
//         {/* User profile section at bottom - you can add this if needed */}
//         {/* <div className="mt-6 px-4 py-4 border border-neutral-200 rounded-xl flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-full bg-blue-200"></div>
//             <div>
//               <div className="font-semibold text-sm text-neutral-900">
//                 Username
//               </div>
//               <div className="text-xs text-neutral-500">Member</div>
//             </div>
//           </div>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 text-gray-500"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </div> */}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;

// import { Link, useLocation } from "react-router-dom";
// import {
//   HomeIcon,
//   UsersIcon,
//   FireIcon,
//   InboxIcon,
//   ChatIcon,
//   MenuIcon,
//   XIcon,
// } from "@heroicons/react/outline";
// import { useState } from "react";

// function Sidebar() {
//   const location = useLocation();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Function to check if a path is active
//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const feedItems = [
//     {
//       to: "/",
//       label: "Home",
//       icon: <HomeIcon className="h-5 w-5" />,
//     },
//     {
//       to: "/discussions",
//       label: "Discussions",
//       icon: <ChatIcon className="h-5 w-5" />,
//     },
//   ];

//   const communityItems = [
//     {
//       to: "/communities",
//       label: "All Communities",
//       icon: <UsersIcon className="h-5 w-5" />,
//     },
//     {
//       to: "/popular",
//       label: "Popular",
//       icon: <FireIcon className="h-5 w-5" />,
//     },
//   ];

//   // Sample subscribed communities - this would be dynamic in your actual app
//   const myCommunities = [
//     {
//       to: "/r/testsubreddit",
//       label: "r/testsubreddit",
//       color: "bg-blue-500",
//     },
//     {
//       to: "/r/testsubreddit2",
//       label: "r/testsubreddit2",
//       color: "bg-red-500",
//     },
//   ];

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   return (
//     <>
//       {/* Mobile menu button */}
//       <div className="md:hidden fixed top-16 left-4 z-20">
//         <button
//           onClick={toggleMobileMenu}
//           className="p-2 rounded-md bg-white shadow-md text-gray-500 hover:bg-gray-100"
//         >
//           {mobileMenuOpen ? (
//             <XIcon className="h-6 w-6" />
//           ) : (
//             <MenuIcon className="h-6 w-6" />
//           )}
//         </button>
//       </div>

//       {/* Sidebar for desktop */}
//       <div
//         className={`${
//           mobileMenuOpen
//             ? "block fixed inset-0 z-10 bg-gray-900 bg-opacity-50"
//             : "hidden"
//         } md:block md:static md:bg-transparent md:bg-opacity-100`}
//       >
//         <div
//           className={`h-screen w-80 bg-white border-r border-neutral-200 flex flex-col py-6 px-4 shadow-sm ${
//             mobileMenuOpen ? "transform translate-x-0" : "-translate-x-full"
//           } md:transform-none transition-transform duration-300 ease-in-out`}
//         >
//           {/* Logo */}
//           <div className="flex items-center gap-2 mb-6 px-4">
//             <h1 className="font-semibold text-xl text-red-600">MyApp</h1>
//           </div>

//           <div className="flex-1 flex flex-col justify-between">
//             <div>
//               <h2 className="text-sm text-neutral-400 px-4 mb-2">Feeds</h2>
//               <nav className="space-y-1 mb-4">
//                 {feedItems.map(({ to, label, icon }) => (
//                   <Link
//                     key={label}
//                     to={to}
//                     className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
//                       isActive(to)
//                         ? "bg-blue-100 text-blue-600"
//                         : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
//                     }`}
//                     onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
//                   >
//                     {icon}
//                     <span>{label}</span>
//                   </Link>
//                 ))}
//               </nav>

//               <h2 className="text-sm text-neutral-400 px-4 mb-2">
//                 Communities
//               </h2>
//               <nav className="space-y-1 mb-4">
//                 {communityItems.map(({ to, label, icon }) => (
//                   <Link
//                     key={label}
//                     to={to}
//                     className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
//                       isActive(to)
//                         ? "bg-blue-100 text-blue-600"
//                         : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
//                     }`}
//                     onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
//                   >
//                     {icon}
//                     <span>{label}</span>
//                   </Link>
//                 ))}
//               </nav>

//               <hr className="my-4 border-neutral-100" />
//               <h2 className="text-sm text-neutral-400 px-4 mb-2">
//                 My Communities
//               </h2>
//               <nav className="space-y-1">
//                 {myCommunities.map(({ to, label, color }) => (
//                   <Link
//                     key={label}
//                     to={to}
//                     className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
//                       isActive(to)
//                         ? "bg-blue-100 text-blue-600"
//                         : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
//                     }`}
//                     onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
//                   >
//                     <div className={`w-5 h-5 rounded-full ${color}`}></div>
//                     <span>{label}</span>
//                   </Link>
//                 ))}
//               </nav>
//             </div>

//             {/* User profile section at bottom */}
//             <div className="mt-6 px-4 py-4 border border-neutral-200 rounded-xl flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-full bg-blue-200"></div>
//                 <div>
//                   <div className="font-semibold text-sm text-neutral-900">
//                     Username
//                   </div>
//                   <div className="text-xs text-neutral-500">Member</div>
//                 </div>
//               </div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 text-gray-500"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Sidebar;

import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  FireIcon,
  InboxIcon,
  ChatIcon,
  MenuIcon,
  XIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
function Sidebar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get authentication state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fetch user's joined communities
  useEffect(() => {
    const fetchJoinedCommunities = async () => {
      if (!isAuthenticated) {
        setJoinedCommunities([]);
        return;
      }

      try {
        setLoading(true);
        // Get followed subreddits from the API
        const response = await api.get("/users/me/subreddits");

        console.log("Fetched joined communities:", response.data);

        // Format the communities for sidebar display
        const communities = response.data.data.map((subreddit) => ({
          id: subreddit._id,
          to: `/r/${subreddit.name || subreddit.slug}`,
          label: `${subreddit.name}`,
          // Generate a color based on the subreddit name for consistency
          color: getSubredditColor(subreddit.name),
        }));

        setJoinedCommunities(communities);
      } catch (error) {
        console.error("Failed to fetch joined communities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedCommunities();
  }, [isAuthenticated, user]);

  // Generate a consistent color based on subreddit name
  const getSubredditColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ];

    // Simple hash function to get consistent color for the same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const feedItems = [
    {
      to: "/",
      label: "Home",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      to: "/discussions",
      label: "Discussions",
      icon: <ChatIcon className="h-5 w-5" />,
    },
  ];

  const communityItems = [
    {
      to: "/communities",
      label: "All Communities",
      icon: <UsersIcon className="h-5 w-5" />,
    },
    {
      to: "/popular",
      label: "Popular",
      icon: <FireIcon className="h-5 w-5" />,
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-16 left-4 z-20">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md text-gray-500 hover:bg-gray-100"
        >
          {mobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div
        className={`${
          mobileMenuOpen
            ? "block fixed inset-0 z-10 bg-gray-900 bg-opacity-50"
            : "hidden"
        } md:block md:static md:bg-transparent md:bg-opacity-100`}
      >
        <div
          className={`h-screen w-80 bg-white border-r border-neutral-200 flex flex-col py-6 px-4 shadow-sm ${
            mobileMenuOpen ? "transform translate-x-0" : "-translate-x-full"
          } md:transform-none transition-transform duration-300 ease-in-out`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 px-4">
            <h1 className="font-semibold text-xl text-red-600">MyApp</h1>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-sm text-neutral-400 px-4 mb-2">Feeds</h2>
              <nav className="space-y-1 mb-4">
                {feedItems.map(({ to, label, icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                      isActive(to)
                        ? "bg-blue-100 text-blue-600"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                    onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <h2 className="text-sm text-neutral-400 px-4 mb-2">
                Communities
              </h2>
              <nav className="space-y-1 mb-4">
                {communityItems.map(({ to, label, icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                      isActive(to)
                        ? "bg-blue-100 text-blue-600"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                    onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <hr className="my-4 border-neutral-100" />

              {/* User's joined communities */}
              <div className="flex items-center justify-between px-4 mb-2">
                <h2 className="text-sm text-neutral-400">My Communities</h2>
                <Link
                  to="/create-community"
                  className="p-1 rounded-full hover:bg-gray-100"
                  title="Create Community"
                >
                  <PlusIcon className="h-4 w-4 text-neutral-500" />
                </Link>
              </div>

              <nav className="space-y-1 max-h-48 overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-2 text-sm text-neutral-500">
                    Loading...
                  </div>
                ) : joinedCommunities.length > 0 ? (
                  joinedCommunities.map(({ id, to, label, color }) => (
                    <Link
                      key={id}
                      to={to}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                        isActive(to)
                          ? "bg-blue-100 text-blue-600"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                      onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
                    >
                      <div className={`w-5 h-5 rounded-full ${color}`}></div>
                      <span className="truncate">{label}</span>
                    </Link>
                  ))
                ) : isAuthenticated ? (
                  <div className="px-4 py-2 text-sm text-neutral-500">
                    You haven't joined any communities yet
                  </div>
                ) : (
                  <div className="px-4 py-2 text-sm text-neutral-500">
                    Sign in to see your communities
                  </div>
                )}
              </nav>
            </div>

            {/* User profile section at bottom */}
            {isAuthenticated ? (
              <div className="mt-6 px-4 py-4 border border-neutral-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-200 overflow-hidden">
                    {user?.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-neutral-900">
                      {user?.username || "User"}
                    </div>
                    <div className="text-xs text-neutral-500">Member</div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="mt-6 px-4 py-4 border border-neutral-200 rounded-xl">
                <Link
                  to="/login"
                  className="font-medium text-sm text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
                {" to see your communities"}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
