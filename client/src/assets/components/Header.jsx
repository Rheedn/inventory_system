import React, { useState } from "react";
import {
  Bell,
  Search,
  Menu,
  Settings,
  LogOut,
  User,
  Mail,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Header = ({ toggleSidebar, sidebarCollapsed, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logoutUser } = useAuthStore()

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("User logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };
  const getInitial = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U";
  const formatRole = (role) =>
    role
      ? role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "User";

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "overdue",
      title: "Overdue Equipment",
      message: "Drill Machine is 2 days overdue",
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      type: "request",
      title: "New Borrow Request",
      message: "Sarah wants to borrow Power Washer",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "maintenance",
      title: "Maintenance Due",
      message: "Generator requires routine maintenance",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "system",
      title: "System Update",
      message: "New features available in dashboard",
      time: "1 day ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "request":
        return <Mail className="w-4 h-4 text-red-500" />;
      case "maintenance":
        return <Settings className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu Toggle and Search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search equipment, borrowers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-64 lg:w-80"
            />
          </div>
        </div>

        {/* Right Section - Notifications and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <span className="text-sm text-red-600 hover:text-red-700 cursor-pointer">
                      Mark all as read
                    </span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
                        !notification.read
                          ? "border-red-500 bg-red-50"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium py-2">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {getInitial(user?.name)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatRole(user?.role)}
                  </p>
                </div>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Header;
