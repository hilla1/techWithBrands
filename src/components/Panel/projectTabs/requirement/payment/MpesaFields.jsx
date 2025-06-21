import { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import axios from "axios";

export default function MpesaFields({ register, errors, onBack, selectedPlan }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { backend } = useAuth();

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target);
    const phone = formData.get("phone");

    // Validate phone number format
    if (!phone || !/^0\d{9}$/.test(phone)) {
      setError("❌ Enter a valid Safaricom number starting with 07 or 01");
      setProcessing(false);
      return;
    }

    try {
      // Get USD amount from selected plan
      const usdAmount = parseFloat(selectedPlan?.price?.replace(/[^0-9.]/g, "")) || 1;

      // Fetch exchange rate from backend
      const { data: rateRes } = await axios.get(`${backend}/exchange/usd-to-kes`);
      const kesRate = rateRes?.rate;

      if (!kesRate) {
        throw new Error("Exchange rate not available.");
      }   

      // Convert USD to KES and round to nearest whole number
      const kesAmount = Math.round(usdAmount * kesRate);
      console.log(kesAmount);

      // Send M-Pesa STK push
      const { data } = await axios.post(`${backend}/mpesa/stk-push`, {
        phone,
        amount: kesAmount,
      });

      if (data.success) {
        setSuccess("✅ Payment initiated successfully. Complete it on your phone.");
      } else {
        throw new Error(data.message || "Payment initiation failed.");
      }
    } catch (err) {
      console.error("Mpesa Error:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to process Mpesa payment.";
      setError("❌ " + errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleMpesaPayment} className="space-y-6 mt-4">
      {/* Phone Input */}
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-md px-4 py-2 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 rounded-md px-4 py-2 text-sm font-medium">
          {success}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:opacity-80"
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
          {processing ? "Processing..." : "Pay with M-Pesa"}
        </button>
      </div>
    </form>
  );
}
