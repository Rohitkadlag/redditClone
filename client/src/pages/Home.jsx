// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Add this import
import { fetchPosts } from "../features/posts/postsSlice";
import { fetchSubreddits } from "../features/subreddits/subredditsSlice";
import PostsList from "../components/post/PostsList";
import SubredditSidebar from "../components/subreddit/SubredditSidebar";
import Loading from "../components/common/Loading";
import Pagination from "../components/common/Pagination";

function Home() {
  const dispatch = useDispatch();
  const { posts, loading, pagination } = useSelector((state) => state.posts);
  const { subreddits, loading: subredditsLoading } = useSelector(
    (state) => state.subreddits
  );
  const [sortBy, setSortBy] = useState("new");

  useEffect(() => {
    dispatch(fetchPosts({ sortBy }));
    dispatch(fetchSubreddits({ limit: 5 }));
  }, [dispatch, sortBy]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="mb-4 bg-white p-4 rounded-lg shadow border border-reddit-border">
          <h1 className="text-xl font-semibold mb-4">Popular Posts</h1>

          <div className="flex space-x-4 border-b pb-2 mb-4">
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

          {loading ? <Loading /> : <PostsList posts={posts} />}

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => dispatch(fetchPosts({ sortBy, page }))}
              />
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-1">
        <SubredditSidebar subreddits={subreddits} loading={subredditsLoading} />

        <div className="mt-4 bg-white p-4 rounded-lg shadow border border-reddit-border">
          <h2 className="text-lg font-semibold mb-2">Create Post</h2>
          <p className="text-gray-600 mb-4">
            Share your thoughts with the community
          </p>
          <Link to="/submit" className="btn btn-primary w-full">
            Create Post
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
