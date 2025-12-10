import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Shield,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Activity,
  Loader2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayOut from "../layout/PageLayOut";
import { useLogStore } from "../store/logsStore";

const LogDetailsPage = () => {
  const { log_id } = useParams();
  const { getLogById } = useLogStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logData, setLogData] = useState(null);

  // Mock function to fetch log details - replace with your actual API call
  useEffect(() => {
    const fetchLogDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with your actual API
        const response = await getLogById(log_id);
        setLogData(response.data);
      } catch (error) {
        console.error("Error fetching log details:", error);
        toast.error("Failed to load log details");
      } finally {
        setLoading(false);
      }
    };

    if (log_id) {
      fetchLogDetails();
    } else {
      toast.error("Log ID not provided");
    }
  }, [log_id]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "info":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "warning":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "error":
        return "bg-red-100 text-red-800 border border-red-200";
      case "success":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getCategoryColor = (category) => {
    const categories = {
      user_management: "bg-purple-100 text-purple-800 border border-purple-200",
      request_management:
        "bg-indigo-100 text-indigo-800 border border-indigo-200",
      equipment_management: "bg-cyan-100 text-cyan-800 border border-cyan-200",
      system_operations: "bg-gray-100 text-gray-800 border border-gray-200",
      security: "bg-red-100 text-red-800 border border-red-200",
    };
    return (
      categories[category] || "bg-gray-100 text-gray-800 border border-gray-200"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;

      return formatDate(dateString);
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#db002f] mx-auto" />
            <p className="mt-4 text-gray-600">Loading log details...</p>
          </div>
        </div>
      </PageLayOut>
    );
  }

  if (!logData) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">
              Log Not Found
            </h2>
            <p className="text-gray-600 mt-2">
              The log you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/logs")}
              className="mt-4 bg-[#db002f] text-white px-4 py-2 rounded-lg hover:bg-[#b50025] transition-colors"
            >
              Back to Logs
            </button>
          </div>
        </div>
      </PageLayOut>
    );
  }

  return (
    <PageLayOut>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/logs")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Logs</span>
            </button>

            <div className="flex items-start space-x-4">
              <div className="p-4 bg-[#ffe6ea] rounded-xl">
                <FileText className="w-8 h-8 text-[#db002f]" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Log Details
                </h1>
                <p className="text-gray-600 mt-2">
                  Complete information about this system event
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getSeverityColor(
                      logData.severity
                    )}`}
                  >
                    {getSeverityIcon(logData.severity)}
                    <span className="text-sm font-medium capitalize">
                      {logData.severity}
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getCategoryColor(
                      logData.category
                    )}`}
                  >
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                      {logData.category?.replace("_", " ") || "General"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatRelativeTime(logData.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Action Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Action Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Performed
                    </label>
                    <p className="text-lg font-medium text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {logData.action}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[100px]">
                      {logData.details}
                    </p>
                  </div>

                  {logData.affected_resource && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Affected Resource
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-sm font-mono text-gray-900 truncate">
                            {logData.affected_resource}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            {logData.resource_type?.replace("_", " ") ||
                              "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Technical Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Log ID
                    </label>
                    <p className="text-sm font-mono text-gray-900 bg-gray-50 p-3 rounded border border-gray-200 truncate">
                      {logData.log_id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IP Address
                    </label>
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded border border-gray-200">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-mono text-gray-900">
                        {logData.ip_address}
                      </span>
                    </div>
                  </div>

                  {logData.user_agent && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Agent
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                        {logData.user_agent}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  User Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#ffe6ea] rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#db002f]" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {logData.user_name || "System"}
                      </div>
                      <div className="text-[10px] truncate w-full text-gray-500">
                        {logData.user_email || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">User ID</span>
                      <span className="font-mono text-gray-900 text-xs">
                        {logData.user_id?.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Role</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          logData.user_role === "admin" ||
                          logData.user_role === "super_admin"
                            ? "bg-[#ffe6ea] text-[#db002f] border border-[#ffb8c4]"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {logData.user_role
                          ? logData.user_role.replace("_", " ")
                          : "System"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Event Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-[#ffe6ea] rounded-full mt-0.5">
                      <Calendar className="w-4 h-4 text-[#db002f]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Event Occurred
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(logData.created_at)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(logData.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Log Recorded
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(logData.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/logs")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Back to Logs List
                  </button>
                  {logData.affected_resource && (
                    <button
                      onClick={() => {
                        if (logData.resource_type === "equipment_request") {
                          navigate(`/requests/${logData.affected_resource}`);
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      View Related Resource
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(logData.log_id);
                      toast.success("Log ID copied to clipboard");
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Copy Log ID
                  </button>
                </div>
              </div>

              {/* Security Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Security Context
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Severity Level
                    </span>
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(logData.severity)}
                      <span className="text-sm font-medium capitalize">
                        {logData.severity}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm font-medium capitalize">
                      {logData.category?.replace("_", " ") || "General"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Source IP</span>
                    <span className="text-sm font-mono">
                      {logData.ip_address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayOut>
  );
};

export default LogDetailsPage;
