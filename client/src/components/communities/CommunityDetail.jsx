import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubreddit,
  joinSubreddit,
} from "../../features/subreddits/subredditsSlice";
import {
  UsersIcon,
  CalendarIcon,
  BellIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";

const CommunityDetail = () => {
  const { subredditName } = useParams();
  const dispatch = useDispatch();
  const { currentSubreddit, loading, error } = useSelector(
    (state) => state.subreddits
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (subredditName) {
      dispatch(fetchSubreddit(subredditName));
    }
  }, [dispatch, subredditName]);

  // Handle join/leave community
  const handleJoinToggle = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=/r/${subredditName}`;
      return;
    }

    if (currentSubreddit) {
      const action = currentSubreddit.isJoined ? "leave" : "join";
      dispatch(
        joinSubreddit({
          subredditId: currentSubreddit._id,
          action,
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error === "Not Found"
                  ? `The community r/${subredditName} doesn't exist.`
                  : `Error: ${error}`}
              </p>
              <p className="mt-2">
                <Link
                  to="/communities"
                  className="text-red-700 hover:text-red-600 font-medium"
                >
                  View all communities
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSubreddit) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Community banner */}
      <div
        className="h-40 md:h-64 bg-gradient-to-r from-blue-500 to-indigo-600 relative"
        style={{
          backgroundImage: currentSubreddit.bannerImage
            ? `url(${currentSubreddit.bannerImage})`
            : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="container mx-auto px-4 relative h-full flex items-end">
          <div className="flex items-center mb-4 md:mb-6">
            <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-white p-1 overflow-hidden">
              {currentSubreddit.icon ? (
                <img
                  src={currentSubreddit.icon}
                  alt={currentSubreddit.name}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-blue-500 flex items-center justify-center">
                  <UsersIcon className="h-8 w-8 md:h-12 md:w-12 text-white" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-xl md:text-3xl font-bold text-white">
                {currentSubreddit.name}
              </h1>
              <p className="text-white text-opacity-90 text-sm md:text-base">
                {currentSubreddit.subscribers} members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Community content */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content */}
          <div className="md:w-2/3">
            {/* Action bar */}
            <div className="bg-white rounded-lg shadow mb-4 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === "posts"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Posts
                  </button>
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === "about"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    About
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleJoinToggle}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      currentSubreddit.isJoined
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {currentSubreddit.isJoined ? "Joined" : "Join"}
                  </button>

                  {currentSubreddit.isJoined && (
                    <button
                      className="p-2 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100"
                      title="Notification settings"
                    >
                      <BellIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "posts" && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-gray-900">
                    No Posts Yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to post in {currentSubreddit.name}
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    Create Post
                  </button>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">
                  About {currentSubreddit.name}
                </h2>
                <p className="text-gray-700 mb-6">
                  {currentSubreddit.description || "No description available."}
                </p>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center mb-3">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      Created {formatDate(currentSubreddit.createdAt)}
                    </span>
                  </div>

                  {currentSubreddit.moderators &&
                    currentSubreddit.moderators.length > 0 && (
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          {currentSubreddit.moderators.length} Moderator
                          {currentSubreddit.moderators.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h3 className="text-lg font-medium mb-4">About Community</h3>
              <p className="text-sm text-gray-600 mb-4">
                {currentSubreddit.description || "No description available."}
              </p>

              <div className="flex items-center mb-3">
                <UsersIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">
                  <strong>{currentSubreddit.subscribers}</strong> members
                </span>
              </div>

              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">
                  Created {formatDate(currentSubreddit.createdAt)}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Community Rules</h3>
              {currentSubreddit.rules && currentSubreddit.rules.length > 0 ? (
                <ol className="list-decimal list-inside text-sm text-gray-700">
                  {currentSubreddit.rules.map((rule, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-medium">{rule.title}</span>
                      {rule.description && (
                        <p className="ml-5 mt-1 text-gray-600">
                          {rule.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-600">
                  No community rules have been posted yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
