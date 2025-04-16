// import { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getCurrentUser } from "./features/auth/authSlice";
// import { initializeSocket } from "./services/socket";

// // Layouts
// import Header from "./components/layout/Header";
// import Footer from "./components/layout/Footer";
// import Sidebar from "./components/layout/Sidebar";

// // Pages
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import SubredditPage from "./pages/SubredditPage";
// import PostDetail from "./pages/PostDetail";
// import CreatePost from "./pages/CreatePost";
// import UserProfile from "./pages/UserProfile";
// import NotFound from "./pages/NotFound";
// import Discussions from "./pages/Discussions";
// import DiscussionDetail from "./pages/DiscussionDetail";
// // Protected route component
// import ProtectedRoute from "./components/common/ProtectedRoute";

// function App() {
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       dispatch(getCurrentUser());
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       initializeSocket();
//     }
//   }, [isAuthenticated]);

//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Header />
//         <div className="container mx-auto px-4 py-6 flex-grow">
//           <div className="flex">
//             {/* Sidebar */}
//             <Sidebar />

//             {/* Main content */}
//             <main className="flex-1 md:ml-6">
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/r/:subredditName" element={<SubredditPage />} />
//                 <Route path="/discussions" element={<Discussions />} />
//                 <Route
//                   path="/discussions/:discussionId"
//                   element={<DiscussionDetail />}
//                 />
//                 <Route
//                   path="/r/:subredditName/posts/:postId"
//                   element={<PostDetail />}
//                 />
//                 <Route
//                   path="/submit"
//                   element={
//                     <ProtectedRoute>
//                       <CreatePost />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route path="/user/:username" element={<UserProfile />} />
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </main>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./features/auth/authSlice";
import { initializeSocket } from "./services/socket";

// Layouts
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/layout/Sidebar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubredditPage from "./pages/SubredditPage";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import Discussions from "./pages/Discussions";
import DiscussionDetail from "./pages/DiscussionDetail";

// Community Components
import Communities from "./components/communities/Communities";
import PopularCommunities from "./components/communities/PopularCommunities";
import CreateCommunity from "./components/communities/CreateCommunity";
import CommunityDetail from "./components/communities/CommunityDetail";

// Protected route component
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-6 flex-grow">
          <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 md:ml-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Original routes */}
                <Route path="/r/:subredditName" element={<SubredditPage />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route
                  path="/discussions/:discussionId"
                  element={<DiscussionDetail />}
                />
                <Route
                  path="/r/:subredditName/posts/:postId"
                  element={<PostDetail />}
                />
                <Route
                  path="/submit"
                  element={
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  }
                />
                <Route path="/user/:username" element={<UserProfile />} />

                {/* New community routes */}
                <Route path="/communities" element={<Communities />} />
                <Route path="/popular" element={<PopularCommunities />} />
                <Route
                  path="/create-community"
                  element={
                    <ProtectedRoute>
                      <CreateCommunity />
                    </ProtectedRoute>
                  }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
