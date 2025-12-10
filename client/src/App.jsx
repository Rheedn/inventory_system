import { useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./root/layout";
import SetUp from "./page/SetUp";
import LoginPage from "./page/Login";
import { useSuperAdminCheck } from "./hooks/useSuperAdminCheck";
import Dashboard from "./page/Dashboard";
import UsersPage from "./page/UserPage";
import AddUserPage from "./page/AddUserPage";
import EquipmentPage from "./page/EquipmentPage";
import AddEquipmentPage from "./page/AddEquiment";
import PrintQRCodePage from "./page/PrintQRcode";
import RequestEquipmentPage from "./page/RequestPage";
import UserProfile from "./page/UserProfile";
import ViewRequests from "./page/ViewRequest";
import ForbiddenPage from "./page/ForbiddenPage";
import GuestRoute from "./hooks/usePublicRoute";
import ProtectedRoute from "./hooks/useProtectedRoute";
import NotFoundPage from "./page/NotFound";
import CategoriesPage from "./page/CategoriesPage";
import ReturnPage from "./page/ReturnPage";
import AccessControlPage from "./page/AccessControll";
import EquipmentDetailsPage from "./page/EquipmentDetails";
import UserDetailsPage from "./page/StaffDetails";
import Logs from "./page/Logs";
import EditStaffPage from "./page/EditStaffPage";
import AdminRoute from "./hooks/useAdminRoute";
import { useAuthStore } from "./store/authStore";
import UserSuspendedPage from "./page/UserSuspendedPage";
import LogDetailsPage from "./page/LogDetailsPage";
import TransactionsPage from "./page/TransactionPage";

function App() {
  const { loading, exists } = useSuperAdminCheck();
  const { user } = useAuthStore();
  // ✅ Loading screen
  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-slate-900 to-blue-900">
        <p className="text-white text-xl">Checking system setup...</p>
      </div>
    );
  }

  // ✅ Routes if NO super admin exists (first-time setup)
  const setupRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/setup" replace />} />
        <Route path="setup" element={<SetUp />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Route>
    )
  );

  const suspendedRoute = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<UserSuspendedPage />} />
        <Route path="*" element={<UserSuspendedPage />} />
      </Route>
    )
  );
  // ✅ Routes if super admin exists
  const mainRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route
          path="login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="staffs"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserProfile />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="print-qr-code"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <PrintQRCodePage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="staffs/add-user"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AddUserPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="staffs/edit/:staff_id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EditStaffPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="equipment"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EquipmentPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="requests/view"
          element={
            <ProtectedRoute>
              <ViewRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="requests/request-equipment"
          element={
            <ProtectedRoute>
              <RequestEquipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="equipment/add-equipment"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AddEquipmentPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="categories"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <CategoriesPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="return"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ReturnPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AccessControlPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="equipment/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EquipmentDetailsPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staffs/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserDetailsPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <TransactionsPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Logs />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs/:log_id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <LogDetailsPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return (
    <>
      <ToastContainer />
      {user?.status === "suspended" ? (
        <RouterProvider router={suspendedRoute} />
      ) : (
        <RouterProvider router={exists ? mainRouter : setupRouter} />
      )}
    </>
  );
}

export default App;
