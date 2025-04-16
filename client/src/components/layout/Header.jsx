// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../features/auth/authSlice";
// import {
//   BellIcon,
//   UserCircleIcon,
//   MenuIcon,
//   SearchIcon,
// } from "@heroicons/react/outline";
// import NotificationsDropdown from "./NotificationsDropdown";

// function Header() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const { notifications, unreadCount } = useSelector(
//     (state) => state.notifications
//   );

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//       setSearchTerm("");
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <header className="bg-white shadow sticky top-0 z-10">
//       <div className="container mx-auto px-4 py-2">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-reddit-orange rounded-full"></div>
//             <span className="text-xl font-bold text-gray-900">
//               Admitty Forum
//             </span>
//           </Link>

//           {/* Search Bar */}
//           <form
//             onSubmit={handleSearch}
//             className="hidden md:flex flex-1 max-w-lg mx-4"
//           >
//             <div className="relative w-full">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <SearchIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="input pl-10"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </form>

//           {/* Right Menu */}
//           <div className="flex items-center space-x-4">
//             {isAuthenticated ? (
//               <>
//                 {/* Notifications */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowNotifications(!showNotifications)}
//                     className="relative p-1 rounded-full text-gray-600 hover:bg-gray-100"
//                   >
//                     <BellIcon className="h-6 w-6" />
//                     {unreadCount > 0 && (
//                       <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-reddit-orange text-white text-xs flex items-center justify-center">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </button>
//                   {showNotifications && (
//                     <NotificationsDropdown notifications={notifications} />
//                   )}
//                 </div>

//                 {/* User Menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowUserMenu(!showUserMenu)}
//                     className="flex items-center space-x-1 p-1 rounded-md hover:bg-gray-100"
//                   >
//                     <UserCircleIcon className="h-6 w-6 text-gray-600" />
//                     <span className="hidden md:inline-block">
//                       {user?.username}
//                     </span>
//                   </button>

//                   {showUserMenu && (
//                     <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
//                       <Link
//                         to={`/user/${user?.username}`}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={() => setShowUserMenu(false)}
//                       >
//                         Profile
//                       </Link>
//                       <Link
//                         to="/settings"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={() => setShowUserMenu(false)}
//                       >
//                         Settings
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="space-x-2">
//                 <Link to="/login" className="btn btn-secondary">
//                   Log In
//                 </Link>
//                 <Link to="/register" className="btn btn-primary">
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../features/auth/authSlice";
// import {
//   BellIcon,
//   UserCircleIcon,
//   MenuIcon,
//   SearchIcon,
// } from "@heroicons/react/outline";
// import NotificationsDropdown from "./NotificationsDropdown";

// function Header() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const { notifications, unreadCount } = useSelector(
//     (state) => state.notifications
//   );

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//       setSearchTerm("");
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <header className="bg-white shadow sticky top-0 z-10">
//       <div className="px-6 py-3">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <img
//               src="/src/assets/admity.svg"
//               alt="Admitty Forum Logo"
//               className="h-10 w-10"
//             />
//             <span className="text-xl font-bold text-red-600">
//               Admitty Forum
//             </span>
//           </Link>

//           {/* Center - Search Bar */}
//           <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
//             <div className="relative w-full">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <SearchIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium"
//               >
//                 Search
//               </button>
//             </div>
//           </form>

//           {/* Right - User menu and notifications */}
//           <div className="flex items-center space-x-4">
//             {isAuthenticated ? (
//               <>
//                 {/* Notifications */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowNotifications(!showNotifications)}
//                     className="relative p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   >
//                     <BellIcon className="h-6 w-6" />
//                     {unreadCount > 0 && (
//                       <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </button>
//                   {showNotifications && (
//                     <NotificationsDropdown notifications={notifications} />
//                   )}
//                 </div>

//                 {/* User Menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowUserMenu(!showUserMenu)}
//                     className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
//                   >
//                     <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                       <UserCircleIcon className="h-8 w-8 text-gray-500" />
//                     </div>
//                   </button>

//                   {showUserMenu && (
//                     <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
//                       <Link
//                         to={`/user/${user?.username}`}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={() => setShowUserMenu(false)}
//                       >
//                         Profile
//                       </Link>
//                       <Link
//                         to="/settings"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={() => setShowUserMenu(false)}
//                       >
//                         Settings
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="space-x-2">
//                 <Link
//                   to="/login"
//                   className="py-2 px-4 text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50"
//                 >
//                   Log In
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  BellIcon,
  UserCircleIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from "@heroicons/react/outline";
import NotificationsDropdown from "./NotificationsDropdown";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/src/assets/admity.svg"
              alt="Admitty Forum Logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-red-600">
              Admitty Forum
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Mobile Search Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <SearchIcon className="h-6 w-6" />
            )}
          </button>

          {/* Right - User menu and notifications */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationsDropdown notifications={notifications} />
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <UserCircleIcon className="h-8 w-8 text-gray-500" />
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <Link
                        to={`/user/${user?.username}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="py-2 px-4 text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 hidden sm:inline-block"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {showMobileSearch && (
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
