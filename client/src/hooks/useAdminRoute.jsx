import React from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import ForbiddenPage from "../page/ForbiddenPage";

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    toast.info("You must be logged in");
    return <Navigate to="/login" />;
  }

  if (user.role !== "super_admin" && user.role !== "admin") {
    // toast.info("Forbidden: Admins only");
    return <ForbiddenPage />;
  }

  return children;
};

export default AdminRoute;
