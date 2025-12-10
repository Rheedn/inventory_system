import React from "react";
import {
  Shield,
  Clock,
  Mail,
  ArrowLeft,
  AlertTriangle,
  User,
  Calendar,
  Phone
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayOut from "../layout/PageLayOut";
import { useAuthStore } from "../store/authStore";

const UserSuspendedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { staff_id } = useParams();

  // Mock suspension data - in real app, this would come from API
  const suspensionData = {
    reason: "Multiple failed login attempts",
    suspendedBy: "System Administrator",
    suspendedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    suspensionId: "SUSP-2024-001",
    appealEmail: "support@company.com",
    contactPhone: "+1-555-0123"
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expires = new Date(suspensionData.expiresAt);
    const diff = expires - now;

    if (diff <= 0) return "Suspension has ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <PageLayOut>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Account Suspended
            </h1>
            <p className="text-gray-600">
              Your access has been temporarily restricted
            </p>
          </div>

          {/* Suspension Card */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6 mb-6">
            {/* Alert Banner */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800 mb-1">
                    Temporary Suspension
                  </h3>
                  <p className="text-sm text-orange-700">
                    {suspensionData.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* Suspension Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Suspension ID</span>
                <span className="text-sm text-gray-900 font-mono">{suspensionData.suspensionId}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Suspended By</span>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{suspensionData.suspendedBy}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Suspended On</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{formatDate(suspensionData.suspendedAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Expires On</span>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{formatDate(suspensionData.expiresAt)}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Time Remaining
                  </p>
                  <p className="text-lg font-semibold text-blue-900">
                    {getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appeal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              If you believe this suspension is a mistake or need immediate assistance,
              please contact our support team.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Support</p>
                  <a
                    href={`mailto:${suspensionData.appealEmail}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {suspensionData.appealEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone Support</p>
                  <a
                    href={`tel:${suspensionData.contactPhone}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {suspensionData.contactPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#db002f] text-white py-3 px-4 rounded-lg hover:bg-[#b50025] transition-colors font-medium"
            >
              Return to Login
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Check Status
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-gray-600 py-3 px-4 rounded-lg hover:text-gray-700 transition-colors font-medium"
            >
              Back to Homepage
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              For security reasons, some account features are temporarily unavailable during suspension.
            </p>
          </div>
        </div>
      </div>
    </PageLayOut>
  );
};

export default UserSuspendedPage;