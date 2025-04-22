// import { useState } from "react";

// function CommentForm({ onSubmit, isReply = false }) {
//   const [content, setContent] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (content.trim() && onSubmit) {
//       onSubmit(content);
//       setContent("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <textarea
//         className="input mb-2"
//         placeholder={
//           isReply
//             ? "What are your thoughts on this comment?"
//             : "What are your thoughts?"
//         }
//         rows={isReply ? 2 : 4}
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       ></textarea>

//       <div className="flex justify-end">
//         <button
//           type="submit"
//           className="btn btn-primary"
//           disabled={!content.trim()}
//         >
//           {isReply ? "Reply" : "Comment"}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default CommentForm;
import { useState, useEffect } from "react";

function CommentForm({
  onSubmit,
  isReply = false,
  isEdit = false,
  initialValue = "",
  onCancel,
}) {
  const [content, setContent] = useState(initialValue);

  // Update the content if initialValue changes (for editing)
  useEffect(() => {
    if (isEdit) {
      setContent(initialValue);
    }
  }, [initialValue, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim() && onSubmit) {
      onSubmit(content);
      if (!isEdit) {
        setContent("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="input mb-2 w-full p-2 border border-gray-300 rounded"
        placeholder={
          isEdit
            ? "Edit your comment..."
            : isReply
            ? "What are your thoughts on this comment?"
            : "What are your thoughts?"
        }
        rows={isReply ? 2 : 4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <div className="flex justify-end space-x-2">
        {isEdit && onCancel && (
          <button
            type="button"
            className="btn btn-secondary text-sm px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!content.trim()}
        >
          {isEdit ? "Save" : isReply ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
