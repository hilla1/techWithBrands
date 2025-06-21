import { PayPalButtons, usePayPalScriptReducer, FUNDING } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";

export default function PaypalNote({ selectedPlan }) {
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
      } else {
        setError("⚠️ Payment was not completed");
      }
    } catch (err) {
      setError("❌ Failed to capture PayPal payment");
      console.error("Capture Error:", err);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md text-sm text-yellow-800">
      <p className="mb-3">
        You can pay securely using your <strong>Credit or Debit Card</strong> or a <strong>PayPal account</strong> below.
      </p>

      {isPending && <p className="text-gray-500">⚙️ Loading payment options...</p>}

      {!paid && (
        <>
          {/* PayPal Button (PayPal Account) */}
          <div className="mb-4">
            <PayPalButtons
              fundingSource={FUNDING.PAYPAL}
              style={{
                layout: "horizontal",
                label: "paypal",
              }}
              createOrder={createOrder}
              onApprove={handleApproval}
              onError={(err) => {
                setError("❌ PayPal error occurred");
                console.error("PayPal Button Error:", err);
              }}
            />
          </div>

          {/* Card Button via PayPal */}
          <div>
            <PayPalButtons
              fundingSource={FUNDING.CARD}
              style={{
                layout: "horizontal",
                label: "pay",
                height: 45,
              }}
              createOrder={createOrder}
              onApprove={handleApproval}
              onError={(err) => {
                setError("❌ Card payment error occurred");
                console.error("Card Payment Error:", err);
              }}
            />
          </div>
        </>
      )}

      {paid && (
        <div className="mt-3 text-green-600 font-medium">
          ✅ Payment complete. Thank you!
        </div>
      )}

      {error && (
        <div className="mt-3 text-red-600 font-medium">{error}</div>
      )}
    </div>
  );
}
