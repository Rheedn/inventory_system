import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Filter,
  Loader2,
  RefreshCw,
} from "lucide-react";
import PageLayout from "../layout/PageLayOut";
import AddCategoryModal from "../assets/components/modal/AddCategoryModal";
import { useCategoriesStore } from "../store/categoriesStore";
import WarningModal from "../assets/components/modal/WarningModal";

const CategoriesPage = () => {
  const {
    categories,
    fetchCategories,
    loadingCategories,
    refreshCategories,
    deleteCategory,
  } = useCategoriesStore();
  const [loading, setLoading] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [isWarning, setISWarning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetch_Categories = async () => {
      try {
        // Simulate API call
        await fetchCategories();
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetch_Categories();
  }, []);
  const handleRefresh = async () => {
    await refreshCategories();
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (categoryId) => {
    setLoading(true);
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full flex-1">
          <Loader2 className="animate-spin  text-[#db002f]" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {isWarning && (
        <WarningModal
          loading={loading}
          isOpen={isWarning}
          onClose={() => {
            setISWarning(false);
          }}
          type="danger"
          onConfirm={async () => {
            handleDelete(toDeleteId);
            // setISWarning(false);
          }}
          title="Delete Category"
          message="You are about to delete category, this action can't be reversed"
        />
      )}
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage equipment categories</p>
          </div>
          <div className="flex gap-2 items-center">
            {" "}
            <button
              onClick={() => {
                handleRefresh();
              }}
              className="flex items-center space-x-2 bg-[#ffe6ea] text-[#db002f] px-4 py-2 rounded-lg hover:bg-[#ffbaba] transition-colors"
            >
              <RefreshCw
                size={20}
                className={`${loadingCategories && "animate-spin"}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-[#db002f] text-white px-4 py-2 rounded-lg hover:bg-[#b50025] transition-colors"
            >
              <Plus size={20} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.category_id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#ffe6ea] rounded-lg">
                    <Package className="text-[#db002f]" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setToDeleteId(category.category_id);
                      setISWarning(true);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{category.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  ID: {category.category_id}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No categories found
            </h3>
            <p className="text-gray-600 mt-2">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first category"}
            </p>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddModal && (
          <AddCategoryModal
            onClose={() => setShowAddModal(false)}
            onCategoryAdded={(newCategory) => {
              setCategories((prev) => [...prev, newCategory]);
              setShowAddModal(false);
            }}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default CategoriesPage;
