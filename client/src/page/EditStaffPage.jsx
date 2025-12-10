import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayOut from "../layout/PageLayOut";
import { useAuthStore } from "../store/authStore";

const EditStaffPage = () => {
  const { staff_id } = useParams();
  const navigate = useNavigate();
  const { user, getUser, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "staff",
    status: "active",
    department: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const result = await getUser(staff_id);
        if (result?.success) {
          setUserData(result.user);
          const initialData = {
            name: result.user.name || "",
            email: result.user.email || "",
            phone_number: result.user.phone_number || "",
            role: result.user.role || "staff",
            status: result.user.status || "active",
            department: result.user.department || "",
          };
          setFormData(initialData);
          setOriginalData(initialData);
        } else {
          console.warn(result?.message || "Failed to fetch user");
          toast.error("Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Error loading user data");
      } finally {
        setLoading(false);
      }
    };
    if (staff_id) {
      loadUser();
    } else {
      toast.info("staff id is not provided");
    }
  }, [staff_id]);

  // Check if form has changes
  const hasChanges = () => {
    if (!originalData) return false;

    return Object.keys(formData).some(key => {
      const currentValue = formData[key];
      const originalValue = originalData[key];

      // Handle phone_number specifically since it can be null
      if (key === 'phone_number') {
        const currentPhone = currentValue?.trim() || null;
        const originalPhone = originalValue?.trim() || null;
        return currentPhone !== originalPhone;
      }

      return currentValue !== originalValue;
    });
  };

  // Get only changed fields
  const getChangedFields = () => {
    if (!originalData) return {};

    const changedFields = {};

    Object.keys(formData).forEach(key => {
      const currentValue = formData[key];
      const originalValue = originalData[key];

      if (key === 'phone_number') {
        const currentPhone = currentValue?.trim() || null;
        const originalPhone = originalValue?.trim() || null;
        if (currentPhone !== originalPhone) {
          changedFields[key] = currentPhone;
        }
      } else if (currentValue !== originalValue) {
        changedFields[key] = currentValue;
      }
    });

    return changedFields;
  };

  const validateForm = () => {
    const newErrors = {};
    const changedFields = getChangedFields();

    // Only validate fields that are being changed
    if ('name' in changedFields && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if ('email' in changedFields) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    }

    if ('phone_number' in changedFields && formData.phone_number && !/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number is invalid";
    }

    if ('department' in changedFields && !formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any changes
    if (!hasChanges()) {
      toast.info("No changes detected");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setUpdating(true);
    try {
      const changedFields = getChangedFields();

      const payload = {
        admin_id: user.user_id,
        user_id: staff_id,
        ...changedFields
      };

      const response = await updateUser(payload);

      if (response.success) {
        toast.success("Staff member updated successfully");
        // Update original data to reflect new changes
        setOriginalData(formData);
        navigate(`/staffs/${staff_id}`);
      } else {
        toast.error(response.message || "Failed to update staff member");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update staff member");
    } finally {
      setUpdating(false);
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
        return "bg-green-100 text-green-800 border-green-200";
      case "suspended":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "banned":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  // Check if a field has been changed from its original value
  const isFieldChanged = (fieldName) => {
    if (!originalData) return false;

    if (fieldName === 'phone_number') {
      const currentPhone = formData.phone_number?.trim() || null;
      const originalPhone = originalData.phone_number?.trim() || null;
      return currentPhone !== originalPhone;
    }

    return formData[fieldName] !== originalData[fieldName];
  };

  if (loading) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#db002f] mx-auto" />
            <p className="mt-4 text-gray-600">Loading staff details...</p>
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
              Staff Member Not Found
            </h2>
            <p className="text-gray-600 mt-2">
              The staff member you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/staffs")}
              className="mt-4 bg-[#db002f] text-white px-4 py-2 rounded-lg hover:bg-[#b50025] transition-colors"
            >
              Back to Staff
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
              onClick={() => navigate(`/staffs/${staff_id}`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Staff Details</span>
            </button>

            <div className="flex items-start space-x-4">
              <div className="p-4 bg-[#ffe6ea] rounded-xl">
                <User className="w-8 h-8 text-[#db002f]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Staff Member
                </h1>
                <p className="text-gray-600 mt-2">
                  Update staff information and permissions
                </p>
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

                {/* Changes Indicator */}
                {hasChanges() && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-max">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>Unsaved changes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        } ${isFieldChanged('name') ? 'border-blue-300 bg-blue-50' : ''}`}
                        placeholder="Enter full name"
                      />
                      {isFieldChanged('name') && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        } ${isFieldChanged('email') ? 'border-blue-300 bg-blue-50' : ''}`}
                        placeholder="Enter email address"
                      />
                      {isFieldChanged('email') && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent ${
                          errors.phone_number
                            ? "border-red-300"
                            : "border-gray-300"
                        } ${isFieldChanged('phone_number') ? 'border-blue-300 bg-blue-50' : ''}`}
                        placeholder="Enter phone number"
                      />
                      {isFieldChanged('phone_number') && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {errors.phone_number && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone_number}
                        </p>
                      )}
                    </div>

                    {/* Department */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent ${
                          errors.department
                            ? "border-red-300"
                            : "border-gray-300"
                        } ${isFieldChanged('department') ? 'border-blue-300 bg-blue-50' : ''}`}
                        placeholder="Enter department"
                      />
                      {isFieldChanged('department') && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.department}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent ${
                          isFieldChanged('role') ? 'border-blue-300 bg-blue-50' : ''
                        }`}
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      {isFieldChanged('role') && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent ${
                          isFieldChanged('status') ? 'border-blue-300 bg-blue-50' : ''
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                      </select>
                      {isFieldChanged('status') && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => navigate(`/staffs/${staff_id}`)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating || !hasChanges()}
                    className="flex items-center space-x-2 bg-[#db002f] text-white px-6 py-2 rounded-lg hover:bg-[#b50025] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{updating ? "Updating..." : "Update Staff"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      User ID
                    </label>
                    <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                      {userData.user_id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Member Since
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(userData.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Last Updated
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(userData.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Role</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        userData.role
                      )}`}
                    >
                      {userData.role?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(userData.status)}
                      <span className="text-sm font-medium capitalize">
                        {userData.status}
                      </span>
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
                    onClick={() => navigate(`/staffs/${staff_id}`)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    View Staff Details
                  </button>
                  <button
                    onClick={() => navigate("/staffs")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Back to Staff List
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

export default EditStaffPage;