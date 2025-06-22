import { PayPalButtons, usePayPalScriptReducer, FUNDING } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";

export default function PaypalNote({ selectedPlan, onBack , onClose }) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0); 
  const { backend } = useAuth();

  const planName = selectedPlan?.name || "Selected Plan";
  const planPrice = parseFloat(
    typeof selectedPlan?.price === "string"
      ? selectedPlan.price.replace(/[^0-9.]/g, "")
      : selectedPlan?.price
  );

  const isValidPlan = !!selectedPlan && !isNaN(planPrice) && planPrice > 0;

  if (!isValidPlan) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md text-sm text-red-800">
        ⚠️ Invalid plan selected. Please return to the previous step and select a valid plan.
      </div>
    );
  }

  const createOrder = async () => {
    try {
      const res = await axios.post(`${backend}/paypal/create-order`, {
        amount: planPrice,
        currency: "USD",
      });

      if (!res.data?.orderID) throw new Error("No order ID returned from server.");
      return res.data.orderID;
    } catch (err) {
      setError("❌ Failed to create PayPal order");
      console.error("Create Order Error:", err);
      throw err;
    }
  };

  const handleApproval = async (data) => {
    try {
      const res = await axios.post(`${backend}/paypal/capture-order`, {
        orderID: data.orderID,
      });

      if (res.data?.status === "COMPLETED") {
        setPaid(true);
        setError(null);
      } else {
        setError("⚠️ Payment was not completed");
      }
    } catch (err) {
      setError("❌ Failed to capture PayPal payment");
      console.error("Capture Error:", err);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryKey(prev => prev + 1); // Triggers re-render of PayPalButtons
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <p className="mb-4 text-gray-700 text-sm leading-relaxed">
        Pay securely using your <strong>Credit or Debit Card</strong> or a <strong>PayPal account</strong> below for the <strong>{planName}</strong> plan.
      </p>

      {isPending && (
        <p className="text-sm text-gray-500">⚙️ Loading payment options...</p>
      )}

      {!paid && !error && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Pay via PayPal Account
            </label>
            <div className="border border-gray-300 rounded-md p-2">
              <PayPalButtons
                key={`paypal-${retryKey}`}
                fundingSource={FUNDING.PAYPAL}
                style={{ layout: "horizontal", label: "paypal" }}
                createOrder={createOrder}
                onApprove={handleApproval}
                onError={(err) => {
                  setError("❌ PayPal error occurred");
                  console.error("PayPal Button Error:", err);
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Pay via Credit or Debit Card
            </label>
            <div className="border border-gray-300 rounded-md p-2">
              <PayPalButtons
                key={`card-${retryKey}`}
                fundingSource={FUNDING.CARD}
                style={{ layout: "horizontal", label: "pay", height: 45 }}
                createOrder={createOrder}
                onApprove={handleApproval}
                onError={(err) => {
                  setError("❌ Card payment error occurred");
                  console.error("Card Payment Error:", err);
                }}
              />
            </div>
          </div>
        </>
      )}

      {paid && (
        <div className="mt-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded text-sm font-medium">
          ✅ Payment of ${planPrice.toFixed(2)} was successful. Thank you for subscribing!
          <div className="mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 mt-2 rounded-md bg-[#2E3191] text-white hover:opacity-90"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm font-medium">
          {error}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRetry}
              className="px-5 py-2 rounded-md bg-yellow-400 text-white hover:opacity-90"
            >
              Retry Payment
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2 rounded-md bg-[#2E3191] text-white hover:opacity-90"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {!paid && !error && (
        <div className="pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:opacity-80"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
