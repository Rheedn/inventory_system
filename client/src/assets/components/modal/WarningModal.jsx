import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

const WarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Confirm Action",
  message = "This action is irreversible. Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // 'warning' or 'danger'
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    if (type === "danger") {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "text-red-600",
        confirmBtn: "bg-red-600 hover:bg-red-700",
        text: "text-red-800",
      };
    }
    return {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      confirmBtn: "bg-[#db002f] hover:bg-[#b50025]",
      text: "text-yellow-800",
    };
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white rounded-lg max-w-md w-full ${colors.border} border-2`}
      >
        {/* Header */}
        <div
          className={`flex items-center space-x-3 p-6 ${colors.bg} rounded-t-lg`}
        >
          <div className={`p-2 rounded-full ${colors.bg}`}>
            <AlertTriangle className={colors.icon} size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              if (!loading) {
                onClose();
              }
            }}
            className={`flex-1 px-4 py-2 text-white rounded-lg flex justify-center items-center gap-2 transition-colors ${colors.confirmBtn}`}
          >
            {loading && <Loader2 className="animate-spin text-white" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
