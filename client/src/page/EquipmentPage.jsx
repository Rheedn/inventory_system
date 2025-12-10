import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  PackagePlus,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Wrench,
  Package,
  QrCode,
  Loader,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import PageLayOut from "../layout/PageLayOut";
import { useNavigate } from "react-router-dom";
import { useEquipmentStore } from "../store/equipmentStore";
import { toast } from "react-toastify";
import WarningModal from "../assets/components/modal/WarningModal";
import axios from "axios";

const EquipmentPage = () => {
  const {
    equipment,
    fetchEquipment,
    refreshEquipment,
    totalEquipment,
    deleteEquipment,
  } = useEquipmentStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [deletingEquipment, setDeletingEquipment] = useState(null); // Track which equipment is being deleted
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    limit: 10,
    offset: 0,
  });

  const handleFetch = async (payload) => {
    setLoading(true);
    try {
      await fetchEquipment(true, payload);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch equipment");
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_BASE_URL}/equipment/download-equipment-csv`,
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
      let filename = "equipment.csv";

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

  // Fix: Check if equipment has pagination data
  const hasNext = totalEquipment
    ? payload.offset + payload.limit < totalEquipment
    : false;
  const hasPrev = payload.offset > 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshEquipment(true, payload);
      toast.success("Equipment refreshed successfully");
    } catch (error) {
      console.log(error.message || "Error refreshing");
      toast.error("Error refreshing equipment");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle delete equipment with spinner
  const handleDeleteEquipment = async (equipmentId) => {
    setDeletingEquipment(equipmentId);
    try {
      await deleteEquipment(equipmentId);
      // Refresh the equipment list after deletion
      await handleFetch(payload);
    } catch (error) {
      console.error("Delete error:", error);
      // toast.error("Failed to delete equipment");
    } finally {
      setDeletingEquipment(null);
      setShowDeleteModal(false);
      setEquipmentToDelete(null);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (equipmentId, equipmentName) => {
    setEquipmentToDelete({ id: equipmentId, name: equipmentName });
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setEquipmentToDelete(null);
  };

  // Fix: Handle cases where equipment might be an object with data property
  const equipmentData = equipment?.data || equipment || [];

  // Filter equipment based on search and filters
  const filteredEquipment = equipmentData.filter((item) => {
    if (!item) return false;

    const matchesSearch =
      item.equipment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.qr_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesCondition =
      conditionFilter === "all" || item.condition === conditionFilter;

    return matchesSearch && matchesStatus && matchesCondition;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "out":
        return <Package className="w-4 h-4 text-orange-500" />;
      case "maintenance":
        return <Wrench className="w-4 h-4 text-red-500" />;
      case "damaged":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "out":
        return "bg-orange-100 text-orange-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      case "damaged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-yellow-100 text-yellow-800";
      case "damaged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const handleSelectEquipment = (equipmentId) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipmentId)
        ? prev.filter((id) => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEquipment.length === filteredEquipment.length) {
      setSelectedEquipment([]);
    } else {
      setSelectedEquipment(filteredEquipment.map((item) => item.equipment_id));
    }
  };

  const getQuantityColor = (quantity) => {
    if (quantity === 0) return "text-red-600 bg-red-50";
    if (quantity <= 2) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  if (loading) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#db002f] mx-auto" />
            <p className="mt-4 text-gray-600">Loading equipment...</p>
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
                  Equipment Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage all inventory items and equipment
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
                  onClick={() => navigate("/equipment/add-equipment")}
                  className="bg-[#db002f] text-white px-4 py-2 rounded-lg hover:bg-[#b50025] transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#db002f] cursor-pointer focus:ring-offset-2"
                >
                  <PackagePlus className="w-5 h-5" />
                  <span>Add Equipment</span>
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
                    Total Items
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {equipmentData.length}
                  </p>
                </div>
                <div className="p-3 bg-[#ffe6ea] rounded-lg">
                  <Package className="w-6 h-6 text-[#db002f]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {
                      equipmentData.filter(
                        (item) => item.status === "available"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    In Maintenance
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {
                      equipmentData.filter(
                        (item) => item.status === "maintenance"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Low Stock (≤2)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {equipmentData.filter((item) => item.quantity <= 2).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-orange-600" />
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
                    placeholder="Search by name, description, QR code, or category..."
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
                  <option value="available">Available</option>
                  <option value="out">Out</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="damaged">Damaged</option>
                </select>

                {/* Condition Filter */}
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  <option value="all">All Conditions</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                onClick={()=>{
                  handleDownloadCSV()
                }}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#db002f]">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#db002f]">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Equipment Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedEquipment.length ===
                            filteredEquipment.length &&
                          filteredEquipment.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-[#db002f] focus:ring-[#db002f]"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      QR Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipment.map((item) => (
                    <tr
                      key={item.equipment_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEquipment.includes(
                            item.equipment_id
                          )}
                          onChange={() =>
                            handleSelectEquipment(item.equipment_id)
                          }
                          className="rounded border-gray-300 text-[#db002f] focus:ring-[#db002f]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.equipment_name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description || "No description"}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              ID:{" "}
                              {item.equipment_id
                                ? item.equipment_id.slice(0, 8) + "..."
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-mono text-gray-900">
                            {item.qr_code || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuantityColor(
                            item.quantity || 0
                          )}`}
                        >
                          {item.quantity || 0} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item.category_name || "Uncategorized"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(
                            item.condition
                          )}`}
                        >
                          {item.condition
                            ? item.condition.charAt(0).toUpperCase() +
                              item.condition.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`${item.equipment_id}`)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              openDeleteModal(
                                item.equipment_id,
                                item.equipment_name
                              )
                            }
                            disabled={deletingEquipment === item.equipment_id}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingEquipment === item.equipment_id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredEquipment.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Package className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No equipment found</p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredEquipment.length} of {totalEquipment} items
                  {selectedEquipment.length > 0 && (
                    <span className="ml-2 text-[#db002f]">
                      • {selectedEquipment.length} selected
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

      {/* Delete Confirmation Modal */}
      <WarningModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteEquipment(equipmentToDelete?.id)}
        title="Delete Equipment"
        message={`Are you sure you want to delete "${equipmentToDelete?.name}"? This action cannot be undone.`}
        confirmText={deletingEquipment ? "Deleting..." : "Delete Equipment"}
        type="danger"
      />
    </PageLayOut>
  );
};

export default EquipmentPage;
