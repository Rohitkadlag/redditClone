// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { formatDistanceToNow } from "date-fns";
// import {
//   ArrowUpIcon,
//   ArrowDownIcon,
//   ReplyIcon,
//   DotsHorizontalIcon,
// } from "@heroicons/react/outline";
// import CommentForm from "./CommentForm";
// import ReportButton from "../common/ReportButton";

// function Comment({ comment, onVote, onReply }) {
//   const [isReplying, setIsReplying] = useState(false);
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   if (!comment) return null;

//   const handleVote = (voteType) => {
//     if (isAuthenticated && onVote) {
//       onVote(comment._id, voteType);
//     }
//   };

//   const handleReply = (content) => {
//     if (onReply) {
//       onReply(content, comment._id);
//       setIsReplying(false);
//     }
//   };

//   const getVoteButtonClasses = (voteType) => {
//     const baseClasses = "flex items-center p-1 rounded-sm hover:bg-gray-100";
//     const upvoteActive =
//       comment.userVote === "upvote" ? "text-orange-500" : "text-gray-500";
//     const downvoteActive =
//       comment.userVote === "downvote" ? "text-blue-500" : "text-gray-500";

//     return `${baseClasses} ${
//       voteType === "upvote" ? upvoteActive : downvoteActive
//     }`;
//   };

//   return (
//     <div className="bg-white rounded-lg p-3 border border-reddit-border">
//       <div className="text-xs text-gray-500 mb-1">
//         <Link
//           to={`/user/${comment.author.username}`}
//           className="font-bold hover:underline"
//         >
//           u/{comment.author.username}
//         </Link>
//         {" • "}
//         <span title={new Date(comment.createdAt).toLocaleString()}>
//           {formatDistanceToNow(new Date(comment.createdAt), {
//             addSuffix: true,
//           })}
//         </span>
//         {comment.edited && (
//           <span title={new Date(comment.editedAt).toLocaleString()}>
//             {" • edited"}
//           </span>
//         )}
//       </div>

//       <div className="mb-2 whitespace-pre-line">{comment.content}</div>

//       <div className="flex items-center text-xs text-gray-500">
//         <div className="flex items-center mr-2 space-x-1">
//           <button
//             className={getVoteButtonClasses("upvote")}
//             onClick={() => handleVote("upvote")}
//             aria-label="Upvote"
//           >
//             <ArrowUpIcon className="h-4 w-4" />
//           </button>

//           <span className="font-semibold">{comment.score}</span>

//           <button
//             className={getVoteButtonClasses("downvote")}
//             onClick={() => handleVote("downvote")}
//             aria-label="Downvote"
//           >
//             <ArrowDownIcon className="h-4 w-4" />
//           </button>
//         </div>

//         {isAuthenticated && (
//           <button
//             className="flex items-center mr-2 hover:bg-gray-100 p-1 rounded"
//             onClick={() => setIsReplying(!isReplying)}
//           >
//             <ReplyIcon className="h-4 w-4 mr-1" />
//             Reply
//           </button>
//         )}

//         <button className="flex items-center hover:bg-gray-100 p-1 rounded">
//           <DotsHorizontalIcon className="h-4 w-4" />
//         </button>
//         {isAuthenticated && (
//           <ReportButton
//             targetType="comment"
//             targetId={comment._id}
//             targetName={`by ${comment.author.username}`}
//             buttonStyle="icon"
//           />
//         )}
//       </div>

//       {isReplying && (
//         <div className="mt-2 ml-4">
//           <CommentForm onSubmit={handleReply} isReply />
//         </div>
//       )}

//       {/* Nested replies */}
//       {comment.replies && comment.replies.length > 0 && (
//         <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-200">
//           {comment.replies.map((reply) => (
//             <Comment
//               key={reply._id}
//               comment={reply}
//               onVote={onVote}
//               onReply={onReply}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Comment;
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ReplyIcon,
  DotsHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import CommentForm from "./CommentForm";
import ReportButton from "../common/ReportButton";

function Comment({ comment, onVote, onReply, onEdit, onDelete }) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleEdit = (content) => {
    if (onEdit) {
      onEdit(comment._id, content);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      if (window.confirm("Are you sure you want to delete this comment?")) {
        onDelete(comment._id);
      }
    }
    setShowMenu(false);
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

  // Check if current user is the author of the comment
  const isAuthor =
    isAuthenticated &&
    user &&
    comment.author &&
    user.username === comment.author.username;

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

      {isEditing ? (
        <div className="mb-2">
          <CommentForm
            initialValue={comment.content}
            onSubmit={handleEdit}
            isEdit={true}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="mb-2 whitespace-pre-line">{comment.content}</div>
      )}

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

        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center hover:bg-gray-100 p-1 rounded"
            onClick={() => setShowMenu(!showMenu)}
          >
            <DotsHorizontalIcon className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute z-10 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg py-1 w-32">
              {isAuthor && (
                <>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    onClick={handleDelete}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
              {isAuthenticated && (
                <ReportButton
                  targetType="comment"
                  targetId={comment._id}
                  targetName={`by ${comment.author.username}`}
                  buttonStyle="menu"
                />
              )}
            </div>
          )}
        </div>
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
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
