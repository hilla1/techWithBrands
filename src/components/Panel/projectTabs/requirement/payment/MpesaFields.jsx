import { useState, useRef } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import axios from "axios";
import io from "socket.io-client";
import {
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function MpesaFields({ register, errors, onBack, selectedPlan, onSuccess }) {
  const [status, setStatus] = useState("idle");
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [waitingMessage, setWaitingMessage] = useState("");
  const socketRef = useRef(null);
  const { backend } = useAuth();

  const convertToKES = async (usdAmount) => {
    try {
      const { data: rateRes } = await axios.get(`${backend}/exchange/usd-to-kes`);
      return Math.round(usdAmount * (rateRes?.rate || 150));
    } catch (err) {
      console.error("Conversion error:", err);
      return Math.round(usdAmount * 150);
    }
  };

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;

    if (!phone || !/^0\d{9}$/.test(phone)) {
      setStatus("failed");
      return;
    }

    try {
      setStatus("sending");
      setWaitingMessage("Waiting for you to enter your M-Pesa PIN...");

      const usdAmount = parseFloat(selectedPlan?.price?.replace(/[^0-9.]/g, "")) || 1;
      const kesAmount = await convertToKES(usdAmount);
      setAmount(kesAmount);

      const { data } = await axios.post(`${backend}/mpesa/stk-push`, {
        phone,
        amount: kesAmount,
      });

      if (data.success) {
        const requestId = data.data.CheckoutRequestID;
        setCheckoutRequestId(requestId);
        setStatus("waiting");

        if (!socketRef.current) {
          socketRef.current = io(backend, {
            transports: ["websocket"],
            withCredentials: true,
          });

          socketRef.current.on("connect", () => {
            socketRef.current.emit("join", requestId); // 🔁 Correct event name to match backend
          });

          // Listen to the same event the backend emits:
          socketRef.current.on("statusUpdate", (payload) => {
            if (payload.checkoutRequestID !== requestId) return;

            const code = payload.resultCode;
            const statusMap = {
              0: "success",
              1: "insufficient",
              1032: "failed",
              2001: "timeout",
            };

            const resolvedStatus = statusMap[code] || "failed";
            setStatus(resolvedStatus);

            if (resolvedStatus === "success") {
              setTimeout(() => onSuccess?.(kesAmount), 2000);
            }

            // Cleanup
            socketRef.current?.disconnect();
            socketRef.current = null;
          });
        }
      } else {
        throw new Error(data.message || "Payment initiation failed");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      const msg = err.response?.data?.message?.toLowerCase() || "";
      setStatus(msg.includes("insufficient") ? "insufficient" : "failed");
    }
  };

  const resetPayment = () => {
    setStatus("idle");
    setCheckoutRequestId(null);
    setWaitingMessage("");
    socketRef.current?.disconnect();
    socketRef.current = null;
  };

  const statusConfig = {
    sending: {
      icon: <FaSpinner className="animate-spin text-4xl text-blue-500" />,
      message: "Sending payment request to your phone...",
      showAction: false,
    },
    waiting: {
      icon: <FaSpinner className="animate-spin text-4xl text-blue-500" />,
      message: waitingMessage,
      showAction: false,
    },
    success: {
      icon: <FaCheckCircle className="text-4xl text-green-500" />,
      message: `Payment of KES ${amount} successful!`,
      showAction: true,
      actionText: "Continue",
    },
    failed: {
      icon: <FaTimesCircle className="text-4xl text-red-500" />,
      message: "Payment failed or was cancelled. Please try again.",
      showAction: true,
      actionText: "Try Again",
    },
    timeout: {
      icon: <FaTimesCircle className="text-4xl text-yellow-500" />,
      message: "Payment timed out. Please check your phone.",
      showAction: true,
      actionText: "Retry",
    },
    insufficient: {
      icon: <FaExclamationTriangle className="text-4xl text-orange-500" />,
      message: (
        <div className="text-center">
          <p>Insufficient M-Pesa balance for KES {amount} payment.</p>
          <p className="mt-2 font-semibold">Please top up and try again.</p>
        </div>
      ),
      showAction: true,
      actionText: "Try Again After Top Up",
    },
  };

  return (
    <form onSubmit={handleMpesaPayment} className="space-y-6 mt-4 relative">
      {status !== "idle" && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10 p-4">
          {statusConfig[status].icon}
          <div className="text-lg font-medium text-center mt-4">
            {statusConfig[status].message}
          </div>
          {statusConfig[status].showAction && (
            <button
              type="button"
              onClick={status === "success" ? () => onSuccess?.(amount) : resetPayment}
              className={`mt-6 px-6 py-2 text-white rounded-md hover:opacity-90 ${
                status === "insufficient" ? "bg-orange-500" : "bg-[#2E3191]"
              }`}
            >
              {statusConfig[status].actionText}
            </button>
          )}
        </div>
      )}

      <div>
        <label className="block font-medium text-gray-700 mb-1">
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="0712345678"
          {...register("phone")}
          className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
          disabled={status !== "idle"}
        />
        {errors?.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
        )}
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
          disabled={status !== "idle"}
          className={`px-6 py-3 font-semibold text-white rounded-md transition ${
            status !== "idle"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:opacity-90"
          }`}
        >
          Pay with M-Pesa
        </button>
      </div>
    </form>
  );
}
