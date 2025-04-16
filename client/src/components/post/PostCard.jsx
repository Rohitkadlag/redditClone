import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatIcon,
  ShareIcon,
} from "@heroicons/react/outline";

function PostCard({ post, onVote, detailed = false }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!post) return null;

  const handleVote = (voteType) => {
    if (isAuthenticated && onVote) {
      onVote(voteType);
    }
  };

  const getVoteButtonClasses = (voteType) => {
    const baseClasses = "flex items-center p-1 rounded-sm hover:bg-gray-100";
    const upvoteActive =
      post.userVote === "upvote" ? "text-orange-500" : "text-gray-500";
    const downvoteActive =
      post.userVote === "downvote" ? "text-blue-500" : "text-gray-500";

    return `${baseClasses} ${
      voteType === "upvote" ? upvoteActive : downvoteActive
    }`;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-reddit-border">
      {/* Vote sidebar */}
      <div className="flex">
        <div className="bg-gray-50 p-2 rounded-l-lg flex flex-col items-center w-12">
          <button
            className={getVoteButtonClasses("upvote")}
            onClick={() => handleVote("upvote")}
            aria-label="Upvote"
          >
            <ArrowUpIcon className="h-6 w-6" />
          </button>

          <span className="text-sm font-semibold my-1">{post.score}</span>

          <button
            className={getVoteButtonClasses("downvote")}
            onClick={() => handleVote("downvote")}
            aria-label="Downvote"
          >
            <ArrowDownIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Post content */}
        <div className="p-3 flex-1">
          <div className="text-xs text-gray-500 mb-1">
            {post.subreddit && (
              <>
                <Link
                  to={`/r/${post.subreddit.name}`}
                  className="font-bold hover:underline"
                >
                  r/{post.subreddit.name}
                </Link>
                {" • "}
              </>
            )}
            Posted by{" "}
            <Link
              to={`/user/${post.author.username}`}
              className="hover:underline"
            >
              u/{post.author.username}
            </Link>
            {" • "}
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>

          {/* Title */}
          {detailed ? (
            <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
          ) : (
            <Link to={`/r/${post.subreddit.name}/posts/${post._id}`}>
              <h2 className="text-lg font-semibold mb-2 hover:underline">
                {post.title}
              </h2>
            </Link>
          )}

          {/* Content */}
          {detailed || post.content.length < 150 ? (
            <div className="mb-3 whitespace-pre-line">{post.content}</div>
          ) : (
            <div className="mb-3">
              {post.content.slice(0, 150)}...{" "}
              <Link
                to={`/r/${post.subreddit.name}/posts/${post._id}`}
                className="text-reddit-orange hover:underline"
              >
                Read more
              </Link>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex text-xs text-gray-500">
            <Link
              to={`/r/${post.subreddit.name}/posts/${post._id}`}
              className="flex items-center mr-4 hover:bg-gray-100 p-1 rounded"
            >
              <ChatIcon className="h-4 w-4 mr-1" />
              {post.commentCount} Comments
            </Link>

            <button className="flex items-center mr-4 hover:bg-gray-100 p-1 rounded">
              <ShareIcon className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
