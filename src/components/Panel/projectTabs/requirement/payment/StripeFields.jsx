import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function StripeFields({ selectedPlan, onPaymentSuccess, onPaymentError, onBack }) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Parse price string (e.g., "$1499") and convert to cents
      const amountInCents = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, ""));

      if (!amountInCents || isNaN(amountInCents) || amountInCents < 50) {
        onPaymentError?.("Invalid payment amount. Must be at least $0.50.");
        setProcessing(false);
        return;
      }

      // Create PaymentIntent from backend
      const { data } = await axios.post(`${BACKEND_URL}/stripe/create-payment-intent`, {
        amount: amountInCents,
        currency: "usd",
        metadata: { plan: selectedPlan.name },
      });

      const clientSecret = data?.clientSecret;
      if (!clientSecret) {
        throw new Error("Failed to get client secret from server.");
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        onPaymentError?.(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onPaymentSuccess?.(result.paymentIntent);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Payment failed. Try again.";
      onPaymentError?.(msg);
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
    <div className="space-y-5 mt-4">
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
          className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:opacity-80"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handlePayment}
          disabled={processing || !stripe}
          className={`px-6 py-3 text-white font-semibold rounded-md transition ${
            processing || !stripe
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
