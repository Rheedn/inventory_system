import React, { useState } from "react";
import {
  Home,
  Package,
  ClipboardList,
  Wrench,
  Building,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const EquipmentDepartmentNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({
    equipment: true,
    requests: true,
    maintenance: true,
    departments: true,
    reports: true,
    admin: true
  });

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const mainSections = [
    {
      icon: Home,
      title: "Dashboard",
      route: "/dashboard",
      description: "Overview of all requests, stock, and active departments"
    }
  ];

  const equipmentSections = [
    { icon: Package, title: "View All Equipment", route: "/equipment" },
    { icon: Package, title: "Add New Equipment", route: "/equipment/add" },
    { icon: Settings, title: "Update / Remove Equipment", route: "/equipment/manage" },
    { icon: BarChart3, title: "Track Availability", route: "/equipment/availability" }
  ];

  const requestSections = [
    { icon: ClipboardList, title: "Pending Requests", route: "/requests/pending" },
    { icon: ClipboardList, title: "Approved Requests", route: "/requests/approved" },
    { icon: Package, title: "Returned Equipment", route: "/requests/returned" }
  ];

  const maintenanceSections = [
    { icon: Wrench, title: "Items under maintenance", route: "/maintenance/active" },
    { icon: Wrench, title: "Schedule repairs", route: "/maintenance/schedule" }
  ];

  const departmentSections = [
    { icon: Building, title: "View Department List", route: "/departments" },
    { icon: Building, title: "Track department equipment history", route: "/departments/history" }
  ];

  const reportSections = [
    { icon: BarChart3, title: "Inventory report", route: "/reports/inventory" },
    { icon: BarChart3, title: "Request summary", route: "/reports/requests" },
    { icon: BarChart3, title: "Low-stock alerts", route: "/reports/alerts" }
  ];

  const adminSections = [
    { icon: Users, title: "Manage system users", route: "/admin/users" },
    { icon: Settings, title: "Configure department permissions", route: "/admin/permissions" }
  ];

  const utilitySections = [
    { icon: LogOut, title: "Logout", route: "/logout" }
  ];

  const SidebarItem = ({ icon: Icon, title, description, isActive = false }) => (
    <div
      className={`
        flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer
        ${isActive
          ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }
        ${isCollapsed ? "justify-center px-2" : "space-x-3"}
      `}
      title={isCollapsed ? `${title}${description ? ` - ${description}` : ''}` : undefined}
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{title}</div>
          {description && (
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          )}
        </div>
      )}
    </div>
  );

  const CollapsibleSection = ({ title, icon: Icon, items, isOpen, onToggle }) => (
    <div className="mb-1">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center p-3 rounded-lg transition-all duration-200
          text-gray-700 hover:bg-gray-100 hover:text-gray-900
          ${isCollapsed ? "justify-center" : "justify-between"}
        `}
        title={isCollapsed ? title : undefined}
      >
        <div className="flex items-center space-x-3">
          <Icon size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-medium text-sm">{title}</span>
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
          {items.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              isActive={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );

  const SectionDivider = ({ title }) => (
    !isCollapsed && (
      <div className="px-3 py-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </div>
      </div>
    )
  );

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
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800">EquipShare</span>
          </div>
        )}

        <button
          onClick={toggleSidebar}
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
          {mainSections.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              isActive={index === 0}
            />
          ))}
        </div>

        {/* Equipment Management */}
        <div className="px-2">
          <CollapsibleSection
            title="Equipment Management"
            icon={Package}
            items={equipmentSections}
            isOpen={openSections.equipment}
            onToggle={() => toggleSection('equipment')}
          />
        </div>

        {/* Requests */}
        <div className="px-2">
          <CollapsibleSection
            title="Requests"
            icon={ClipboardList}
            items={requestSections}
            isOpen={openSections.requests}
            onToggle={() => toggleSection('requests')}
          />
        </div>

        {/* Maintenance Logs */}
        <div className="px-2">
          <CollapsibleSection
            title="Maintenance Logs"
            icon={Wrench}
            items={maintenanceSections}
            isOpen={openSections.maintenance}
            onToggle={() => toggleSection('maintenance')}
          />
        </div>

        {/* Departments */}
        <div className="px-2">
          <CollapsibleSection
            title="Departments"
            icon={Building}
            items={departmentSections}
            isOpen={openSections.departments}
            onToggle={() => toggleSection('departments')}
          />
        </div>

        {/* Reports */}
        <div className="px-2">
          <CollapsibleSection
            title="Reports"
            icon={BarChart3}
            items={reportSections}
            isOpen={openSections.reports}
            onToggle={() => toggleSection('reports')}
          />
        </div>

        {/* Admin Section Divider */}
        <SectionDivider title="Admin Section" />

        {/* Admin Sections */}
        <div className="px-2">
          <CollapsibleSection
            title="Settings"
            icon={Settings}
            items={adminSections}
            isOpen={openSections.admin}
            onToggle={() => toggleSection('admin')}
          />
        </div>

        {/* Utility Section Divider */}
        <SectionDivider title="Utility" />

        {/* Utility Sections */}
        <div className="space-y-1 px-2 mt-2">
          {utilitySections.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              title={item.title}
            />
          ))}
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users size={16} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">Equipment Manager</div>
              <div className="text-xs text-gray-500 truncate">Administrator</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDepartmentNavbar;