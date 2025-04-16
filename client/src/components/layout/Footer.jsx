// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-reddit-orange rounded-full"></div>
              <span className="text-lg font-bold text-gray-900">
                Admitty Forum
              </span>
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              A place for communities and conversations
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {currentYear} Admitty Forum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
