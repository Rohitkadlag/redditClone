import { useState } from "react";

function CommentForm({ onSubmit, isReply = false }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim() && onSubmit) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="input mb-2"
        placeholder={
          isReply
            ? "What are your thoughts on this comment?"
            : "What are your thoughts?"
        }
        rows={isReply ? 2 : 4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!content.trim()}
        >
          {isReply ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
