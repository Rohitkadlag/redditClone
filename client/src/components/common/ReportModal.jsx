// client/src/components/common/ReportModal.jsx
import { useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import api from "../../services/api";

function ReportModal({ isOpen, onClose, targetType, targetId, targetName }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const reasons = {
    user: [
      { value: "harassment", label: "Harassment" },
      { value: "threatening_violence", label: "Threatening violence" },
      { value: "hate", label: "Hate speech or symbols" },
      { value: "impersonation", label: "Impersonation" },
      { value: "spam", label: "Spam" },
      { value: "other", label: "Other" },
    ],
    post: [
      { value: "spam", label: "Spam" },
      { value: "misinformation", label: "Misinformation" },
      { value: "breaking_subreddit_rules", label: "Breaking community rules" },
      { value: "harassment", label: "Harassment" },
      { value: "hate", label: "Hate speech" },
      { value: "self_harm", label: "Self-harm or suicide" },
      { value: "other", label: "Other" },
    ],
    comment: [
      { value: "spam", label: "Spam" },
      { value: "harassment", label: "Harassment" },
      { value: "hate", label: "Hate speech" },
      { value: "misinformation", label: "Misinformation" },
      { value: "breaking_subreddit_rules", label: "Breaking community rules" },
      { value: "other", label: "Other" },
    ],
    subreddit: [
      { value: "prohibited_transaction", label: "Prohibited transactions" },
      { value: "misinformation", label: "Misinformation" },
      { value: "hate", label: "Hate" },
      { value: "harassment", label: "Harassment" },
      { value: "other", label: "Other" },
    ],
  };

  // Select appropriate reason list based on target type
  const reasonOptions = reasons[targetType] || reasons.user;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setError("Please select a reason for reporting");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/reports", {
        targetType,
        targetId,
        reason,
        description,
      });

      setSuccess(true);
      setLoading(false);

      // Reset form
      setReason("");
      setDescription("");

      // Auto close after 3 seconds on success
      setTimeout(() => {
        if (onClose) onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to submit report");
      console.error("Error submitting report:", err);
    }
  };

  if (!isOpen) return null;

  const targetTypeLabel =
    {
      user: "User",
      post: "Post",
      comment: "Comment",
      subreddit: "Community",
    }[targetType] || "Content";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 md:mx-0">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">
            Report {targetTypeLabel}: {targetName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-700">
                Thank you for your report. The moderators will review it.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you reporting this {targetTypeLabel.toLowerCase()}?
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Select a reason --</option>
                {reasonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional information (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Please provide any additional details that might help moderators understand the issue..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:bg-red-400"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportModal;
