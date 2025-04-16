// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchUserPosts,
  fetchUserComments,
  followUser,
} from "../features/users/usersSlice";
import PostsList from "../components/post/PostsList";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import Pagination from "../components/common/Pagination";
import { CalendarIcon, UserIcon } from "@heroicons/react/outline";
import { formatDistanceToNow } from "date-fns";

function UserProfile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profile, posts, comments, loading, error, pagination } = useSelector(
    (state) => state.users
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username));
      dispatch(fetchUserPosts({ username }));
    }

    return () => {
      // Cleanup if needed
    };
  }, [dispatch, username]);

  useEffect(() => {
    if (activeTab === "comments" && username) {
      dispatch(fetchUserComments({ username }));
    }
  }, [dispatch, username, activeTab]);

  const handleFollow = () => {
    if (isAuthenticated && profile) {
      const action = profile.isFollowing ? "unfollow" : "follow";
      dispatch(followUser({ username, action }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading && !profile) {
    return <Loading />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!profile) {
    return <Alert type="error" message="User not found" />;
  }

  // Prevent following yourself
  const isOwnProfile = isAuthenticated && user?.username === profile.username;

  return (
    <div className="max-w-4xl mx-auto">
      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow border border-reddit-border p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 md:mb-0 md:mr-6">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={`${profile.username}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <UserIcon className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">u/{profile.username}</h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Joined{" "}
                {formatDistanceToNow(new Date(profile.createdAt), {
                  addSuffix: true,
                })}
              </div>

              <div>
                <span className="font-medium">{profile.karma}</span> karma
              </div>
            </div>

            {profile.bio && <p className="mt-3 text-gray-700">{profile.bio}</p>}

            {isAuthenticated && !isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`mt-4 btn ${
                  profile.isFollowing ? "btn-secondary" : "btn-primary"
                }`}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-lg shadow border border-reddit-border overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "posts"
                ? "text-reddit-orange border-b-2 border-reddit-orange"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("posts")}
          >
            Posts
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "comments"
                ? "text-reddit-orange border-b-2 border-reddit-orange"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("comments")}
          >
            Comments
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <Loading />
          ) : activeTab === "posts" ? (
            posts.length > 0 ? (
              <>
                <PostsList posts={posts} />

                {pagination.posts.pages > 1 && (
                  <Pagination
                    currentPage={pagination.posts.page}
                    totalPages={pagination.posts.pages}
                    onPageChange={(page) =>
                      dispatch(fetchUserPosts({ username, params: { page } }))
                    }
                  />
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>u/{profile.username} hasn't posted anything yet</p>
              </div>
            )
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="text-xs text-gray-500 mb-1">
                    <Link
                      to={`/r/${comment.post?.subreddit?.name}/posts/${comment.post?._id}`}
                      className="hover:underline"
                    >
                      {comment.post?.title || "Deleted Post"}
                    </Link>
                    {" • "}
                    <Link
                      to={`/r/${comment.post?.subreddit?.name}`}
                      className="font-medium hover:underline"
                    >
                      r/{comment.post?.subreddit?.name || "unknown"}
                    </Link>
                    {" • "}
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </div>

                  <div className="mb-2">{comment.content}</div>

                  <Link
                    to={`/r/${comment.post?.subreddit?.name}/posts/${comment.post?._id}#comment-${comment._id}`}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View Comment
                  </Link>
                </div>
              ))}

              {pagination.comments.pages > 1 && (
                <Pagination
                  currentPage={pagination.comments.page}
                  totalPages={pagination.comments.pages}
                  onPageChange={(page) =>
                    dispatch(fetchUserComments({ username, params: { page } }))
                  }
                />
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>u/{profile.username} hasn't commented on anything yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
