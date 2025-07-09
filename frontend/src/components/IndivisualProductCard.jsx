import React, { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
  Package,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteAllCart, fetchCartItems } from "../features/cart/cartSlice";
import { toast } from "react-toastify";

function IndividualProductCard({ product, addWishlist, addToCart }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch= useDispatch()
  const defaultProduct = {
    id: 2,
    item_name: "Home Gym Combo",
    item_type: "gym",
    manufacturer: "DreamFit",
    category: 1,
    category_name: "Exercise and Wellness",
    quantity: 100,
    price: "4999.00",
    sku: "HGC-1",
    description:
      "50 kg 50 kg Home gym with 5 ft Straight Rod , 3 ft Curl Rod And Accessories Home Gym Combo",
    is_active: false,
    is_in_stock: true,
    seller_name: "Angus  Stores",
    image_urls: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    ],
    created_at: "2025-06-25T14:52:13.515719Z",
    updated_at: "2025-06-25T14:52:13.515719Z",
  };

  const productData = product || defaultProduct;
  const navigate = useNavigate();

  const handleWishlistToggle = () => {
    if (!isWishlisted) {
      addWishlist(productData.id);
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({ id: productData.id });
  };

  const handleBuyNow = async () => {
  try {
    await dispatch(addToCart({ itemId: productData.id, quantity: 1 }))
      .unwrap();
  } catch (err) {
    toast.error("Could not add to cart: " + (err.message || err), {
      position: "bottom-right",
    });
  } finally {
    navigate("/cart");
  }
}

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(parseFloat(price));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/store")}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="text-sm text-gray-400">
                <span className="hover:text-white cursor-pointer">
                  {productData.category_name}
                </span>
                <span className="mx-2">/</span>
                <span className="text-white">{productData.item_name}</span>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-700/30 to-gray-800/30 relative group">
              <img
                src={productData.image_urls[selectedImage]}
                alt={productData.item_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/30 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-500/40 rounded-full blur-sm animate-pulse delay-500"></div>
            </div>
            {/* Thumbnail Images */}
            {productData.image_urls.length > 1 && (
              <div className="flex gap-3 justify-center">
                {productData.image_urls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-purple-500 shadow-lg shadow-purple-500/25"
                        : "border-gray-600/50 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-8">
            {/* Product Title & Manufacturer */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
                {productData.item_name}
              </h1>
              <p className="text-xl text-gray-400">
                by{" "}
                <span className="text-purple-400 font-medium">
                  {productData.manufacturer}
                </span>
              </p>
            </div>
            {/* Description */}
            <div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {productData.description}
              </p>
            </div>
            {/* Product Details Table */}
            <div className="bg-gray-800/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-700/50">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white font-medium">
                    {productData.category_name}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-700/50">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white font-medium">
                    {productData.quantity}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-700/50">
                  <span className="text-gray-400">Price</span>
                  <span className="text-white font-bold text-xl">
                    {formatPrice(productData.price)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-700/50">
                  <span className="text-gray-400">SKU</span>
                  <span className="text-white font-medium">
                    {productData.sku}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-700/50">
                  <span className="text-gray-400">Stock Status</span>
                  <span
                    className={`font-medium ${
                      productData.is_in_stock
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {productData.is_in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-400">Seller</span>
                  <span className="text-white font-medium">
                    {productData.seller_name}
                  </span>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!productData.is_in_stock}
                  className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    productData.is_in_stock
                      ? "bg-gray-700/50 text-white hover:bg-gray-600/50 hover:shadow-lg border border-gray-600/50 hover:border-gray-500"
                      : "bg-gray-600/30 text-gray-500 cursor-not-allowed border border-gray-700/50"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 border ${
                    isWishlisted
                      ? "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30"
                      : "bg-gray-700/50 text-white hover:bg-gray-600/50 border-gray-600/50 hover:border-gray-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={!productData.is_in_stock}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  productData.is_in_stock
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/25 active:scale-[0.98]"
                    : "bg-gray-600/30 text-gray-500 cursor-not-allowed"
                }`}
              >
                Buy Now
              </button>
            </div>
            {/* Additional Info */}
           
          </div>
        </div>
      </div>
      {/* Floating Abstract Elements */}
      <div className="fixed top-1/4 left-8 w-3 h-3 bg-purple-500/60 rounded-full animate-bounce delay-300 hidden lg:block"></div>
      <div className="fixed bottom-1/3 right-12 w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce delay-700 hidden lg:block"></div>
      <div className="fixed top-1/2 right-8 w-4 h-4 bg-pink-500/40 rounded-full animate-pulse delay-1000 hidden lg:block"></div>
    </div>
  );
}

export default IndividualProductCard;
