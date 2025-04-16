import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../features/posts/postsSlice";
import { fetchSubreddits } from "../features/subreddits/subredditsSlice";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subredditId: "",
    type: "text",
  });
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: postLoading, error: postError } = useSelector(
    (state) => state.posts
  );
  const { subreddits, loading: subredditsLoading } = useSelector(
    (state) => state.subreddits
  );

  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.length > 300) {
      errors.title = "Title must be less than 300 characters";
    }

    if (!formData.subredditId) {
      errors.subredditId = "Please select a community";
    }

    if (formData.type === "text" && !formData.content.trim()) {
      errors.content = "Content is required for text posts";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const result = await dispatch(createPost(formData));

      if (!result.error) {
        // Find the subreddit object to get its name for navigation
        const subreddit = subreddits.find(
          (s) => s._id === formData.subredditId
        );
        navigate(`/r/${subreddit.name}/posts/${result.payload._id}`);
      }
    }
  };

  if (subredditsLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border border-reddit-border">
        <h1 className="text-2xl font-bold mb-6">Create a post</h1>

        {postError && <Alert type="error" message={postError} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Community
            </label>
            <select
              name="subredditId"
              className={`input ${
                formErrors.subredditId ? "border-red-500" : ""
              }`}
              value={formData.subredditId}
              onChange={handleChange}
              disabled={postLoading}
            >
              <option value="">Select a community</option>
              {subreddits.map((subreddit) => (
                <option key={subreddit._id} value={subreddit._id}>
                  r/{subreddit.name}
                </option>
              ))}
            </select>
            {formErrors.subredditId && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.subredditId}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              className={`input ${formErrors.title ? "border-red-500" : ""}`}
              value={formData.title}
              onChange={handleChange}
              disabled={postLoading}
              placeholder="Give your post a title"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/300
            </p>
            {formErrors.title && (
              <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              name="content"
              rows="8"
              className={`input ${formErrors.content ? "border-red-500" : ""}`}
              value={formData.content}
              onChange={handleChange}
              disabled={postLoading}
              placeholder="Text (optional)"
            ></textarea>
            {formErrors.content && (
              <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={() => navigate(-1)}
              disabled={postLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={postLoading}
            >
              {postLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
