import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSubreddit } from "../../features/subreddits/subredditsSlice";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

const CreateCommunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.subreddits);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("public");
  const [nameError, setNameError] = useState("");

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/create-community");
    }
  }, [isAuthenticated, navigate]);

  const validateName = (value) => {
    if (!value.trim()) {
      setNameError("Community name is required");
      return false;
    }

    if (value.length < 3) {
      setNameError("Community name must be at least 3 characters");
      return false;
    }

    if (value.length > 21) {
      setNameError("Community name must be 21 characters or less");
      return false;
    }

    // Only allow letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setNameError(
        "Community names can only contain letters, numbers, and underscores"
      );
      return false;
    }

    setNameError("");
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateName(name)) {
      return;
    }

    try {
      const resultAction = await dispatch(
        createSubreddit({
          name,
          description,
          type,
        })
      );

      if (createSubreddit.fulfilled.match(resultAction)) {
        // Navigate to the new community page
        navigate(`/r/${resultAction.payload.name}`);
      }
    } catch (err) {
      console.error("Failed to create community:", err);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated (will redirect)
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create a Community
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="space-y-6">
          {/* Name field */}
          <div>
            <label
              htmlFor="community-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
                r/
              </span>
              <input
                type="text"
                id="community-name"
                name="name"
                value={name}
                onChange={handleNameChange}
                className={`block w-full pl-8 pr-3 py-2 border ${
                  nameError ? "border-red-300 text-red-900" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="community_name"
              />
              {nameError && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            {nameError && (
              <p className="mt-2 text-sm text-red-600">{nameError}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Community names cannot be changed once created.
            </p>
          </div>

          {/* Description field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Describe your community..."
            ></textarea>
            <p className="mt-2 text-xs text-gray-500">
              This will be shown on your community page. You can edit this
              later.
            </p>
          </div>

          {/* Community type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Community Type
            </label>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="public"
                    name="type"
                    type="radio"
                    checked={type === "public"}
                    onChange={() => setType("public")}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="public"
                    className="font-medium text-sm text-gray-700"
                  >
                    Public
                  </label>
                  <p className="text-xs text-gray-500">
                    Anyone can view, post, and comment to this community
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="restricted"
                    name="type"
                    type="radio"
                    checked={type === "restricted"}
                    onChange={() => setType("restricted")}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="restricted"
                    className="font-medium text-sm text-gray-700"
                  >
                    Restricted
                  </label>
                  <p className="text-xs text-gray-500">
                    Anyone can view this community, but only approved users can
                    post
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="private"
                    name="type"
                    type="radio"
                    checked={type === "private"}
                    onChange={() => setType("private")}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="private"
                    className="font-medium text-sm text-gray-700"
                  >
                    Private
                  </label>
                  <p className="text-xs text-gray-500">
                    Only approved users can view and submit to this community
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error creating community
                  </h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name || nameError}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                loading || !name || nameError
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {loading ? "Creating..." : "Create Community"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
