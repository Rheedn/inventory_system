import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Calendar,
  User,
  Tag,
  Wrench,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  QrCode,
  Download,
  Printer,
  Clock,
  BarChart3,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayOut from "../layout/PageLayOut";
import { useEquipmentStore } from "../store/equipmentStore";
import PrintQRCodeModal from "../assets/components/modal/PrintQRCodeModal";

const EquipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equipment, fetchEquipment, deleteEquipment } = useEquipmentStore();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [equipmentData, setEquipmentData] = useState(null);

  useEffect(() => {
    const loadEquipment = async () => {
      setLoading(true);
      try {
        // Fetch single equipment or filter from existing equipment
        await fetchEquipment();
        const foundEquipment = equipment.find(
          (item) => item.equipment_id === id
        );
        if (foundEquipment) {
          setEquipmentData(foundEquipment);
        } else {
          toast.error("Equipment not found");
          navigate("/equipment");
        }
      } catch (error) {
        console.error("Error loading equipment:", error);
        toast.error("Failed to load equipment details");
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [id, fetchEquipment, equipment, navigate]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this equipment? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deleteEquipment(id);
      toast.success("Equipment deleted successfully");
      navigate("/equipment");
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Failed to delete equipment");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "out":
        return <Package className="w-5 h-5 text-orange-500" />;
      case "maintenance":
        return <Wrench className="w-5 h-5 text-red-500" />;
      case "damaged":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "out":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "maintenance":
        return "bg-red-100 text-red-800 border-red-200";
      case "damaged":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#db002f] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading equipment details...</p>
          </div>
        </div>
      </PageLayOut>
    );
  }

  if (!equipmentData) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">
              Equipment Not Found
            </h2>
            <p className="text-gray-600 mt-2">
              The equipment you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/equipment")}
              className="mt-4 bg-[#db002f] text-white px-4 py-2 rounded-lg hover:bg-[#b50025] transition-colors"
            >
              Back to Equipment
            </button>
          </div>
        </div>
      </PageLayOut>
    );
  }

  return (
    <PageLayOut>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/equipment")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Equipment</span>
            </button>

            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-[#ffe6ea] rounded-xl">
                  <Package className="w-8 h-8 text-[#db002f]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {equipmentData.equipment_name}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {equipmentData.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(
                        equipmentData.status
                      )}`}
                    >
                      {getStatusIcon(equipmentData.status)}
                      <span className="text-sm font-medium capitalize">
                        {equipmentData.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        Last updated: {formatDate(equipmentData.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center space-x-2 bg-[#ffe6ea] text-[#db002f] px-4 py-2 rounded-lg hover:bg-[#ffbaba] transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Print QR</span>
                </button>
                <button
                  onClick={() => navigate(`/equipment/edit/${id}`)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  <span>{deleting ? "Deleting..." : "Delete"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {equipmentData.equipment_id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Code
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {equipmentData.qr_code}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {equipmentData.category_name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {equipmentData.quantity} units
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(
                        equipmentData.condition
                      )}`}
                    >
                      {equipmentData.condition?.charAt(0).toUpperCase() +
                        equipmentData.condition?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {equipmentData.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Equipment Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Current Status
                    </span>
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(
                        equipmentData.status
                      )}`}
                    >
                      {getStatusIcon(equipmentData.status)}
                      <span className="text-sm font-medium capitalize">
                        {equipmentData.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Availability</span>
                    <span
                      className={`text-sm font-medium ${
                        equipmentData.status === "available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {equipmentData.status === "available"
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-full mt-0.5">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Created
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(equipmentData.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Last Updated
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(equipmentData.updated_at)}
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
                    onClick={() => setShowQRModal(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-[#ffe6ea] text-[#db002f] px-4 py-2 rounded-lg hover:bg-[#ffbaba] transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Print QR Code</span>
                  </button>
                  <button
                    onClick={() => navigate(`/equipment/edit/${id}`)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Equipment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <PrintQRCodeModal
          isOpen={showQRModal}
          value={equipmentData.equipment_id}
          onClose={() => setShowQRModal(false)}
          equipmentId={equipmentData.equipment_id}
          equipmentName={equipmentData.equipment_name}
        />
      )}
    </PageLayOut>
  );
};

export default EquipmentDetailsPage;
