import { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

export default function MpesaFields({ register, errors, onBack, selectedPlan }) {
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'success', 'failed', 'cancelled'
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [pollingCount, setPollingCount] = useState(0);
  const { backend } = useAuth();

  // Poll for payment status
  useEffect(() => {
    if (!checkoutRequestId || pollingCount === 0) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${backend}/mpesa/transaction-status`, {
          params: { checkoutRequestId }
        });

        if (data.status === 'Completed') {
          setPaymentStatus('success');
          clearInterval(pollInterval);
        } else if (data.status === 'Cancelled') {
          setPaymentStatus('cancelled');
          clearInterval(pollInterval);
        } else if (pollingCount >= 12) { // Stop after 2 minutes (12*10s)
          setPaymentStatus('timeout');
          clearInterval(pollInterval);
        }
        setPollingCount(prev => prev + 1);
      } catch (err) {
        console.error("Polling error:", err);
        if (pollingCount >= 12) {
          setPaymentStatus('timeout');
          clearInterval(pollInterval);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(pollInterval);
  }, [checkoutRequestId, pollingCount, backend]);

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentStatus('pending');
    setPollingCount(1);

    const formData = new FormData(e.target);
    const phone = formData.get("phone");

    if (!phone || !/^0\d{9}$/.test(phone)) {
      setPaymentStatus('failed');
      setProcessing(false);
      return;
    }

    try {
      const usdAmount = parseFloat(selectedPlan?.price?.replace(/[^0-9.]/g, "")) || 1;
      const { data: rateRes } = await axios.get(`${backend}/exchange/usd-to-kes`);
      const kesAmount = Math.round(usdAmount * (rateRes?.rate || 150));

      const { data } = await axios.post(`${backend}/mpesa/stk-push`, {
        phone,
        amount: kesAmount,
      });

      if (data.success) {
        setCheckoutRequestId(data.data.CheckoutRequestID);
      } else {
        throw new Error(data.message || "Payment initiation failed.");
      }
    } catch (err) {
      console.error("Mpesa Error:", err);
      setPaymentStatus('failed');
      setProcessing(false);
    }
  };

  const resetPayment = () => {
    setProcessing(false);
    setPaymentStatus(null);
    setCheckoutRequestId(null);
    setPollingCount(0);
  };

  const statusMessages = {
    pending: "Enter your M-Pesa PIN to complete payment...",
    success: "✅ Payment completed successfully!",
    failed: "❌ Payment failed. Please try again.",
    cancelled: "❌ Payment was cancelled.",
    timeout: "⌛ Payment timed out. Check your M-Pesa messages."
  };

  return (
    <form onSubmit={handleMpesaPayment} className="space-y-6 mt-4 relative">
      {/* Loading Overlay */}
      {processing && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10">
          <FaSpinner className="animate-spin text-4xl text-[#2E3191] mb-4" />
          <p className="text-lg font-medium">
            {paymentStatus === 'pending' 
              ? "Waiting for payment confirmation..." 
              : statusMessages[paymentStatus]}
          </p>
          {(paymentStatus === 'success' || 
            paymentStatus === 'failed' || 
            paymentStatus === 'cancelled' ||
            paymentStatus === 'timeout') && (
            <button
              type="button"
              onClick={resetPayment}
              className="mt-4 px-4 py-2 bg-[#2E3191] text-white rounded-md"
            >
              {paymentStatus === 'success' ? 'Continue' : 'Try Again'}
            </button>
          )}
        </div>
      )}

      {/* Phone Input (disabled during processing) */}
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
          disabled={processing}
        />
        {errors?.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:opacity-80 disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          type="submit"
          disabled={processing}
          className={`px-6 py-3 font-semibold text-white rounded-md transition ${
            processing
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