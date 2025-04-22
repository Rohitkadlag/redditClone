// import Comment from "./Comment";

// function CommentsList({ comments, onVote, onReply }) {
//   if (!comments || comments.length === 0) {
//     return null;
//   }

//   return (
//     <div className="space-y-4">
//       {comments.map((comment) => (
//         <Comment
//           key={comment._id}
//           comment={comment}
//           onVote={onVote}
//           onReply={onReply}
//         />
//       ))}
//     </div>
//   );
// }

// export default CommentsList;
import { useDispatch } from "react-redux";
import Comment from "./Comment";
import {
  editComment,
  deleteComment,
} from "../../features/comments/commentsSlice";

function CommentsList({ comments, onVote, onReply }) {
  const dispatch = useDispatch();

  if (!comments || comments.length === 0) {
    return null;
  }

  const handleEdit = (commentId, content) => {
    dispatch(editComment({ commentId, content }));
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onVote={onVote}
          onReply={onReply}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default CommentsList;
