import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const SERVER_ENDPOINT = `${import.meta.env.VITE_SERVER_API_BASE_URL}`;

const initialState = {
  categories: [],
  loadingCategories: false,
  categoriesError: null,
  categoriesSuccess: null,
};

export const useCategoriesStore = create((set, get) => ({
  ...initialState,

  fetchCategories: async (force = false) => {
    const { categories } = get();
    if (categories.length > 0 && !force) return;
    set({ loadingCategories: true, categoriesError: null });
    try {
      const { data } = await axios.get(
        `${SERVER_ENDPOINT}/category/get-categories`
      );
      if (!data.success) throw new Error(data.message);

      set({
        categories: data.categories || [],
        loadingCategories: false,
        categoriesSuccess: data.message,
      });
    } catch (error) {
      set({
        loadingCategories: false,
        categoriesError: error.response?.data?.message || error.message,
      });
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  },

  refreshCategories: async () => {
    const { fetchCategories } = get();
    await fetchCategories(true);
  },

  createCategory: async (payload) => {
    set({
      loadingCategories: true,
      categoriesError: null,
      categoriesSuccess: null,
    });

    try {
      const { data } = await axios.post(
        `${SERVER_ENDPOINT}/category/create-category`,
        payload
      );

      if (!data.success) {
        set({
          categoriesError: data.message,
          categoriesSuccess: false,
          loadingCategories: false,
        });
        toast.error(data.message);
        return;
      }

      set({
        loadingCategories: false,
        categoriesSuccess: data.message,
      });

      toast.success(data.message);

      // Refresh list after creation
      const { fetchCategories } = get();
      fetchCategories(true);
    } catch (error) {
      set({
        loadingCategories: false,
        categoriesError: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || "Error creating category");
    }
  },
  deleteCategory: async (categoryId) => {
    if (!categoryId) {
      toast.error("Category ID is required");
      return;
    }

    set({ categoriesError: null });

    try {
      const { data } = await axios.delete(
        `${SERVER_ENDPOINT}/category/delete-category/${categoryId}`
      );

      if (!data.success) throw new Error(data.message);

      toast.success(data.message);

      // Update list immediately
      set((state) => ({
        categories: state.categories.filter(
          (cat) =>
            cat.category_id !== categoryId && cat.category_id !== categoryId
        ),
      }));
    } catch (error) {
      set({
        categoriesError: error.response?.data?.message || error.message,
      });
      toast.error(error.response?.data?.message || "Error deleting category");
    }
  },
}));