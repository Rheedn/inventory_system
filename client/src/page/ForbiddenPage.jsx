import React from "react";
import { Shield, Home, ArrowLeft } from "lucide-react";

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
        {/* header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="font-bold text-3xl text-gray-900">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* body */}
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              Error 403: Forbidden - Insufficient privileges
            </p>
          </div>

          <div className="flex justify-center flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home Page</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForbiddenPage;