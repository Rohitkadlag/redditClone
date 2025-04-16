// src/components/common/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Alert from "./Alert";
import Loading from "./Loading";

function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Check if user is admin or admitty_manager
  const isAdmin =
    user && (user.role === "admin" || user.role === "admitty_manager");

  // If auth is still loading, show a loading indicator
  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Redirect to admin login page if not authenticated
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    // Show access denied message if authenticated but not admin
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert
          type="error"
          message="Access denied. You need administrative privileges to view this page."
        />
        <div className="mt-4 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            Return to home page
          </a>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
