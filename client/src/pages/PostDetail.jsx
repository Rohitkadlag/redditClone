import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, votePost } from "../features/posts/postsSlice";
import {
  fetchComments,
  createComment,
  voteComment,
} from "../features/comments/commentsSlice";
import { joinPost, leavePost } from "../services/socket";
import PostCard from "../components/post/PostCard";
import CommentForm from "../components/comment/CommentForm";
import CommentsList from "../components/comment/CommentsList";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";

function PostDetail() {
  const { subredditName, postId } = useParams();
  const dispatch = useDispatch();
  const {
    currentPost,
    loading: postLoading,
    error: postError,
  } = useSelector((state) => state.posts);
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
  } = useSelector((state) => state.comments);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPost(postId));
      dispatch(fetchComments(postId));

      // Join WebSocket room for this post
      joinPost(postId);

      // Clean up when component unmounts
      return () => {
        leavePost(postId);
      };
    }
  }, [dispatch, postId]);

  const handleVotePost = (voteType) => {
    if (isAuthenticated) {
      dispatch(votePost({ postId, voteType }));
    }
  };

  const handleVoteComment = (commentId, voteType) => {
    if (isAuthenticated) {
      dispatch(voteComment({ commentId, voteType }));
    }
  };

  const handleCreateComment = (content, parentId = null) => {
    if (isAuthenticated && content.trim()) {
      dispatch(createComment({ postId, content, parentId }));
    }
  };

  if (postLoading) {
    return <Loading />;
  }

  if (postError) {
    return <Alert type="error" message={postError} />;
  }

  if (!currentPost) {
    return <Alert type="error" message="Post not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link
          to={`/r/${subredditName}`}
          className="text-reddit-orange hover:underline font-medium"
        >
          ← Back to {subredditName}
        </Link>
      </div>

      <PostCard post={currentPost} onVote={handleVotePost} detailed />

      {isAuthenticated ? (
        <div className="mt-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Add a comment</h2>
          <CommentForm onSubmit={handleCreateComment} />
        </div>
      ) : (
        <div className="mt-6 mb-8 p-4 bg-gray-100 rounded-lg text-center">
          <p>
            <Link to="/login" className="text-reddit-orange hover:underline">
              Log in
            </Link>{" "}
            or{" "}
            <Link to="/register" className="text-reddit-orange hover:underline">
              sign up
            </Link>{" "}
            to leave a comment
          </p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Comments ({comments.length})
        </h2>

        {commentsLoading ? (
          <Loading />
        ) : commentsError ? (
          <Alert type="error" message={commentsError} />
        ) : comments.length > 0 ? (
          <CommentsList
            comments={comments}
            onVote={handleVoteComment}
            onReply={handleCreateComment}
          />
        ) : (
          <p className="text-gray-500 italic">No comments yet</p>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
