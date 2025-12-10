import React, { useEffect, useState } from "react";
import {
  PackagePlus,
  ArrowLeft,
  Upload,
  Image,
  Loader,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayOut from "../layout/PageLayOut";
import { useCategoriesStore } from "../store/categoriesStore";
import { useEquipmentStore } from "../store/equipmentStore";
import PrintQRCodeModal from "../assets/components/modal/PrintQRCodeModal";

const AddEquipmentPage = () => {
  const navigate = useNavigate();
  const { categories, refreshCategories } = useCategoriesStore();
  const [QRcode, setQRCode] = useState(null);
  const [openQRcode, setOpenQRcode] = useState(false);
  const { createEquipment } = useEquipmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    condition: "new",
    category_id: "",
    equipment_image: null,
    status: "available",
  });

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, equipment_image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("quantity", formData.quantity.toString());
    payload.append("condition", formData.condition);
    payload.append("category_id", formData.category_id);
    payload.append("status", formData.status);

    if (formData.equipment_image) {
      payload.append("equipment_image", formData.equipment_image);
    }

    setIsSubmitting(true);

    try {
      const response = await createEquipment(payload);

      if (!response || !response.success) {
        toast.error(response?.message || "Failed to create equipment");
        return;
      }

      // toast.success(response.message);
      setQRCode(response.equipment.qr_code);
      setOpenQRcode(true);
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        condition: "new",
        category_id: "",
        equipment_image: null,
        status: "available",
      });
      setImagePreview(null)
      return;
    } catch (error) {
      console.error("Error adding equipment:", error);
      toast.error("Failed to add equipment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseQR = () => {
    setOpenQRcode((prev) => !prev);
  };
  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.description.trim() &&
      formData.quantity >= 0 &&
      formData.category_id
    );
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, equipment_image: null }));
  };

  // Combined loading state
  const isLoading = isSubmitting;

  return (
    <PageLayOut>
      {openQRcode && (
        <PrintQRCodeModal value={QRcode} onClose={() => handleCloseQR()} />
      )}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/equipment")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:ring-offset-2 rounded-lg p-1"
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Equipment</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#ffe6ea] rounded-lg">
                <PackagePlus className="w-8 h-8 text-[#db002f]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Add New Equipment
                </h1>
                <p className="text-gray-600 mt-2">
                  Add new equipment to the inventory system
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
              className="space-y-6"
            >
              {/* Basic Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Equipment Name */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Equipment Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter equipment name"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter equipment description"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Quantity *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter quantity"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category_id"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Category *
                    </label>
                    <select
                      id="category_id"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category.category_id}
                          value={category.category_id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Equipment Details Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Equipment Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Condition */}
                  <div>
                    <label
                      htmlFor="condition"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Condition *
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      required
                      disabled={isLoading}
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      required
                      disabled={isLoading}
                    >
                      <option value="available">Available</option>
                      <option value="out">Out</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Equipment Image
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image Upload */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="image"
                        className={`cursor-pointer ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 h-full flex flex-col items-center justify-center">
                      {imagePreview ? (
                        <div className="text-center">
                          <img
                            src={imagePreview}
                            alt="Equipment preview"
                            className="max-h-48 max-w-full object-contain rounded mb-2"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="text-sm text-[#db002f] hover:text-[#b50025] transition-colors"
                            disabled={isLoading}
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <Image className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">No image selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Validation Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Form Validation
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {formData.name.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Equipment name is required
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.description.trim() ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Description is required
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.quantity >= 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Valid quantity is required
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.category_id ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">
                      Category is required
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/equipment")}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className="px-6 py-3 bg-[#db002f] text-white rounded-lg hover:bg-[#b50025] focus:outline-none focus:ring-2 focus:ring-[#db002f] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Adding Equipment...</span>
                    </>
                  ) : (
                    <>
                      <PackagePlus className="w-5 h-5" />
                      <span>Add Equipment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Tips */}
          <div className="mt-6 bg-[#ffe6ea] border border-[#ffbaba] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#a30024] mb-2">
              Quick Tips
            </h3>
            <ul className="text-[#a30024] space-y-1 text-sm">
              <li>• All fields marked with * are required</li>
              <li>• Upload clear images for better equipment identification</li>
              <li>
                • Set appropriate condition and status for accurate tracking
              </li>
              <li>• Choose the correct category for better organization</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayOut>
  );
};

export default AddEquipmentPage;
