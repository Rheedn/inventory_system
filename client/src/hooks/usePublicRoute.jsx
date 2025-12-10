import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Loader2 } from "lucide-react";

const GuestRoute = ({ children }) => {
  const {user, checkAuth, checkingAuth, authenticated } = useAuthStore();

  useEffect(() => {
    checkAuth('logout');
  }, [checkAuth]);

  if (checkingAuth) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-slate-900 to-blue-900">
        <Loader2 className="animate-spin text-white" size={25} />
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
