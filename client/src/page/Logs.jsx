import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Clock,
  User,
  Calendar,
  RefreshCcw,
  Loader2,
  FileText,
  Activity,
} from "lucide-react";
import PageLayOut from "../layout/PageLayOut";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useLogStore } from "../store/logsStore";

const LogsPage = () => {
  const { logs, fetchLogs, refreshLogs, totalLogs, clearLogs } = useLogStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [clearingLogs, setClearingLogs] = useState(false);
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    limit: 10,
    offset: 0,
  });

  const handleFetch = async (payload) => {
    setLoading(true);
    try {
      await fetchLogs(true, payload);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch(payload);
  }, [payload]);

  const handlePayloadSetting = (type) => {
    setPayload((prev) => {
      let newOffset = prev.offset;

      if (type === "next") newOffset = prev.offset + prev.limit;
      if (type === "prev") newOffset = Math.max(0, prev.offset - prev.limit);

      return { ...prev, offset: newOffset };
    });
  };

  const hasNext = totalLogs
    ? payload.offset + payload.limit < totalLogs
    : false;
  const hasPrev = payload.offset > 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshLogs(true, payload);
      toast.success("Logs refreshed successfully");
    } catch (error) {
      console.log(error.message || "Error refreshing");
      toast.error("Error refreshing logs");
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearLogs = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all logs? This action cannot be undone."
      )
    ) {
      return;
    }

    setClearingLogs(true);
    try {
      await clearLogs();
      toast.success("All logs cleared successfully");
      await handleFetch(payload);
    } catch (error) {
      console.error("Clear logs error:", error);
      toast.error("Failed to clear logs");
    } finally {
      setClearingLogs(false);
    }
  };

  // Extract unique users and log types for filters
  const uniqueUsers = [
    ...new Set(logs?.data?.map((log) => log.user_name).filter(Boolean) || []),
  ];
  const uniqueTypes = [
    ...new Set(logs?.data?.map((log) => log.action_type).filter(Boolean) || []),
  ];

  const logsData = logs?.data || logs || [];

  // Filter logs based on search and filters
  const filteredLogs = logsData.filter((log) => {
    if (!log) return false;

    const matchesSearch =
      log.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_agent?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || log.action_type === typeFilter;
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    const matchesUser = userFilter === "all" || log.user_name === userFilter;

    return matchesSearch && matchesType && matchesSeverity && matchesUser;
  });

 const getSeverityIcon = (severity) => {
  switch (severity) {
    case "info":
      return <Info className="w-4 h-4 text-blue-500" />;
    case "moderate":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case "error":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "success":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    default:
      return <Activity className="w-4 h-4 text-gray-500" />;
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case "info":
      return "bg-blue-100 text-blue-800";
    case "moderate":
      return "bg-yellow-100 text-yellow-800";
    case "warning":
      return "bg-orange-100 text-orange-800";
    case "error":
      return "bg-red-100 text-red-800";
    case "success":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
  const getActionTypeColor = (actionType) => {
    const type = actionType?.toLowerCase();
    if (type?.includes("create") || type?.includes("add"))
      return "bg-green-100 text-green-800";
    if (type?.includes("update") || type?.includes("edit"))
      return "bg-blue-100 text-blue-800";
    if (type?.includes("delete") || type?.includes("remove"))
      return "bg-red-100 text-red-800";
    if (type?.includes("login") || type?.includes("auth"))
      return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
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
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;

      return formatDate(dateString);
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleSelectLog = (logId) => {
    setSelectedLogs((prev) =>
      prev.includes(logId)
        ? prev.filter((id) => id !== logId)
        : [...prev, logId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map((log) => log.log_id));
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (loading) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#db002f] mx-auto" />
            <p className="mt-4 text-gray-600">Loading logs...</p>
          </div>
        </div>
      </PageLayOut>
    );
  }

  return (
    <PageLayOut>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  System Logs
                </h1>
                <p className="text-gray-600 mt-2">
                  Monitor system activities and user actions
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 bg-[#ffe6ea] text-[#db002f] px-4 py-2 rounded-lg hover:bg-[#ffbaba] transition-colors disabled:opacity-50"
                >
                  <RefreshCcw
                    className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                </button>
                <button
                  onClick={handleClearLogs}
                  disabled={clearingLogs}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {clearingLogs ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  <span>{clearingLogs ? "Clearing..." : "Clear All Logs"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Logs
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {logsData.length}
                  </p>
                </div>
                <div className="p-3 bg-[#ffe6ea] rounded-lg">
                  <FileText className="w-6 h-6 text-[#db002f]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {logsData.filter((log) => log.severity === "error").length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {
                      logsData.filter((log) => log.severity === "warning")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {uniqueUsers.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <User className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by action, details, user, or IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                  />
                </div>

                {/* Severity Filter */}
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  <option value="all">All Severity</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="success">Success</option>
                </select>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {/* User Filter */}
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  {uniqueUsers.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#db002f]">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#db002f]">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedLogs.length === filteredLogs.length &&
                          filteredLogs.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-[#db002f] focus:ring-[#db002f]"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.log_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(log.log_id)}
                          onChange={() => handleSelectLog(log.log_id)}
                          className="rounded border-gray-300 text-[#db002f] focus:ring-[#db002f]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm truncate font-medium text-gray-900">
                              {log.action || "Unknown Action"}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              ID:{" "}
                              {log.log_id
                                ? log.log_id.slice(0, 8) + "..."
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm truncate text-gray-900 max-w-md">
                          {truncateText(log.details, 120)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {log.user_name || "System"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(log.severity)}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                              log.severity
                            )}`}
                          >
                            {log.severity
                              ? log.severity.charAt(0).toUpperCase() +
                                log.severity.slice(1)
                              : "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-gray-900">
                          {log.ip_address || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatRelativeTime(log.created_at)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(log.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`${log.log_id}`)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FileText className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No logs found</p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredLogs.length} of {totalLogs} logs
                  {selectedLogs.length > 0 && (
                    <span className="ml-2 text-[#db002f]">
                      • {selectedLogs.length} selected
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={!hasPrev}
                    onClick={() => handlePayloadSetting("prev")}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#db002f] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!hasNext}
                    onClick={() => handlePayloadSetting("next")}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#db002f] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayOut>
  );
};

export default LogsPage;
