import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Loader2,
  RefreshCcw,
  CreditCard,
  Building,
  Mail,
  Phone,
  QrCode,
  Scan,
} from "lucide-react";
import { toast } from "react-toastify";
import PageLayOut from "../layout/PageLayOut";
import { useTransactionStore } from "../store/transactionStore";


const TransactionsPage = () => {
  const { fetchTransactions, transactions } = useTransactionStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list, detail

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        await fetchTransactions({ limit: 50, offset: 0 });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTransactions({ limit: 50, offset: 0 });
      toast.success("Transactions refreshed successfully");
    } catch (error) {
      console.error("Error refreshing transactions:", error);
      toast.error("Failed to refresh transactions");
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedTransaction(null);
  };

  const filteredTransactions = transactions?.filter((transaction) => {
    if (!transaction) return false;

    const matchesSearch =
      transaction.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.equipment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.scanned_by_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  }) || [];

  const getTypeIcon = (type) => {
    switch (type) {
      case "outgoing":
        return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      case "returned":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "outgoing":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "returned":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "outgoing":
        return "Checked Out";
      case "returned":
        return "Returned";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Calculate statistics
  const totalTransactions = transactions?.length || 0;
  const outgoingCount = transactions?.filter(t => t.type === "outgoing").length || 0;
  const returnedCount = transactions?.filter(t => t.type === "returned").length || 0;
  const totalItems = transactions?.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0;

  if (loading && !transactions) {
    return (
      <PageLayOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#db002f] mx-auto" />
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </PageLayOut>
    );
  }

  if (viewMode === "detail" && selectedTransaction) {
    return (
      <TransactionDetailView
        transaction={selectedTransaction}
        onBack={handleBackToList}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
        getTypeIcon={getTypeIcon}
        getTypeColor={getTypeColor}
        getTypeText={getTypeText}
      />
    );
  }

  return (
    <PageLayOut>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Equipment Transactions
                </h1>
                <p className="text-gray-600 mt-2">
                  Track all equipment check-outs and returns
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 bg-[#ffe6ea] text-[#db002f] px-4 py-2 rounded-lg hover:bg-[#ffbaba] transition-colors disabled:opacity-50"
                >
                  <RefreshCcw
                    className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                </button>
                
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totalTransactions}
                  </p>
                </div>
                <div className="p-3 bg-[#ffe6ea] rounded-lg">
                  <CreditCard className="w-6 h-6 text-[#db002f]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Checked Out</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {outgoingCount}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ArrowUpRight className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Returned</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {returnedCount}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <ArrowDownLeft className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totalItems}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
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
                    placeholder="Search by transaction ID, user, equipment, or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="outgoing">Checked Out</option>
                  <option value="returned">Returned</option>
                </select>

                {/* Date Filter */}
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Scanned By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.transaction_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {transaction.transaction_id?.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#ffe6ea] rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-[#db002f]" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.user_name || "Unknown User"}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {transaction.user_id?.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {transaction.equipment_name || "Unknown Equipment"}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {transaction.equipment_id?.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {transaction.quantity || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(transaction.type)}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                              transaction.type
                            )}`}
                          >
                            {getTypeText(transaction.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {transaction.scanned_by_name || "System"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.scanned_by ? `ID: ${transaction.scanned_by.slice(0, 8)}...` : "Auto"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(transaction)}
                            className="p-1 text-gray-400 hover:text-[#db002f] transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No transactions found</p>
                <p className="text-gray-400 mt-2">
                  {searchTerm || typeFilter !== "all"
                    ? "No transactions match your search criteria"
                    : "No transactions have been recorded yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayOut>
  );
};

// Transaction Detail View Component
const TransactionDetailView = ({
  transaction,
  onBack,
  formatDate,
  formatDateTime,
  getTypeIcon,
  getTypeColor,
  getTypeText,
}) => {
  return (
    <PageLayOut>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowDownLeft className="w-5 h-5" />
              <span>Back to Transactions</span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Transaction Details
                </h1>
                <p className="text-gray-600 mt-2">
                  Transaction ID: {transaction.transaction_id}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(transaction.type)}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                      transaction.type
                    )}`}
                  >
                    {getTypeText(transaction.type)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Equipment Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Equipment Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#ffe6ea] rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#db002f]" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.equipment_name || "Unknown Equipment"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Equipment ID: {transaction.equipment_id}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        Quantity: {transaction.quantity}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.type === "outgoing" ? "Checked Out" : "Returned"}
                      </div>
                    </div>
                  </div>

                  {transaction.equipment_image && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Equipment Image
                      </label>
                      <img
                        src={transaction.equipment_image}
                        alt={transaction.equipment_name}
                        className="w-full max-w-sm h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Notes */}
              {transaction.notes && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Transaction Notes
                  </h2>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {transaction.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  User Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#ffe6ea] rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#db002f]" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.user_name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        User ID: {transaction.user_id?.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scanner Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Scan Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Scan className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.scanned_by_name || "System"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.scanned_by ? `ID: ${transaction.scanned_by.slice(0, 8)}...` : "Automated System"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Transaction Timeline
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Transaction Date</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDateTime(transaction.created_at)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Last Updated</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDateTime(transaction.updated_at)}
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
                    onClick={onBack}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Back to Transactions List
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.transaction_id);
                      toast.success("Transaction ID copied to clipboard");
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Copy Transaction ID
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

export default TransactionsPage;