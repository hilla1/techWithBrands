import { PayPalButtons, usePayPalScriptReducer, FUNDING } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";

export default function PaypalNote({ selectedPlan, onBack, onSubmit }) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);
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
        if (typeof onSubmit === "function") {
          onSubmit(); // 🔔 Call global onSubmit after successful payment
        }
      } else {
        setError("⚠️ Payment was not completed");
      }
    } catch (err) {
      setError("❌ Failed to capture PayPal payment");
      console.error("Capture Error:", err);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <p className="mb-4 text-gray-700 text-sm leading-relaxed">
        Pay securely using your <strong>Credit or Debit Card</strong> or a <strong>PayPal account</strong> below for the <strong>{planName}</strong> plan.
      </p>

      {isPending && (
        <p className="text-sm text-gray-500">⚙️ Loading payment options...</p>
      )}

      {!paid && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Pay via PayPal Account
            </label>
            <div className="border border-gray-300 rounded-md p-2">
              <PayPalButtons
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
          ✅ Payment successful. Thank you for subscribing!
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm font-medium">
          {error}
        </div>
      )}

      {/* Back Button */}
      <div className="pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:opacity-80"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
