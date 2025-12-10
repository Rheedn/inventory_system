import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;
const initialState = {
  logs: [],
  totalLogs: 0,
  loadingLogs: false,
  logError: null,
  logSuccess: null,
};
const SERVER_ENDPOINT = `${import.meta.env.VITE_SERVER_API_BASE_URL}`;
export const useLogStore = create((set, get) => ({
  ...initialState,
  fetchLogs: async (forceRefresh = false, payload = {}) => {
    const { logs } = get();
    if (logs.length > 0 && !forceRefresh) {
      return;
    }
    set({ loadingLogs: true });
    try {
      const { data } = await axios.get(`${SERVER_ENDPOINT}/logs/fetch-logs`);
      if (!data.success) {
        set({ logs: [], loadingLogs: false, logError: data.message });
        toast.error(data.message);
        return;
      }
      set({
        logs: data.logs || [],
        loadingLogs: false,
        logError: null,
        logSuccess: data.message,
      });
      // toast.success(data.message);
      return;
    } catch (error) {
      console.log(
        "Error fetching logs: ",
        error?.response.data.message || error.message
      );
      toast.error(error?.response.data.message || "An error occur");
      return;
    }
  },
  getLogById: async (id) => {
    try {
      const { data } = await axios.get(`${SERVER_ENDPOINT}/logs/get-log/${id}`);
      if (data.success) {
        return {
          data: data.log
        }
      }
    } catch (error) {
      console.log(error)
    }
  },
  refreshLogs: async (forceRefresh = false, payload = {}) => {
    return get().fetchLogs(true, payload);
  },

  clearLogs: async () => {
    try {
      // Your API call to clear logs
      const response = await axios.delete("/logs");
      set({ logs: [], totalLogs: 0 });
      return response;
    } catch (error) {
      throw error;
    }
  },
}));
