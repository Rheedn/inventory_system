import React, { useState } from "react";
import {
  Home,
  Package,
  Users,
  RefreshCw,
  FileText,
  BarChart3,
  UserCog,
  Settings,
  Shield,
  Download,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PackagePlus,
  ChevronDown,
  ShoppingBasket,
  PackageCheck,
  Logs,
  History,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../store/authStore";

const Sidebar = ({ isCollapsed, onToggle, user }) => {
  const [openSections, setOpenSections] = useState({
    requests: false,
  });
  const { logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatRole = (role) =>
    role
      ? role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "User";

  const baseSections = [
    { icon: Home, title: "Dashboard", route: "/dashboard" },
  ];

  const getRequestsSection = () => {
    if (user?.role === "staff") {
      return {
        icon: FileText,
        title: "Requests",
        route: "/requests",
        hasSubmenu: true,
        subRoutes: [
          {
            icon: PackagePlus,
            title: "Request Equipment",
            route: "/requests/request-equipment",
          },
          {
            icon: Package,
            title: "View Requests",
            route: "/requests/view",
          },
        ],
      };
    } else {
      return {
        icon: FileText,
        title: "Requests",
        route: "/requests/view",
        hasSubmenu: false,
      };
    }
  };

  const adminSections = [
    { icon: Package, title: "Equipment", route: "/equipment" },
    { icon: UserCog, title: "Staff Management", route: "/staffs" },
    { icon: ShoppingBasket, title: " Category", route: "/categories" },
    { icon: History, title: "Transaction", route: "/transaction" },
    { icon: PackageCheck, title: " Return", route: "/return" },
    { icon: Logs, title: "System Logs", route: "/logs" },
    { icon: Shield, title: "Access Control", route: "/roles" },
  ];

  const mainSections = [
    ...baseSections,
    getRequestsSection(),
    ...(user?.role !== "staff" ? adminSections : []),
  ];

  const utilitySections = [
    { icon: Download, title: "Backup / Restore", route: "/backup" },
  ];

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

  const SidebarItem = ({ icon: Icon, title, route, onClick }) => (
    <div
      onClick={onClick}
      className={`
        flex items-center rounded-lg transition-all duration-200 cursor-pointer
        ${
          route
            ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            : "text-gray-700 hover:bg-red-50 hover:text-red-700"
        }
        ${isCollapsed ? "justify-center px-2 py-3" : "space-x-3 py-3 px-3"}
      `}
      title={isCollapsed ? title : undefined}
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{title}</div>
        </div>
      )}
    </div>
  );

  const NavSidebarItem = ({ icon: Icon, title, route }) => (
    <NavLink
      to={route}
      className={({ isActive }) => `
        flex items-center rounded-lg transition-all duration-200 cursor-pointer
        ${
          isActive
            ? "bg-red-50 text-red-700 border-r-2 border-red-600"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }
        ${isCollapsed ? "justify-center px-2 py-3" : "space-x-3 py-3 px-3"}
      `}
      title={isCollapsed ? title : undefined}
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{title}</div>
        </div>
      )}
    </NavLink>
  );

  const SectionDivider = ({ title }) =>
    !isCollapsed && (
      <div className="px-3 py-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </div>
      </div>
    );

  const CollapsibleSection = ({ item }) => {
    const isOpen = openSections.requests;
    const Icon = item.icon;

    if (isCollapsed) {
      return (
        <div className="mb-1">
          <button
            onClick={() => toggleSection("requests")}
            className="w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            title={item.title}
          >
            <Icon size={20} className="flex-shrink-0" />
          </button>
        </div>
      );
    }

    return (
      <div className="mb-1">
        <button
          onClick={() => toggleSection("requests")}
          className={`
            w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
            text-gray-700 hover:bg-gray-100 hover:text-gray-900
          `}
        >
          <div className="flex items-center space-x-3">
            <Icon size={20} className="flex-shrink-0" />
            <span className="font-medium text-sm">{item.title}</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l border-gray-200">
            {item.subRoutes.map((subItem, index) => {
              const SubIcon = subItem.icon;
              return (
                <NavLink
                  key={index}
                  to={subItem.route}
                  className={({ isActive }) => `
                    flex items-center py-2 pl-3 pr-3 rounded-lg transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "bg-red-50 text-red-700 border-r-2 border-red-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                    space-x-3
                  `}
                >
                  <SubIcon size={16} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{subItem.title}</div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
      flex flex-col bg-white border-r border-gray-200 transition-all duration-300
      ${isCollapsed ? "w-16" : "w-64"}
      h-screen sticky top-0
    `}
    >
      {/* Header */}
      <div
        className={`
        flex items-center border-b border-gray-200 p-4
        ${isCollapsed ? "justify-center" : "justify-between"}
      `}
      >
        {!isCollapsed && (
          <NavLink
            to="/dashboard"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800">EquipShare</span>
          </NavLink>
        )}

        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Sections */}
        <div className="space-y-1 px-2">
          {mainSections.map((item, index) => {
            if (item.hasSubmenu) {
              return <CollapsibleSection key={index} item={item} />;
            }
            return (
              <NavSidebarItem
                key={index}
                icon={item.icon}
                title={item.title}
                route={item.route}
              />
            );
          })}
        </div>

        {/* Utility Section Divider */}
        <SectionDivider title="Utility" />

        {/* Utility Sections */}
        <div className="space-y-1 px-2 mt-2">
          {utilitySections.map((item, index) => (
            <NavSidebarItem
              key={index}
              icon={item.icon}
              title={item.title}
              route={item.route}
            />
          ))}

          {/* Logout Button */}
          <SidebarItem icon={LogOut} title="Logout" onClick={handleLogout} />
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserCog size={16} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {formatRole(user?.role)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
