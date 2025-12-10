import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Filter,
  User,
  UserCheck,
  UserCog,
  RefreshCw,
  Edit,
  Save,
  X,
  AlertCircle,
  Loader2,
  UserStar,
} from "lucide-react";
import PageLayOut from "../layout/PageLayOut";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

const AccessControlPage = () => {
  const { fetchAllUser, users } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [saving, setSaving] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await fetchAllUser();
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = [
    {
      value: "staff",
      label: "Staff",
      icon: UserCheck,
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "admin",
      label: "Admin",
      icon: UserCog,
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "super_admin",
      label: "Super Admin",
      icon: UserStar,
      color: "bg-red-100 text-red-800",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    const roleConfig = availableRoles.find((r) => r.value === role);
    const IconComponent = roleConfig?.icon || User;
    return <IconComponent className="w-4 h-4" />;
  };

  const getRoleColor = (role) => {
    const roleConfig = availableRoles.find((r) => r.value === role);
    return roleConfig?.color || "bg-gray-100 text-gray-800";
  };

  const formatRole = (role) => {
    return role?.charAt(0).toUpperCase() + role?.slice(1);
  };

  const startEditing = (user) => {
    setEditingUser(user.user_id);
    setSelectedRole(user.role);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setSelectedRole("");
  };

  const updateUserRole = async (userId) => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === userId ? { ...user, role: selectedRole } : user
        )
      );

      toast.success(`Role updated successfully for user`);
      setEditingUser(null);
      setSelectedRole("");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-red-600" />
            <p className="mt-4 text-gray-600">Loading users...</p>
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
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#ffe6ea] rounded-lg">
                  <Shield className="w-8 h-8 text-[#db002f]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Access Control
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Manage user roles and permissions across the system
                  </p>
                </div>
              </div>
              <button
                onClick={fetchUsers}
                className="flex items-center space-x-2 bg-[#ffe6ea] text-[#db002f] px-4 py-2 rounded-lg hover:bg-[#ffbaba] transition-colors"
              >
                <RefreshCw size={20} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {availableRoles.map((role) => (
              <div
                key={role.value}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {role.label}s
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {users.filter((user) => user.role === role.value).length}
                    </p>
                  </div>
                  <div className={`p-3 ${role.color} rounded-lg bg-opacity-20`}>
                    {getRoleIcon(role.value)}
                  </div>
                </div>
              </div>
            ))}
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
                    placeholder="Search users by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  {availableRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {formatRole(user.role)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.last_active)}
                      </td>
                      <td className="px-6 py-4">
                        {editingUser === user.user_id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                              disabled={saving}
                            >
                              {availableRoles.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => updateUserRole(user.user_id)}
                              disabled={saving}
                              className="p-1 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={saving}
                              className="p-1 text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(user)}
                            className="p-1 text-gray-400 hover:text-[#db002f] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No users found</p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableRoles.map((role) => {
              const IconComponent = role.icon;
              return (
                <div
                  key={role.value}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 ${role.color} rounded-lg`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {role.label}
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    {role.value === "super_admin" && (
                      <>
                        <p>• Can view available equipment</p>
                        <p>• Can add new equipment</p>
                        <p>• Can view their request history</p>
                      </>
                    )}
                    {role.value === "staff" && (
                      <>
                        <p>• All User permissions</p>
                        <p>• Can manage equipment requests</p>
                        <p>• Can view all equipment</p>
                        <p>• Can generate basic reports</p>
                      </>
                    )}
                    {role.value === "admin" && (
                      <>
                        <p>• All Staff permissions</p>
                        <p>• Can manage users and roles</p>
                        <p>• Can manage all equipment</p>
                        <p>• Full system access</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayOut>
  );
};

export default AccessControlPage;
