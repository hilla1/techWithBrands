import { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import axios from "axios";
import {
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

export default function MpesaFields({ selectedPlan, onBack, onSuccess }) {
  const [status, setStatus] = useState("idle");
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [callbackDetails, setCallbackDetails] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { backend } = useAuth();

  useEffect(() => {
    const calculateKESAmount = async () => {
      if (!selectedPlan?.price) return;
      setIsCalculating(true);
      try {
        const usd = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, "")) || 1;
        const { data } = await axios.get(`${backend}/exchange/usd-to-kes`);
        setAmount(Math.round(usd * (data?.rate || 150)));
      } catch {
        setAmount(Math.round((parseFloat(selectedPlan.price.replace(/[^0-9.]/g, "")) || 1) * 150));
        setAmount(1);
      } finally {
        setIsCalculating(false);
      }
    };
    calculateKESAmount();
  }, [selectedPlan, backend]);

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    if (!/^0\d{9}$/.test(phone)) {
      setStatus("failed");
      setErrorMessage("Please enter a valid Kenyan phone number (e.g., 0712345678)");
      return;
    }

    try {
      setStatus("sending");
      setErrorMessage("");
      setCallbackDetails(null);
      setPollAttempts(0);

      const { data } = await axios.post(`${backend}/mpesa/stk-push`, { phone, amount });
      if (data.success) {
        setCheckoutRequestId(data.data.CheckoutRequestID);
        setCallbackDetails({
          message: "STK Push sent to your phone. Please complete the payment.",
          details: data.data,
        });

        // Immediately set to waiting and begin polling
        setStatus("waiting");
      } else {
        throw new Error(data.message || "Failed to initiate payment");
      }
    } catch (err) {
      setStatus("failed");
      setErrorMessage(err?.response?.data?.message || err.message || "Payment failed.");
      setCallbackDetails({
        error: true,
        message: "Payment initiation error",
        details: err?.response?.data || err.message,
      });
    }
  };

  useEffect(() => {
    if (status !== "waiting" || !checkoutRequestId) return;

    const maxAttempts = 4;
    const interval = 10000;
    let attempts = 0;

    const intervalId = setInterval(async () => {
      try {
        const { data } = await axios.get(`${backend}/mpesa/transaction-status`, {
          params: { checkoutRequestId },
        });

        const resultDesc = data?.rawData?.callback?.Body?.stkCallback?.ResultDesc;
        const resultCode = data?.rawData?.callback?.Body?.stkCallback?.ResultCode;

        setCallbackDetails((prev) => ({
          ...prev,
          message: resultDesc || data.message,
          details: data,
        }));

        if (resultDesc !== undefined) {
          clearInterval(intervalId);

          if (data.success && data.status === "Completed" && resultCode === 0) {
            setStatus("success");
            setTimeout(() => onSuccess?.(amount), 2000);
          } else if (resultDesc.toLowerCase().includes("insufficient")) {
            setStatus("insufficient");
            setErrorMessage(resultDesc);
          } else {
            setStatus("failed");
            setErrorMessage(resultDesc);
          }
        } else {
          attempts++;
          setPollAttempts(attempts);
          if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            setStatus("timeout");
            setErrorMessage("Payment confirmation timed out.");
          }
        }
      } catch (err) {
        clearInterval(intervalId);
        setStatus("failed");
        setErrorMessage(err?.response?.data?.message || "Error checking payment status");
        setCallbackDetails({
          error: true,
          message: "Polling error",
          details: err?.response?.data || err.message,
        });
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [status, checkoutRequestId, backend, amount, onSuccess]);

  const resetPayment = () => {
    setStatus("idle");
    setCheckoutRequestId(null);
    setErrorMessage("");
    setCallbackDetails(null);
    setPollAttempts(0);
  };

  const statusConfig = {
    sending: {
      icon: <FaSpinner className="animate-spin text-4xl text-blue-500" />,
      message: "Sending STK Push to your phone...",
      showAction: false,
    },
    waiting: {
      icon: <FaSpinner className="animate-spin text-4xl text-blue-500" />,
      message: `Waiting for payment... (${pollAttempts}/5)`,
      showAction: false,
    },
    success: {
      icon: <FaCheckCircle className="text-4xl text-green-500" />,
      message: `Payment of KES ${amount.toLocaleString()} received`,
      showAction: true,
      actionText: "Continue",
    },
    failed: {
      icon: <FaTimesCircle className="text-4xl text-red-500" />,
      message: errorMessage,
      showAction: true,
      actionText: "Try Again",
    },
    timeout: {
      icon: <FaTimesCircle className="text-4xl text-yellow-500" />,
      message: errorMessage,
      showAction: true,
      actionText: "Retry Payment",
    },
    insufficient: {
      icon: <FaExclamationTriangle className="text-4xl text-orange-500" />,
      message: errorMessage,
      showAction: true,
      actionText: "Try Again",
    },
  };

  return (
    <form onSubmit={handleMpesaPayment} className="space-y-6 mt-4 relative">
      {status !== "idle" && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10 p-4">
          {statusConfig[status]?.icon}
          <p className="text-lg font-medium text-center mt-4">
            {statusConfig[status]?.message}
          </p>

          {status !== "success" && errorMessage && (
            <p className="text-sm text-red-600 mt-2 max-w-xs text-center">{errorMessage}</p>
          )}

          {callbackDetails?.details?.rawData?.callback?.Body?.stkCallback?.ResultDesc && !errorMessage && (
            <p className="text-sm text-gray-600 mt-2">
              {callbackDetails.details.rawData.callback.Body.stkCallback.ResultDesc}
            </p>
          )}

          {callbackDetails && (
            <div className="w-full max-w-md mt-4">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <FaInfoCircle className="mr-1" />
                {showDetails ? "Hide details" : "Show transaction details"}
              </button>

              {showDetails && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md text-left overflow-auto max-h-40">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(callbackDetails.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {statusConfig[status].showAction && (
            <button
              type="button"
              onClick={status === "success" ? () => onSuccess?.(amount) : resetPayment}
              className="mt-6 px-6 py-2 bg-[#2E3191] text-white rounded-md hover:opacity-90"
            >
              {statusConfig[status].actionText}
            </button>
          )}
        </div>
      )}

      <div>
        <label className="block font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
        <input
          type="tel"
          name="phone"
          placeholder="0712345678"
          className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
          disabled={status !== "idle"}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <p className="font-medium">Plan: {selectedPlan?.name}</p>
        <p className="text-gray-600">
          Amount: KES{" "}
          {isCalculating ? (
            <FaSpinner className="inline animate-spin ml-1" />
          ) : (
            amount.toLocaleString()
          )}
        </p>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={status !== "idle"}
          className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:opacity-80 disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={status !== "idle" || isCalculating}
          className={`px-6 py-3 font-semibold text-white rounded-md transition ${
            status !== "idle" || isCalculating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:opacity-90"
          }`}
        >
          {isCalculating ? (
            <span className="flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              Calculating...
            </span>
          ) : (
            `Pay KES ${amount.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
}
