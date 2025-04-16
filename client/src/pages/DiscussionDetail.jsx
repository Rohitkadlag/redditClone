// src/pages/DiscussionDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDiscussion,
  voteDiscussion,
} from "../features/discussions/discussionsSlice";
import {
  fetchDiscussionComments,
  createComment,
  voteComment,
} from "../features/comments/commentsSlice";
import CommentForm from "../components/comment/CommentForm";
import CommentsList from "../components/comment/CommentsList";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import {
  createDiscussionComment, // Import the new function instead of createComment
} from "../features/comments/commentsSlice";

function DiscussionDetail() {
  const { discussionId } = useParams();
  const dispatch = useDispatch();
  const {
    currentDiscussion,
    loading: discussionLoading,
    error: discussionError,
  } = useSelector((state) => state.discussions);
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
  } = useSelector((state) => state.comments);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [sortBy, setSortBy] = useState("top");

  useEffect(() => {
    if (discussionId) {
      dispatch(fetchDiscussion(discussionId));
      dispatch(fetchDiscussionComments({ discussionId, sortBy }));
    }
  }, [dispatch, discussionId, sortBy]);

  const handleVoteDiscussion = (voteType) => {
    if (isAuthenticated) {
      dispatch(voteDiscussion({ discussionId, voteType }));
    }
  };

  const handleVoteComment = (commentId, voteType) => {
    if (isAuthenticated) {
      dispatch(voteComment({ commentId, voteType }));
    }
  };

  const handleCreateComment = (content, parentId = null) => {
    if (isAuthenticated && content.trim()) {
      dispatch(createDiscussionComment({ discussionId, content, parentId }));
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  if (discussionLoading) {
    return <Loading />;
  }

  if (discussionError) {
    return <Alert type="error" message={discussionError} />;
  }

  if (!currentDiscussion) {
    return <Alert type="error" message="Discussion not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link
          to="/discussions"
          className="text-reddit-orange hover:underline font-medium"
        >
          ← Back to Discussions
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border border-reddit-border mb-4">
        <div className="flex">
          {/* Vote sidebar */}
          <div className="bg-gray-50 p-2 rounded-l-lg flex flex-col items-center w-12">
            <button
              className={`p-1 rounded-sm hover:bg-gray-100 ${
                currentDiscussion.userVote === "upvote"
                  ? "text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => handleVoteDiscussion("upvote")}
              aria-label="Upvote"
              disabled={!isAuthenticated}
            >
              <ArrowUpIcon className="h-6 w-6" />
            </button>

            <span className="text-sm font-semibold my-1">
              {currentDiscussion.score || 0}
            </span>

            <button
              className={`p-1 rounded-sm hover:bg-gray-100 ${
                currentDiscussion.userVote === "downvote"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => handleVoteDiscussion("downvote")}
              aria-label="Downvote"
              disabled={!isAuthenticated}
            >
              <ArrowDownIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Discussion content */}
          <div className="p-4 flex-1">
            <div className="text-xs text-gray-500 mb-1">
              Posted by{" "}
              <Link
                to={`/user/${currentDiscussion.author.username}`}
                className="hover:underline"
              >
                u/{currentDiscussion.author.username}
              </Link>
              {" • "}
              {formatDistanceToNow(new Date(currentDiscussion.createdAt), {
                addSuffix: true,
              })}
              {currentDiscussion.updatedAt !== currentDiscussion.createdAt &&
                " • edited"}
            </div>

            <h1 className="text-2xl font-bold mb-3">
              {currentDiscussion.title}
            </h1>

            <div className="mb-4 whitespace-pre-line">
              {currentDiscussion.content}
            </div>

            <div className="flex text-xs text-gray-500 border-t pt-3">
              <div className="flex items-center mr-4">
                <ChatIcon className="h-4 w-4 mr-1" />
                {currentDiscussion.commentCount || 0} Comments
              </div>

              <button className="flex items-center mr-4 hover:bg-gray-100 p-1 rounded">
                <ShareIcon className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="bg-white rounded-lg shadow border border-reddit-border p-4">
        {/* Comment form */}
        {isAuthenticated ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Add a comment</h2>
            <CommentForm onSubmit={handleCreateComment} />
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
            <p>
              <Link to="/login" className="text-reddit-orange hover:underline">
                Log in
              </Link>{" "}
              or{" "}
              <Link
                to="/register"
                className="text-reddit-orange hover:underline"
              >
                sign up
              </Link>{" "}
              to leave a comment
            </p>
          </div>
        )}

        {/* Comment sorting */}
        <div className="flex space-x-4 border-b pb-2 mb-4">
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
              sortBy === "old"
                ? "text-reddit-orange"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleSortChange("old")}
          >
            Old
          </button>
          <button
            className={`font-medium ${
              sortBy === "controversial"
                ? "text-reddit-orange"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleSortChange("controversial")}
          >
            Controversial
          </button>
        </div>

        {/* Comments list */}
        {commentsLoading ? (
          <Loading />
        ) : commentsError ? (
          <Alert type="error" message={commentsError} />
        ) : comments && comments.length > 0 ? (
          <CommentsList
            comments={comments}
            onVote={handleVoteComment}
            onReply={handleCreateComment}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscussionDetail;
