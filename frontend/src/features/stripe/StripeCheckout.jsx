import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../../services/api";
/**
 * FUTURE UPGRADE PROBLEM 
 * i can extraxt seller id from state but for individual product but how to get that
 */
export default function StripeCheckoutForm({ orderId, amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    try {
      const token = localStorage.getItem("access_token");
      
      console.log("Creating payment intent with:", {
        order_id: orderId,
        amount: Math.round(amount * 100),
        payment_method: "card",
        seller_id: 1 
      });

      // 1. Create PaymentIntent on backend
      const { data } = await api.post(
        "/payments/create-intent/",
        {
          order_id: orderId,
          amount: Math.round(amount * 100), // Stripe expects paise/cents
          payment_method: "card",
          seller_id: 1, // Add seller_id - adjust as needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payment intent created:", data);

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setLoading(false);

      if (result.error) {
        console.error("Payment error:", result.error);
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", result.paymentIntent);
        onSuccess && onSuccess();
      }
    } catch (err) {
      setLoading(false);
      console.error("Payment process error:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMessage = "Payment failed. Try again.";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement 
        className="bg-gray-800 p-3 rounded text-white"
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#ffffff',
              '::placeholder': {
                color: '#9ca3af',
              },
            },
          },
        }}
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-blue-600 text-white rounded font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}
      </button>
    </form>
  );
}