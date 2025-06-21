import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function StripeFields({ selectedPlan, onPaymentSuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse price string (e.g., "$1499") and convert to cents
      const amountInCents = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, ""));

      if (!amountInCents || isNaN(amountInCents) || amountInCents < 50) {
        throw new Error("Invalid payment amount");
      }

      // Create PaymentIntent from backend
      const { data } = await axios.post(`${BACKEND_URL}/stripe/create-payment-intent`, {
        amount: amountInCents,
        currency: "usd",
        metadata: { plan: selectedPlan.name },
      });

      const clientSecret = data?.clientSecret;
      if (!clientSecret) {
        throw new Error("Failed to get client secret from server");
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === "succeeded") {
        setSuccess(`Payment of $${amountInCents} completed successfully!`);
        setShowSuccess(true);
        
        // Show success message for 2 seconds before calling onPaymentSuccess
        setTimeout(() => {
          setShowSuccess(false);
          onPaymentSuccess?.(result.paymentIntent);
        }, 2000);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const elementStyles = {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: "Inter, sans-serif",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      color: "#e53e3e",
    },
  };

  return (
    <div className="space-y-5 mt-4 relative">
      {/* Loading Overlay */}
      {processing && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <FaSpinner className="animate-spin text-4xl text-[#2E3191] opacity-90" />
        </div>
      )}

      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-20">
          <FaCheckCircle className="text-green-500 text-5xl mb-4" />
          <p className="text-xl font-semibold text-gray-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Card Number */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">Card Number</label>
        <div className="border border-gray-300 rounded-md p-3 bg-white shadow-sm">
          <CardNumberElement options={{ style: elementStyles }} />
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Expiry Date</label>
          <div className="border border-gray-300 rounded-md p-3 bg-white shadow-sm">
            <CardExpiryElement options={{ style: elementStyles }} />
          </div>
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">CVC</label>
          <div className="border border-gray-300 rounded-md p-3 bg-white shadow-sm">
            <CardCvcElement options={{ style: elementStyles }} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={processing || showSuccess}
          className={`px-5 py-2 rounded-md text-gray-700 ${
            processing || showSuccess ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:opacity-80"
          }`}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handlePayment}
          disabled={processing || !stripe || showSuccess}
          className={`px-6 py-3 text-white font-semibold rounded-md transition ${
            processing || !stripe || showSuccess
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:opacity-90"
          }`}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}