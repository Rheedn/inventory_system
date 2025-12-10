import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Building,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  BarChart3,
  Activity,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayOut from "../layout/PageLayOut";
import { useAuthStore } from "../store/authStore";
import WarningModal from "../assets/components/modal/WarningModal";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAllUser, updateUserRole, deleteUser, getUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const result = await getUser(id);
        if (result?.success) {
          setUserData(result.user);
          console.log(userData);
        } else {
          console.warn(result?.message || "Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadUser();
  }, [id]);

  const handleRoleUpdate = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    const payload = {
      user_id: id,
      role: selectedRole,
    };
    setUpdating(true);
    try {
      const response = await updateUserRole(payload);
      // toast.success("User role updated successfully");
      if (response.success) {
        setUserData(response.user);
        setShowRoleModal(false);
      }
      // Refresh user data
      await fetchAllUser();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const delete_USer = async () => {
    setDeleting(true);
    try {
      const payload={
        user_id:id,

      }
      const response = await deleteUser(payload);
      if (!response.success) {
        return;
      }
      // toast.success("User deleted successfully");
      navigate("/staffs");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "suspended":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "banned":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 w-max text-green-800 border-green-200";
      case "suspended":
        return "bg-orange-100 w-max text-orange-800 border-orange-200";
      case "banned":
        return "bg-red-100 w-max text-red-800 border-red-200";
      default:
        return "bg-gray-100 w-max text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
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

  const availableRoles = [
    { value: null, label: "Select a role" },
    { value: "staff", label: "Staff" },
    { value: "admin", label: "Admin" },
    { value: "super_admin", label: "Super Admin" },
  ];

  if (loading) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#db002f] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user details...</p>
          </div>
        </div>
      </PageLayOut>
    );
  }

  if (!userData) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">
              User Not Found
            </h2>
            <p className="text-gray-600 mt-2">
              The user you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/staffs")}
              className="mt-4 bg-[#db002f] text-white px-4 py-2 rounded-lg hover:bg-[#b50025] transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </PageLayOut>
    );
  }

  return (
    <PageLayOut>
      {showDeleteModal && (
        <WarningModal
          loading={deleting}
          title="Delete User"
          type="danger"
          isOpen={showDeleteModal}
          onConfirm={() => delete_USer()}
          onClose={() => {
            setShowDeleteModal((prev) => !prev);
          }}
        />
      )}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/staffs")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Users</span>
            </button>

            <div className="flex flex-col gap-2 md:flex-row justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-[#ffe6ea] rounded-xl">
                  <User className="w-8 h-8 text-[#db002f]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userData.name}
                  </h1>
                  <p className="text-gray-600 mt-2">{userData.email}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(
                        userData.status
                      )}`}
                    >
                      {getStatusIcon(userData.status)}
                      <span className="text-sm font-medium capitalize">
                        {userData.status}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getRoleColor(
                        userData.role
                      )}`}
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">
                        {userData.role?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex  md:flex-row items-center space-x-3">
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  <span>Change Role</span>
                </button>
                <button
                  onClick={() => navigate(`/staffs/edit/${id}`)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {userData.user_id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {userData.email}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {userData.phone_number || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {userData.department || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Account Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Role
                    </label>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                          userData.role
                        )}`}
                      >
                        {userData.role?.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(
                        userData.status
                      )}`}
                    >
                      {getStatusIcon(userData.status)}
                      <span className="text-sm font-medium capitalize">
                        {userData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Activity Stats Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Activity Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(userData.created_at).split(",")[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Active</span>
                    <span className="text-sm font-medium text-gray-900">
                      {userData.last_active
                        ? formatDate(userData.last_active)
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-full mt-0.5">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Account Created
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(userData.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Last Updated
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(userData.updated_at)}
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
                    onClick={() => setShowRoleModal(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Change Role</span>
                  </button>
                  <button
                    onClick={() => navigate(`/staffs/edit/${id}`)}
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit User</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Change User Role
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  {availableRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleUpdate}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-[#db002f] text-white rounded-lg hover:bg-[#b50025] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {updating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  <span>{updating ? "Updating..." : "Update Role"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayOut>
  );
};

export default UserDetailsPage;
