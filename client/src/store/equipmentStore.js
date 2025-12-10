import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const SERVER_ENDPOINT = `${import.meta.env.VITE_SERVER_API_BASE_URL}`;

const initialState = {
  equipment: [],
  loadingEquipment: false,
  equipmentSuccess: null,
  equipmentError: null,
  totalEquipment: null,
};

export const useEquipmentStore = create((set, get) => ({
  ...initialState,

  // ✅ Fetch all equipment
  fetchEquipment: async (force = false, payload) => {
    const { equipment } = get();
    if (equipment.length > 0 && !force) return;

    set({
      loadingEquipment: true,
      equipmentError: null,
      equipmentSuccess: null,
    });

    try {
      const { data } = await axios.get(
        `${SERVER_ENDPOINT}/equipment/get-equipment?limit=${
          payload?.limit || 10
        }&offset=${payload?.offset || 0}`
      );
      if (!data.success) throw new Error(data.message);

      set({
        equipment: data.equipment || [],
        loadingEquipment: false,
        equipmentSuccess: data.message,
        totalEquipment: data.pagination.count,
      });
      console.log(data.pagination);
      return { pagination: data.pagination };
    } catch (error) {
      console.log(error.message);
      set({
        loadingEquipment: false,
        equipmentError: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || "Failed to fetch equipment");
      return {
        success: false,
        message: error.response.data.message,
      };
    }
  },
  // ✅ Create new equipment (supports image upload)
  createEquipment: async (formData) => {
    set({
      loadingEquipment: true,
      equipmentError: null,
      equipmentSuccess: null,
    });

    try {
      const { data } = await axios.post(
        `${SERVER_ENDPOINT}/equipment/add-equipment`,
        formData, // must be FormData
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to create equipment");
      }

      toast.success(data.message);

      // Refresh equipment list after adding
      const { fetchEquipment } = get();
      await fetchEquipment(true);

      set({
        loadingEquipment: false,
        equipmentSuccess: data.message,
      });

      return {
        success: true,
        message: data.message,
        equipment: data.equipment,
      };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;

      set({
        loadingEquipment: false,
        equipmentError: errorMsg,
      });

      toast.error(errorMsg);

      return {
        success: false,
        message: errorMsg,
      };
    }
  },
  refreshEquipment: async (payload) => {
    const { fetchEquipment } = get();
    await fetchEquipment(true, payload);
  },
  getEquipment: async (equipment_id) => {
    try {
      const { data } = await axios.get(
        `${SERVER_ENDPOINT}/equipment/get-equipment/${equipment_id}`
      );
      if (data.success) {
        return {
          success: true,
          message: data.message,
          equipment: data.equipment,
        };
      }
      return {
        success: true,
        message: data.message,
        equipment: data.equipment,
      };
    } catch (error) {
      console.log("Error fetching equipment");
    }
  },
  // ✅ Delete equipment (optional)
  deleteEquipment: async (id) => {
    try {
      const { data } = await axios.delete(
        `${SERVER_ENDPOINT}/equipment/delete/${id}`
      );
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        equipment: state.equipment.filter(
          (eq) => eq.equipment_id !== id && eq.equipment_id !== id
        ),
      }));

      toast.success("Equipment deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting equipment");
    }
  },
}));
