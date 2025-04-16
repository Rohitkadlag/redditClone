// src/pages/Discussions.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscussions } from "../features/discussions/discussionsSlice";
import DiscussionList from "../components/discussion/DiscussionList";
import CreateDiscussionForm from "../components/discussion/CreateDiscussionForm";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import Pagination from "../components/common/Pagination";

function Discussions() {
  const dispatch = useDispatch();
  const { discussions, loading, error, pagination } = useSelector(
    (state) => state.discussions
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [sortBy, setSortBy] = useState("new");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    dispatch(fetchDiscussions({ sortBy }));
  }, [dispatch, sortBy]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow border border-reddit-border mb-4">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Open Discussions</h1>
            {isAuthenticated && (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? "Cancel" : "Start Discussion"}
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="mb-4">
              <CreateDiscussionForm
                onComplete={() => setShowCreateForm(false)}
              />
            </div>
          )}

          <p className="text-gray-600 mb-4">
            Join open discussions with the entire community. These threads are
            not tied to any specific subreddit.
          </p>

          <div className="flex space-x-4 border-b pb-2 mb-4">
            <button
              className={`font-medium ${
                sortBy === "new"
                  ? "text-reddit-orange"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSortChange("new")}
            >
              New
            </button>
            <button
              className={`font-medium ${
                sortBy === "top"
                  ? "text-reddit-orange"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSortChange("top")}
            >
              Top
            </button>
            <button
              className={`font-medium ${
                sortBy === "active"
                  ? "text-reddit-orange"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSortChange("active")}
            >
              Active
            </button>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        {loading ? (
          <Loading />
        ) : discussions.length > 0 ? (
          <div className="p-4">
            <DiscussionList discussions={discussions} />

            {pagination.pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) =>
                  dispatch(fetchDiscussions({ sortBy, page }))
                }
              />
            )}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-500">
              No discussions yet. Be the first to start one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Discussions;
