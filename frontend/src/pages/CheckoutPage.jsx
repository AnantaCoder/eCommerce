import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import { fetchCartItems, selectCartItems } from "../features/cart/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../features/stripe/StripeCheckout";
import api from "../services/api";
import { addOrderAddress } from "../features/order/orderSlice";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const user = useSelector((state) => state.auth.user);
  const addressStatus = useSelector((state) => state.order.addressStatus);
  const addressError = useSelector((state) => state.order.addressError);

  const [showStripe, setShowStripe] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({});

  const stripePromise = useMemo(
    () => loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_..."),
    []
  );

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, token]);

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );

  const savings = 299;
  const storePickup = 0;
  const tax = 799;
  const grandTotal = total - savings + storePickup + tax;

  const validate = () => {
    const newErrors = {};
    if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }
    if (!shippingAddress.trim()) newErrors.shippingAddress = "Address is required.";
    if (!country.trim()) newErrors.country = "Country is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = () => {
    setShowStripe(false);
    setOrderId(null);
    alert("Payment Successful");
    window.location.href = "/my-orders";
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    setCreatingOrder(true);
    try {
      await dispatch(
        addOrderAddress({
          user: user.id,
          phone_number: phoneNumber,
          shipping_address: shippingAddress,
          country,
          city,
        })
      ).unwrap();

      const validCartItems = cartItems.filter(
        (item) => item.item?.id || item.id
      );
      if (validCartItems.length !== cartItems.length) {
        alert(
          "Some items in your cart are no longer available. Please remove them and try again."
        );
        setCreatingOrder(false);
        return;
      }
      const items = validCartItems.map((item) => ({
        item_id: item.item?.id || item.id,
        quantity: item.quantity || 1,
      }));

      const { data } = await api.post(
        "store/orders/",
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderId(data.id);
      setShowStripe(true);
    } catch (err) {
      let errorMessage = "Failed to create order. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      }
      alert(errorMessage);
    }
    setCreatingOrder(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-2 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Checkout</h2>
            <div className="mb-8">
              <div className="flex gap-6 mb-4">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="radio"
                    name="accountType"
                    defaultChecked
                    className="accent-blue-500"
                  />
                  Individual
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="radio"
                    name="accountType"
                    className="accent-blue-500"
                  />
                  Company
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-stone-100 ">
                <input
                  className="input"
                  value={user?.first_name || ""}
                  placeholder="First Name*"
                  readOnly
                />
                <input
                  className="input"
                  value={user?.last_name || ""}
                  placeholder="Last Name*"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <input
                  className="input w-full text-amber-100"
                  placeholder="Phone Number*"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  className="input w-full text-amber-100"
                  placeholder="Shipping Address*"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
                {errors.shippingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    className="input w-full text-amber-100"
                    placeholder="Country*"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>
                <div>
                  <input
                    className="input w-full text-amber-100 "
                    placeholder="City*"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
              </div>
              {addressStatus === "failed" && (
                <div className="text-red-500 mb-2">{addressError}</div>
              )}
              <label className="flex items-center gap-2 text-gray-400 text-sm">
                <input type="checkbox" className="accent-blue-500" />
                Save the data in the saved address list
              </label>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Payment details</h3>
              <div className="flex flex-col gap-2 text-gray-300">
                <label>
                  <input type="radio" name="payment" defaultChecked className="accent-blue-500" /> Online with bank card
                </label>
                <label>
                  <input type="radio" name="payment" className="accent-blue-500" /> Flexible online installments
                </label>
                <label>
                  <input type="radio" name="payment" className="accent-blue-500" /> Store pickup
                </label>
                <label>
                  <input type="radio" name="payment" className="accent-blue-500" /> Payment order
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6">Order Items</h3>
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  <ShoppingCart className="mx-auto mb-2" size={32} />
                  Your cart is empty.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4 last:mb-0 last:pb-0 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.item?.image_urls?.[0] ||
                          item.image_urls?.[0] ||
                          "https://placehold.co/60x60"
                        }
                        alt={item.item_name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-800"
                      />
                      <div>
                        <div className="text-white font-medium">{item.item_name || item.name}</div>
                        <div className="text-gray-400 text-sm">
                          {item.quantity || 1} × ₹{item.price}
                        </div>
                      </div>
                    </div>
                    <div className="text-white font-bold text-lg">
                      ₹{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 shadow-lg relative">
            <h3 className="text-xl font-bold text-white mb-6">Order summary</h3>
            <div className="flex justify-between text-gray-400 mb-2">
              <span>Original price</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-400 mb-2">
              <span>Savings</span>
              <span>-₹{savings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400 mb-2">
              <span>Store Pickup</span>
              <span>₹{storePickup.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400 mb-4">
              <span>Tax</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-6">
              <span className="text-white">Total</span>
              <span className="text-amber-400">₹{grandTotal.toLocaleString()}</span>
            </div>

            {showStripe && orderId && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-xl p-8 shadow-lg max-w-md w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => setShowStripe(false)}
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold text-white mb-4">Enter Card Details</h3>
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm
                      orderId={orderId}
                      amount={grandTotal}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </div>
              </div>
            )}

            <button
              className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-lg disabled:opacity-50"
              onClick={handleCheckout}
              disabled={creatingOrder || cartItems.length === 0}
            >
              {creatingOrder ? "Processing..." : "Continue to payment"}
            </button>
            <button
              className="w-full mt-3 py-2 text-blue-400 hover:text-blue-300 text-sm underline"
              onClick={() => window.history.back()}
            >
              ← Return to Shopping
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          @apply bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200;
        }
      `}</style>
    </div>
  );
}
