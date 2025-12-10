import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";
axios.defaults.withCredentials = true;

const SERVER_ENDPOINT = `${import.meta.env.VITE_SERVER_API_BASE_URL}`;

const initialState = {
  user: JSON.parse(localStorage.getItem("equipshare_user")) || null,
  users: [],
  userError: null,
  userSuccess: null,
  loadingUser: false,
  checkingAuth: true,
  authenticated: false,
};

export const useAuthStore = create((set, get) => ({
  ...initialState,

  // ✅ LOGIN
  userLogin: async (payload) => {
    set({ userError: null, userSuccess: null, loadingUser: true });
    try {
      const { data } = await axios.post(
        `${SERVER_ENDPOINT}/auth/user-login`,
        payload
      );

      if (!data.success) {
        set({
          userError: data.message,
          userSuccess: null,
          loadingUser: false,
          user: null,
        });
        return { success: false, message: data.message || "Login failed" };
      }

      set({
        user: data.user,
        userError: null,
        userSuccess: data.message,
        loadingUser: false,
        authenticated: true,
      });
      localStorage.setItem("equipshare_user", JSON.stringify(data.user));

      return { success: true, message: data.message };
    } catch (error) {
      console.log("Login error:", error?.response?.data?.message);
      set({ loadingUser: false });
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "An error occurred while logging in",
      };
    }
  },
  fetchAllUser: async () => {
    set({ users: [] });
    try {
      const { data } = await axios.get(
        `${SERVER_ENDPOINT}/auth/users/get-all-users`
      );
      if (!data.success) {
        toast.error(data.message);
      }
      set({ users: data.users });
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  },
  // ✅ CHANGE PASSWORD
  changePassword: async (payload) => {
    set({ userError: null, userSuccess: null, loadingUser: true });
    try {
      const { data } = await axios.post(
        `${SERVER_ENDPOINT}/auth/change-password`,
        payload
      );
      if (!data.success) {
        set({
          loadingUser: false,
          userError: data.message,
          userSuccess: null,
        });
        return { success: false, message: data.message };
      }
      set({
        loadingUser: false,
        userError: null,
        userSuccess: data.message,
        user: data.user,
      });

      localStorage.setItem("equipshare_user", JSON.stringify(data.user));

      return { success: true, message: data.message };
    } catch (error) {
      console.log("Error changing password:", error.response?.data?.message);
      set({ loadingUser: false });
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  },
  getUser: async (user_id) => {
    try {
      if (!user_id) {
        throw new Error("Equipment ID is required");
      }

      const { data } = await axios.get(
        `${SERVER_ENDPOINT}/auth/user/get-user/${user_id}`
      );

      if (data.success) {
        return {
          success: true,
          message: data.message || "User fetched successfully",
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to fetch user",
        };
      }
    } catch (error) {
      console.error("Error fetching equipment:", error.message);
      toast.error(error.response.data.message || error.message);
      return {
        success: false,
        message: "An error occurred while fetching user",
      };
    }
  },
  updateUser: async (payload) => {
    try {
      const { data } = await axios.post(
        `${SERVER_ENDPOINT}/auth/users/update-user`,
        payload
      );
      if (!data.success) {
        return {
          success: false,
          message: data.message,
        };
      }
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.log("Error updating user: ", error.message);
      return {
        success: false,
        message: error?.response.data.message,
      };
    }
  },
  // ✅ REGISTER USER
  registerUser: async (payload) => {
    set({ loadingUser: true, userSuccess: null, userError: null });

    try {
      const { data } = await axios.post(
        `${SERVER_ENDPOINT}/auth/register-user`,
        payload
      );

      if (!data.success) {
        set({
          loadingUser: false,
          userSuccess: false,
          userError: data.message,
        });
        return {
          success: false,
          message: data.message || "Failed to register user",
        };
      }

      set({
        loadingUser: false,
        userSuccess: data.message,
        userError: null,
      });

      return {
        success: true,
        message: data.message || "User registered successfully",
      };
    } catch (error) {
      console.log("Error trying to register user:", error);
      set({
        loadingUser: false,
        userSuccess: false,
        userError: error.response?.data?.message,
      });
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  },
  updateUserRole: async (payload) => {
    try {
      const { data } = await axios.post(
        `${SERVER_ENDPOINT}/auth/users/change-role`,
        payload
      );

      if (!data.success) {
        toast.error(data.message);
        return { success: false };
      }

      toast.success(data.message);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Error trying to change role:", error);
      const message =
        error.response?.data?.message || "Failed to update user role";
      toast.error(message);
      return { success: false, message };
    }
  },
  deleteUser: async (payload) => {
    try {
      const { data } = await axios.post(
        `${SERVER_ENDPOINT}/auth/users/delete-user`,
        payload
      );

      if (!data.success) {
        toast.error(data.message);
        return { success: false };
      }

      toast.success(data.message || "User deleted successfully");
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Error deleting user:", error.message);
      toast.error(error.response?.data?.message || "Error deleting user");
      return { success: false };
    }
  },

  // ✅ CHECKING AUTH
  checkAuth: async (context) => {
    const { logoutUser } = get();
    set({ checkingAuth: true, userError: null, userSuccess: null });

    try {
      const { data } = await axios.get(
        `${SERVER_ENDPOINT}/auth/get-authenticated-user`
      );

      if (data.success) {
        set({
          user: data.user,
          authenticated: true,
          checkingAuth: false,
        });
        localStorage.setItem("equipshare_user", JSON.stringify(data.user));
      } else {
        logoutUser(false); // not manual
        set({ checkingAuth: false });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          logoutUser(false); // not manual
          if (context != "logout") {
            toast.warn("Session expired, please log in again.");
          }
          set({ checkingAuth: false, authenticated: false });
        } else {
          toast.error(error.response.data?.message || "Server error occurred");
        }
      } else {
        toast.error("Network error — please check your internet connection.");
        set({ checkingAuth: false });
      }
    }
  },
  // ✅ LOGOUT
  logoutUser: async (isManual = true) => {
    try {
      await axios.post(
        `${SERVER_ENDPOINT}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.warn("Logout request failed:", error?.response?.data?.message);
    } finally {
      set({ user: null, authenticated: false });
      localStorage.removeItem("equipshare_user");
      // 👇 Only show toast if it was NOT a manual logout
      if (isManual) toast.success("Logged out successfully.");
    }
  },
}));
