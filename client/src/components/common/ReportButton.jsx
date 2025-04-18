// client/src/components/common/ReportButton.jsx
import { useState } from "react";
import { FlagIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReportModal from "./ReportModal";

function ReportButton({
  targetType,
  targetId,
  targetName,
  buttonStyle = "icon",
}) {
  const [showReportModal, setShowReportModal] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleReportClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    setShowReportModal(true);
  };

  const closeModal = () => {
    setShowReportModal(false);
  };

  return (
    <>
      {buttonStyle === "icon" ? (
        <button
          onClick={handleReportClick}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500"
          title={`Report ${targetType}`}
        >
          <FlagIcon className="h-5 w-5" />
        </button>
      ) : buttonStyle === "text" ? (
        <button
          onClick={handleReportClick}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Report
        </button>
      ) : (
        <button
          onClick={handleReportClick}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500"
        >
          <FlagIcon className="h-4 w-4" />
          <span>Report</span>
        </button>
      )}

      <ReportModal
        isOpen={showReportModal}
        onClose={closeModal}
        targetType={targetType}
        targetId={targetId}
        targetName={targetName}
      />
    </>
  );
}

export default ReportButton;
