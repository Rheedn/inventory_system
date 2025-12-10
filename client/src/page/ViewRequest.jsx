import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  User,
  Calendar,
  MoreVertical,
  Download,
  Send,
  Mail,
  Phone,
  Loader,
  Loader2,
  ArrowLeft,
  RefreshCcw,
  QrCode,
  Scan,
  Camera,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import PageLayOut from "../layout/PageLayOut";
import { useRequestStore } from "../store/requestStore";
import { useAuthStore } from "../store/authStore";
import ScanRequestModal from "../assets/components/modal/ScanRequestModal";
import RequestDetailView from "./RequestDetailsView";
import axios from "axios";

const ViewRequests = () => {
  const { fetchAllRequests, requests, updateRequestStatus } = useRequestStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list, detail
  const [userRole, setUserRole] = useState(""); // "admin" or "staff"
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        const response = await fetchAllRequests({ limit: 10, offset: 0 });
        console.log("Requests data:", response.requests);
      } catch (error) {
        console.log("Error fetching requests:", error);
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetch();
    setUserRole(user?.role || "staff");
  }, []);

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_BASE_URL}/request/download-csv`,
        {
          responseType: "blob", // Important for file downloads
        }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from response headers or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "request.csv";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // You might want to show a user-friendly error message here
    }
  };

  const handleRefresh = async () => {
    const refetch = async () => {
      try {
        setRefreshing(true);
        const response = await fetchAllRequests({ limit: 10, offset: 0 });
        console.log("Requests data:", response.requests);
      } catch (error) {
        console.log("Error fetching requests:", error);
        toast.error("Failed to load requests");
      } finally {
        setRefreshing(false);
      }
    };
    refetch();
  };

  const handleOpenScanner = (request) => {
    setSelectedRequest(request);
    setShowScanner(true);
    setScannedData(null);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setScanning(false);
    setScannedData(null);
  };

  // Mock QR code scanning function
  const handleScan = () => {
    setScanning(true);

    // Simulate QR code scanning
    setTimeout(() => {
      const mockScannedData = {
        equipment_id:
          selectedRequest.equipment?.[0]?.equipment_id || "eq-12345",
        equipment_name:
          selectedRequest.equipment?.[0]?.equipment_name || "Unknown Equipment",
        equipment_category:
          selectedRequest.equipment?.[0]?.category_name || "General Equipment",
        qr_code: `EQ-${Date.now()}`,
        status: "available",
        quantity: selectedRequest.equipment?.[0]?.requested_quantity || 1,
      };

      setScannedData(mockScannedData);
      setScanning(false);
      toast.success("Equipment scanned successfully!");
    }, 2000);
  };

  const handleCompleteCheckout = () => {
    if (!scannedData) {
      toast.error("Please scan equipment first");
      return;
    }

    // Mock transaction creation
    const transactionData = {
      request_id: selectedRequest.request_id,
      equipment_id: scannedData.equipment_id,
      equipment_name: scannedData.equipment_name,
      quantity: scannedData.quantity,
      type: "outgoing",
      scanned_by: user.user_id,
      scanned_by_name: user.name || "Admin User",
      notes: `Equipment checked out for request ${selectedRequest.request_id}`,
    };

    // In real app, you would call your API here to create a transaction
    console.log("Creating checkout transaction:", transactionData);

    toast.success("Equipment checked out successfully!");
    handleCloseScanner();

    // Refresh the requests list
    handleRefresh();
  };

  const filteredRequests =
    requests?.filter((request) => {
      if (!request) return false;

      const matchesSearch =
        request.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.request_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user_department
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (request.equipment &&
          request.equipment.some((item) =>
            item.equipment_name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          ));

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      // Staff can only see their own requests
      if (userRole === "staff") {
        return (
          matchesSearch && matchesStatus && request.user_id === user?.user_id
        );
      }

      return matchesSearch && matchesStatus;
    }) || [];

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedRequest(null);
  };

  const handleApprove = async (requestId) => {
    try {
      setLoading(true);
      const payload = {
        request_id: requestId,
        status: "approved",
        admin_id: user.user_id,
      };

      const response = await updateRequestStatus(payload);

      if (response.success) {
        toast.success("Request approved successfully!");
        // Refresh the requests list
        await fetchAllRequests({ limit: 10, offset: 0 });
        setViewMode("list");
      } else {
        toast.error(response.message || "Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (requestId, reason) => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for declining");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        request_id: requestId,
        status: "denied",
        decline_reason: reason,
        admin_id: user.user_id,
      };

      const response = await updateRequestStatus(payload);

      if (response.success) {
        toast.success("Request declined successfully!");
        // Refresh the requests list
        await fetchAllRequests({ limit: 10, offset: 0 });
        setViewMode("list");
      } else {
        toast.error(response.message || "Failed to decline request");
      }
    } catch (error) {
      console.error("Error declining request:", error);
      toast.error("Failed to decline request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "denied":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "denied":
        return "bg-red-100 text-red-800 border border-red-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading && !requests) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#db002f] mx-auto" />
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        </div>
      </PageLayOut>
    );
  }

  if (viewMode === "detail" && selectedRequest) {
    return (
      <>
        {showScanner && selectedRequest && (
          <ScanRequestModal
            onClose={handleCloseScanner}
            selectedRequest={selectedRequest}
          />
        )}
        <RequestDetailView
          request={selectedRequest}
          userRole={userRole}
          onBack={handleBackToList}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onScanEquipment={handleOpenScanner}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          getStatusIcon={getStatusIcon}
          getStatusColor={getStatusColor}
          loading={loading}
        />
      </>
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
                  {userRole === "admin" || userRole === "super_admin"
                    ? "Equipment Requests"
                    : "My Requests"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {userRole === "admin" || userRole === "super_admin"
                    ? "Manage and review equipment requests from staff"
                    : "View your equipment request history and status"}
                </p>
              </div>

              <div className="flex items-center space-x-3">
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
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userRole === "admin" || userRole === "super_admin"
                      ? "bg-[#ffe6ea] text-[#db002f] border border-[#ffb8c4]"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {userRole === "admin" || userRole === "super_admin"
                    ? "Administrator"
                    : "Staff"}
                </span>
                <button
                  onClick={() => {
                    handleDownloadCSV();
                  }}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
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
                    placeholder="Search by request ID, user name, department, or equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Request ID
                    </th>
                    {userRole === "admin" ||
                      (userRole === "super_admin" && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Requester
                        </th>
                      ))}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.request_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {request.request_id?.slice(0, 8)}...
                        </div>
                      </td>
                      {userRole === "admin" ||
                        (userRole === "super_admin" && (
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-[#ffe6ea] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-[#db002f]" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.user_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {request.user_department}
                                </div>
                              </div>
                            </div>
                          </td>
                        ))}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {request.equipment && request.equipment.length > 0
                            ? request.equipment
                                .map((item) => item.equipment_name)
                                .join(", ")
                            : "No equipment"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.equipment?.length || 0} item
                          {(request.equipment?.length || 0) !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(request.start_date)} -{" "}
                          {formatDate(request.end_date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.total_days?.days || 0} day
                          {(request.total_days?.days || 0) !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status?.charAt(0).toUpperCase() +
                              request.status?.slice(1) || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(request.submitted_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="p-1 text-gray-400 hover:text-[#db002f] transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {userRole === "admin" ||
                            (userRole === "super_admin" &&
                              request.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApprove(request.request_id)
                                    }
                                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                    title="Approve Request"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleViewDetails(request)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Decline Request"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              ))}
                          {userRole === "admin" ||
                            (userRole === "super_admin" &&
                              request.status === "approved" && (
                                <button
                                  onClick={() => handleOpenScanner(request)}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="Scan Equipment"
                                >
                                  <Scan className="w-4 h-4" />
                                </button>
                              ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No requests found</p>
                <p className="text-gray-400 mt-2">
                  {userRole === "admin" || userRole === "super_admin"
                    ? "No equipment requests match your search criteria"
                    : "You haven't made any equipment requests yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && selectedRequest && (
        <ScanRequestModal
          onClose={handleCloseScanner}
          selectedRequest={selectedRequest}
        />
      )}
    </PageLayOut>
  );
};

// Request Detail View Component

export default ViewRequests;
