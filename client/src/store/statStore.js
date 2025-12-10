import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";
axios.defaults.withCredentials = true;

const initialState = {
  stats: [],
  loadingStat: false,
  statError: null,
  stateSuccess: null,
};
export const useStatStore = create((set, get) => ({
  ...initialState,
  fetchStat: async (user_id) => {
    set({ loadingStat: true, statError: null, stateSuccess: null });
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_SERVER_API_BASE_URL
        }/stats/get-stats?user_id=${user_id}`
      );
      if (!data.success) {
        set({ loadingStat: false, statError: data.message });
        return {
          success: false,
          message: data.message,
        };
      }
      set({
        loadingStat: false,
        statError: null,
        stateSuccess: data.message,
        stats: data.stats,
      });
      return { success: true, message: data.message };
    } catch (error) {
      console.log(error);
      const errMsg = error?.response?.data?.message;
      console.log(errMsg);
      set({ loadingStat: false, statError: errMsg, stateSuccess: null });
      toast.error(errMsg);
      return { success: false, message: errMsg };
    }
  },
}));
