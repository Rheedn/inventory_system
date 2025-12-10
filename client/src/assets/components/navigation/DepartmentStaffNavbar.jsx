import React, { useState } from "react";
import {
  Home,
  Package,
  ClipboardList,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User
} from "lucide-react";

const DepartmentStaffNavbar = ({ isCollapsed, onToggle, user, onLogout }) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [openSections, setOpenSections] = useState({
    request: true,
    myRequests: true,
    borrowed: true,
    notifications: true,
    support: true
  });

  const navSections = [
    {
      id: "main",
      title: "Main",
      items: [
        {
          id: "dashboard",
          icon: Home,
          title: "Dashboard",
          description: "Overview of their own requests and borrowed items"
        }
      ]
    },
    {
      id: "request",
      title: "Request Equipment",
      items: [
        { id: "new-request", icon: Package, title: "New Request Form" },
        { id: "available-equipment", icon: Package, title: "View Available Equipment" }
      ]
    },
    {
      id: "myRequests",
      title: "My Requests",
      items: [
        { id: "pending-requests", icon: ClipboardList, title: "Pending" },
        { id: "approved-requests", icon: ClipboardList, title: "Approved" },
        { id: "returned-requests", icon: ClipboardList, title: "Returned" }
      ]
    },
    {
      id: "borrowed",
      title: "My Borrowed Items",
      items: [
        { id: "current-borrowed", icon: FileText, title: "Current borrowed list" },
        { id: "due-dates", icon: FileText, title: "Due return dates" }
      ]
    },
    {
      id: "notifications",
      title: "Notifications",
      items: [
        { id: "status-updates", icon: Bell, title: "Request status updates" },
        { id: "return-reminders", icon: Bell, title: "Return reminders" }
      ]
    },
    {
      id: "support",
      title: "Help / Support",
      items: [
        { id: "contact-support", icon: HelpCircle, title: "Contact Equipment Department" }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const NavSection = ({ section }) => {
    const isOpen = openSections[section.id];
    const Icon = section.items[0]?.icon || Package;

    // For main section (no dropdown)
    if (section.id === "main") {
      return (
        <div className="mb-2">
          <div className="space-y-1">
            {section.items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`
                    w-full flex items-center p-3 rounded-lg transition-all duration-200
                    ${activeItem === item.id
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                    ${isCollapsed ? "justify-center px-2" : "space-x-3"}
                  `}
                  title={isCollapsed ? item.title : undefined}
                >
                  <ItemIcon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // For collapsible sections
    return (
      <div className="mb-1">
        {/* Section Header */}
        <button
          onClick={() => toggleSection(section.id)}
          className={`
            w-full flex items-center p-3 rounded-lg transition-all duration-200
            text-gray-700 hover:bg-gray-100 hover:text-gray-900
            ${isCollapsed ? "justify-center" : "justify-between"}
          `}
          title={isCollapsed ? section.title : undefined}
        >
          <div className="flex items-center space-x-3">
            <Icon size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium text-sm">{section.title}</span>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        {/* Section Items */}
        {!isCollapsed && isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l border-gray-200">
            {section.items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`
                    w-full flex items-center p-2 pl-3 rounded-lg transition-all duration-200
                    ${activeItem === item.id
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                    space-x-3
                  `}
                >
                  <ItemIcon size={16} className="flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      flex flex-col bg-white border-r border-gray-200 transition-all duration-300
      ${isCollapsed ? "w-16" : "w-64"}
      h-screen sticky top-0
    `}>
      {/* Header */}
      <div className={`
        flex items-center border-b border-gray-200 p-4
        ${isCollapsed ? "justify-center" : "justify-between"}
      `}>
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-800">Department Staff</span>
              <div className="text-xs text-gray-500">Requester View</div>
            </div>
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.name?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.department}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {navSections.map((section) => (
          <NavSection key={section.id} section={section} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors
            ${isCollapsed ? "justify-center" : "space-x-3"}
          `}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default DepartmentStaffNavbar;