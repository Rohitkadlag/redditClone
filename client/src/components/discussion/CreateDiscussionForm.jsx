// src/components/discussion/CreateDiscussionForm.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDiscussion } from "../../features/discussions/discussionsSlice";

function CreateDiscussionForm({ onComplete }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.discussions);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() && content.trim()) {
      await dispatch(createDiscussion({ title, content }));
      setTitle("");
      setContent("");
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Start a New Discussion</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Discussion title"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            className="input"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to discuss?"
            required
            disabled={loading}
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? "Posting..." : "Post Discussion"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateDiscussionForm;
