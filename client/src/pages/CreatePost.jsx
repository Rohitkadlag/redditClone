// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { createPost } from "../features/posts/postsSlice";
// import { fetchSubreddits } from "../features/subreddits/subredditsSlice";
// import Alert from "../components/common/Alert";
// import Loading from "../components/common/Loading";

// function CreatePost() {
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     subredditId: "",
//     type: "text",
//   });
//   const [formErrors, setFormErrors] = useState({});

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading: postLoading, error: postError } = useSelector(
//     (state) => state.posts
//   );
//   const { subreddits, loading: subredditsLoading } = useSelector(
//     (state) => state.subreddits
//   );

//   useEffect(() => {
//     dispatch(fetchSubreddits());
//   }, [dispatch]);

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.title.trim()) {
//       errors.title = "Title is required";
//     } else if (formData.title.length > 300) {
//       errors.title = "Title must be less than 300 characters";
//     }

//     if (!formData.subredditId) {
//       errors.subredditId = "Please select a community";
//     }

//     if (formData.type === "text" && !formData.content.trim()) {
//       errors.content = "Content is required for text posts";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       const result = await dispatch(createPost(formData));

//       if (!result.error) {
//         // Find the subreddit object to get its name for navigation
//         const subreddit = subreddits.find(
//           (s) => s._id === formData.subredditId
//         );
//         navigate(`/r/${subreddit.name}/posts/${result.payload._id}`);
//       }
//     }
//   };

//   if (subredditsLoading) {
//     return <Loading />;
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white p-6 rounded-lg shadow-md border border-reddit-border">
//         <h1 className="text-2xl font-bold mb-6">Create a post</h1>

//         {postError && <Alert type="error" message={postError} />}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium mb-2">
//               Community
//             </label>
//             <select
//               name="subredditId"
//               className={`input ${
//                 formErrors.subredditId ? "border-red-500" : ""
//               }`}
//               value={formData.subredditId}
//               onChange={handleChange}
//               disabled={postLoading}
//             >
//               <option value="">Select a community</option>
//               {subreddits.map((subreddit) => (
//                 <option key={subreddit._id} value={subreddit._id}>
//                   r/{subreddit.name}
//                 </option>
//               ))}
//             </select>
//             {formErrors.subredditId && (
//               <p className="text-red-500 text-xs mt-1">
//                 {formErrors.subredditId}
//               </p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium mb-2">
//               Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               className={`input ${formErrors.title ? "border-red-500" : ""}`}
//               value={formData.title}
//               onChange={handleChange}
//               disabled={postLoading}
//               placeholder="Give your post a title"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               {formData.title.length}/300
//             </p>
//             {formErrors.title && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
//             )}
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-medium mb-2">
//               Content
//             </label>
//             <textarea
//               name="content"
//               rows="8"
//               className={`input ${formErrors.content ? "border-red-500" : ""}`}
//               value={formData.content}
//               onChange={handleChange}
//               disabled={postLoading}
//               placeholder="Text (optional)"
//             ></textarea>
//             {formErrors.content && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
//             )}
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="button"
//               className="btn btn-secondary mr-2"
//               onClick={() => navigate(-1)}
//               disabled={postLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={postLoading}
//             >
//               {postLoading ? "Posting..." : "Post"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreatePost;

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../features/posts/postsSlice";
import { fetchSubreddits } from "../features/subreddits/subredditsSlice";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";
import { SearchIcon } from "@heroicons/react/outline";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subredditId: "",
    type: "text",
  });
  const [formErrors, setFormErrors] = useState({});
  const [communitySearchTerm, setCommunitySearchTerm] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: postLoading, error: postError } = useSelector(
    (state) => state.posts
  );
  const { subreddits, loading: subredditsLoading } = useSelector(
    (state) => state.subreddits
  );

  useEffect(() => {
    // Fetch all subreddits (larger limit)
    dispatch(
      fetchSubreddits({
        limit: 1000, // Set a high limit to get all communities
      })
    );
  }, [dispatch]);

  // Check for subreddit ID in URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subredditId = params.get("subreddit");

    if (subredditId) {
      setFormData((prev) => ({ ...prev, subredditId }));
    }
  }, [location.search]);

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

  // Filter communities based on search term
  const filteredCommunities = communitySearchTerm
    ? subreddits.filter(
        (sr) =>
          sr.name.toLowerCase().includes(communitySearchTerm.toLowerCase()) ||
          (sr.description &&
            sr.description
              .toLowerCase()
              .includes(communitySearchTerm.toLowerCase()))
      )
    : subreddits;

  if (subredditsLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">Create a post</h1>

        {postError && <Alert type="error" message={postError} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Community
            </label>

            {/* Community search input */}
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for a community..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={communitySearchTerm}
                onChange={(e) => setCommunitySearchTerm(e.target.value)}
              />
            </div>

            {/* Community selection dropdown */}
            <select
              name="subredditId"
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.subredditId ? "border-red-500 ring-red-500" : ""
              }`}
              value={formData.subredditId}
              onChange={handleChange}
              disabled={postLoading}
            >
              <option value="">Select a community</option>
              {filteredCommunities.map((subreddit) => (
                <option key={subreddit._id} value={subreddit._id}>
                  {subreddit.name} ({subreddit.subscribers} members)
                </option>
              ))}
            </select>

            {/* Selected community count info */}
            <p className="text-xs text-gray-500 mt-1">
              {filteredCommunities.length} communities{" "}
              {communitySearchTerm ? "found" : "available"}
              {communitySearchTerm &&
                filteredCommunities.length === 0 &&
                ". Try a different search term."}
            </p>

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
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.title ? "border-red-500 ring-red-500" : ""
              }`}
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
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.content ? "border-red-500 ring-red-500" : ""
              }`}
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
              className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => navigate(-1)}
              disabled={postLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
