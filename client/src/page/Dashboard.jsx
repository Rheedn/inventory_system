import React, { useEffect } from "react";
import {
  Package,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Calendar,
  Download,
  Search,
  Filter,
} from "lucide-react";
import PageLayout from "../layout/PageLayOut";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useStatStore } from "../store/statStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats: fetchedStat, fetchStat } = useStatStore();

  useEffect(() => {
    const handleStatFetch = async () => {
      const result = await fetchStat(user.user_id);
    };
    handleStatFetch();
  }, []);
  console.log(fetchedStat)
  // Stats data based on the specification
  const stats = [
    {
      title: "Total Equipment",
      value: fetchedStat.total_equipment || "240",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "red",
      description: "Total registered equipment",
    },
    {
      title: "Borrowed Equipment",
      value: "56",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "red",
      description: "Currently borrowed items",
    },
    {
      title: "Pending Requests",
      value: fetchedStat?.pending_requests ,
      change: "+2%",
      trend: "up",
      icon: Clock,
      color: "red",
      description: "Items past return date",
    },
    {
      title: "Active Borrowers",
      value: "31",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "red",
      description: "Users with active borrow records",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Smith",
      equipment: "Drill Machine",
      action: "borrowed",
      time: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      equipment: "Power Washer",
      action: "returned",
      time: "4 hours ago",
      status: "completed",
    },
    {
      id: 3,
      user: "Mike Chen",
      equipment: "Ladder",
      action: "requested",
      time: "6 hours ago",
      status: "pending",
    },
    {
      id: 4,
      user: "Emily Davis",
      equipment: "Tool Kit",
      action: "overdue",
      time: "1 day ago",
      status: "overdue",
    },
    {
      id: 5,
      user: "Robert Wilson",
      equipment: "Generator",
      action: "borrowed",
      time: "1 day ago",
      status: "active",
    },
  ];

  const popularEquipment = [
    { name: "Drill Machine", borrows: 45, availability: "Available" },
    { name: "Power Washer", borrows: 38, availability: "Borrowed" },
    { name: "Tool Kit", borrows: 32, availability: "Available" },
    { name: "Ladder", borrows: 28, availability: "Available" },
    { name: "Generator", borrows: 25, availability: "Borrowed" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "borrowed":
        return "text-red-600";
      case "returned":
        return "text-green-600";
      case "requested":
        return "text-orange-600";
      case "overdue":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      red: { bg: "bg-red-100", text: "text-red-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
      green: { bg: "bg-green-100", text: "text-green-600" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
    };
    return colorMap[color] || colorMap.red;
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of equipment, borrowers, and system status
            </p>
          </div>

          {/* Stats Grid - 6 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = getColorClasses(stat.color);
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <div
                        className={`flex items-center mt-1 ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                      

                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                      <Icon className={`w-5 h-5 ${colorClasses.text}`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h2>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(activity.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.user}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className={getActionColor(activity.action)}>
                              {activity.action}
                            </span>{" "}
                            {activity.equipment}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {activity.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Equipment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Most Popular Equipment
                  </h2>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {popularEquipment.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.borrows} borrows this month
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.availability === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {item.availability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & System Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Quick Actions */}
            {user.role == "super_admin" ||
              (user.role == "admin" && (
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/equipment/add-equipment")}
                      className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <Package className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-900">
                        Add New Equipment
                      </span>
                    </button>
                    <button
                      onClick={() => navigate("/staffs")}
                      className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <Users className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-900">
                        Manage Staffs
                      </span>
                    </button>
                    <button
                      onClick={() => navigate("/return")}
                      className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <Clock className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-900">
                        Process Returns
                      </span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                      <Download className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-900">
                        Generate Report
                      </span>
                    </button>
                  </div>
                </div>
              ))}

            {/* System Overview */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                System Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">94%</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Equipment Utilization
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600 mt-1">
                    On-time Returns
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Active Borrowings
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Maintenance Due
                  </div>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Recent Notifications
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      2 equipment items due for maintenance this week
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Calendar className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-800">
                      5 new borrower registrations today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
