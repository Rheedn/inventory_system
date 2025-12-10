import React from "react";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-2 text-center">
        {/* header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                404
              </div>
            </div>
          </div>
          <h1 className="font-bold text-3xl text-gray-900">Page Not Found</h1>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered an incorrect URL.
          </p>
        </div>

        {/* body */}
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm">
              <strong>Possible reasons:</strong>
            </p>
            <ul className="text-gray-600 text-sm mt-2 space-y-1 text-left">
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Typo in the URL</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Page has been moved or deleted</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Broken link</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center items-center sm:flex-row gap-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
