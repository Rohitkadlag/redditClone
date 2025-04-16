import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ReplyIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import CommentForm from "./CommentForm";

function Comment({ comment, onVote, onReply }) {
  const [isReplying, setIsReplying] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!comment) return null;

  const handleVote = (voteType) => {
    if (isAuthenticated && onVote) {
      onVote(comment._id, voteType);
    }
  };

  const handleReply = (content) => {
    if (onReply) {
      onReply(content, comment._id);
      setIsReplying(false);
    }
  };

  const getVoteButtonClasses = (voteType) => {
    const baseClasses = "flex items-center p-1 rounded-sm hover:bg-gray-100";
    const upvoteActive =
      comment.userVote === "upvote" ? "text-orange-500" : "text-gray-500";
    const downvoteActive =
      comment.userVote === "downvote" ? "text-blue-500" : "text-gray-500";

    return `${baseClasses} ${
      voteType === "upvote" ? upvoteActive : downvoteActive
    }`;
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-reddit-border">
      <div className="text-xs text-gray-500 mb-1">
        <Link
          to={`/user/${comment.author.username}`}
          className="font-bold hover:underline"
        >
          u/{comment.author.username}
        </Link>
        {" • "}
        <span title={new Date(comment.createdAt).toLocaleString()}>
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })}
        </span>
        {comment.edited && (
          <span title={new Date(comment.editedAt).toLocaleString()}>
            {" • edited"}
          </span>
        )}
      </div>

      <div className="mb-2 whitespace-pre-line">{comment.content}</div>

      <div className="flex items-center text-xs text-gray-500">
        <div className="flex items-center mr-2 space-x-1">
          <button
            className={getVoteButtonClasses("upvote")}
            onClick={() => handleVote("upvote")}
            aria-label="Upvote"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </button>

          <span className="font-semibold">{comment.score}</span>

          <button
            className={getVoteButtonClasses("downvote")}
            onClick={() => handleVote("downvote")}
            aria-label="Downvote"
          >
            <ArrowDownIcon className="h-4 w-4" />
          </button>
        </div>

        {isAuthenticated && (
          <button
            className="flex items-center mr-2 hover:bg-gray-100 p-1 rounded"
            onClick={() => setIsReplying(!isReplying)}
          >
            <ReplyIcon className="h-4 w-4 mr-1" />
            Reply
          </button>
        )}

        <button className="flex items-center hover:bg-gray-100 p-1 rounded">
          <DotsHorizontalIcon className="h-4 w-4" />
        </button>
      </div>

      {isReplying && (
        <div className="mt-2 ml-4">
          <CommentForm onSubmit={handleReply} isReply />
        </div>
      )}

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-200">
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              onVote={onVote}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
