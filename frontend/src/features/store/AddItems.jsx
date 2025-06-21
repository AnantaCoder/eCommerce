import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Upload,
  DollarSign,
  Hash,
  Type,
  Building,
  Layers,
  FileText,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { addItems } from "./storeSlice";
import { fetchCategories } from "../category/categorySlice";

function AddItems() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.store);
  const { categories: categoryList, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );
  // State for form data
  const [formData, setFormData] = useState({
    item_name: "",
    item_type: "",
    manufacturer: "",
    quantity: "",
    price: "",
    sku: "",
    description: "",
    category: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // // Categories - you can customize these
  // const categories = [
  //   'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
  //   'Toys', 'Health & Beauty', 'Automotive', 'Food', 'Other'
  // ];

  // Reset form function
  const resetForm = useCallback(() => {
    setFormData({
      item_name: "",
      item_type: "",
      manufacturer: "",
      quantity: "",
      price: "",
      sku: "",
      description: "",
      category: "",
    });
    setImageFiles([]);
    setImagePreviews([]);
  }, []);

  // fetch the categories
  useEffect(() => {
    dispatch(
      fetchCategories({
        page: 1,
        pageSize: 10,
      })
    );
  }, [dispatch]);

  // Reset form on success
  useEffect(() => {
    if (success) {
      resetForm();
    }
  }, [success, resetForm]);

  // Check if user is seller
  if (!user?.is_seller) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-400">
              You need to be registered as a seller to add items to the store.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      imageFiles,
    };

    dispatch(addItems(submitData));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 rounded-2xl mb-4">
            <Package className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Add New Item</h1>
          <p className="text-gray-400">List your products in the marketplace</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-800/20 border border-green-600 rounded-xl p-4 flex items-center">
            <Check className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-300">Item added successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-800/20 border border-red-600 rounded-xl p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-300">{error.message}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="lg:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Type className="w-4 h-4 mr-2" />
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Item Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Layers className="w-4 h-4 mr-2" />
                    Item Type *
                  </label>
                  <input
                    type="text"
                    name="item_type"
                    value={formData.item_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    placeholder="e.g., Smartphone, T-shirt"
                  />
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Building className="w-4 h-4 mr-2" />
                    Manufacturer *
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    placeholder="Brand or manufacturer name"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Hash className="w-4 h-4 mr-2" />
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    placeholder="Available quantity"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Hash className="w-4 h-4 mr-2" />
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    placeholder="Stock Keeping Unit"
                  />
                </div>

                {/* Category */}
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                >
                  <option value="" disabled>
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>
                  {categoryList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors resize-none"
                    placeholder="Describe your item in detail..."
                  />
                </div>

                {/* Image Upload */}
                <div className="lg:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-amber-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">
                        Click to upload images or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit & Reset Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Add Item"
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItems;
