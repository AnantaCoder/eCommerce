import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Edit3,
  Trash2,
  Save,
  X,
  DollarSign,
  Hash,
  Type,
  Building,
  Layers,
  FileText,
  AlertCircle,
  Check,
} from "lucide-react";
import { updateItems, deleteItems, fetchSellerItems } from "./storeSlice";
import { fetchCategories } from "../category/categorySlice";

function ManageItems() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.store);
  const { categories: categoryList } = useSelector((state) => state.categories);
  
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, pageSize: 10 }));
    if (user?.id) {
      dispatch(fetchSellerItems(user.id));
    }
  }, [dispatch, user]);

  if (!user?.is_seller) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
            <p className="text-gray-400">You need to be registered as a seller to manage items.</p>
          </div>
        </div>
      </div>
    );
  }

  const userItems = items;

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditFormData({
      item_name: item.item_name,
      item_type: item.item_type,
      manufacturer: item.manufacturer,
      quantity: item.quantity,
      price: item.price,
      sku: item.sku || "",
      description: item.description || "",
      category: item.category,
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (itemId) => {
    const updateData = {
      ...editFormData,
      quantity: parseInt(editFormData.quantity),
      price: parseFloat(editFormData.price),
    };
    
    dispatch(updateItems({ itemId, data: updateData }));
    setEditingItem(null);
    setEditFormData({});
  };

  const handleDelete = (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteItems({ itemId }));
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categoryList.find(cat => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 rounded-2xl mb-4">
            <Package className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Manage Items</h1>
          <p className="text-gray-400">Edit and manage your listed products</p>
        </div>

        
        {userItems.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Items Listed</h3>
            <p className="text-gray-400">You haven't added any items to your store yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userItems.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                {editingItem === item.id ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <Type className="w-4 h-4 mr-2" />
                        Item Name
                      </label>
                      <input
                        type="text"
                        name="item_name"
                        value={editFormData.item_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <Layers className="w-4 h-4 mr-2" />
                        Item Type
                      </label>
                      <input
                        type="text"
                        name="item_type"
                        value={editFormData.item_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={editFormData.manufacturer}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <Hash className="w-4 h-4 mr-2" />
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={editFormData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <Hash className="w-4 h-4 mr-2" />
                        SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={editFormData.sku}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                      >
                        <option value="" disabled>Select a category</option>
                        {categoryList.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <FileText className="w-4 h-4 mr-2" />
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors resize-none"
                      />
                    </div>

                    <div className="lg:col-span-2 flex gap-4">
                      <button
                        onClick={() => handleUpdate(item.id)}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{item.item_name}</h3>
                        <p className="text-gray-400 text-sm">{item.item_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-300">{item.manufacturer}</p>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-amber-400 font-semibold text-lg">₹ {item.price}</p>
                        <p className="text-gray-400 text-sm">{getCategoryName(item.category)}</p>
                      </div>
                      {item.sku && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <p className="text-gray-400 text-sm">SKU: {item.sku}</p>
                        </div>
                      )}
                      {item.description && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <p className="text-gray-300 text-sm">{item.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageItems;