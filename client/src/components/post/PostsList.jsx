// src/components/post/PostsList.jsx
import { Link } from "react-router-dom";
import PostCard from "./PostCard";

function PostsList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export default PostsList;
