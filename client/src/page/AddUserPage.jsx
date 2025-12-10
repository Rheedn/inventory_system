import React, { useState } from "react";
import {
  UserPlus,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayOut from "../layout/PageLayOut";
import { useAuthStore } from "../store/authStore";

const AddUserPage = () => {
  const { user, registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    admin_id: user.user_id,
    name: "",
    email: "",
    phone_number: "",
    password: "",
    department: "",
    role: "staff",
    status: "active",
  });

  const departments = [
    "Engineering",
    "Marketing",
    "Operations",
    "HR",
    "Finance",
    "Sales",
    "IT",
    "Customer Support",
    "Research & Development",
    "Quality Assurance",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await registerUser(formData);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        department: "",
        role: "staff",
        status: "active",
      });
      navigate("/staffs");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.password.length >= 6 &&
      formData.department.trim() &&
      formData.phone_number.trim()
    );
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <PageLayOut>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/staffs")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:ring-offset-2 rounded-lg p-1"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Users</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#ffe6ea] rounded-lg">
                <UserPlus className="w-8 h-8 text-[#db002f]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Add New User
                </h1>
                <p className="text-gray-600 mt-2">
                  Create a new user account for the system
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter full name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter email address"
                      required
                      disabled={isSubmitting}
                    />
                    {formData.email && !isValidEmail(formData.email) && (
                      <p className="text-red-500 text-xs mt-1">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter phone number"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Department *
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Account Settings Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all pr-12 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Enter password"
                        required
                        minLength={6}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        disabled={isSubmitting}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#db002f] rounded"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Must be at least 6 characters long
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Validation Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Form Validation
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {formData.name.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Full name is required
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.email.trim() && isValidEmail(formData.email) ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Valid email address is required
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.password.length >= 6 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Password must be at least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.department.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Department is required
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.phone_number.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Phone number is required
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/staffs")}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !isFormValid() ||
                    isSubmitting ||
                    !isValidEmail(formData.email)
                  }
                  className="px-6 py-3 bg-[#db002f] text-white rounded-lg hover:bg-[#b50025] focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Creating User...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Tips */}
          <div className="mt-6 bg-[#ffe6ea] border border-[#ffbaba] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#a30024] mb-2">
              Quick Tips
            </h3>
            <ul className="text-[#a30024] space-y-1 text-sm">
              <li>• All fields marked with * are required</li>
              <li>
                • Users will receive an email notification when their account is
                created
              </li>
              <li>
                • Choose the appropriate role based on the user's
                responsibilities
              </li>
              <li>
                • Set status to "Suspended" for temporary access restrictions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayOut>
  );
};

export default AddUserPage;