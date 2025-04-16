import Comment from "./Comment";

function CommentsList({ comments, onVote, onReply }) {
  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onVote={onVote}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

export default CommentsList;
