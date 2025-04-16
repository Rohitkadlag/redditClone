// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <h1 className="text-4xl font-bold text-reddit-orange mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>

      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;
