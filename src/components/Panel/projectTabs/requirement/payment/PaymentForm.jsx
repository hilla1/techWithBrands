import { useState } from "react";
import { FiCreditCard } from "react-icons/fi";
import { FaPaypal, FaStripe, FaMobileAlt } from "react-icons/fa";
import StripeFields from "./StripeFields";
import MpesaFields from "./MpesaFields";
import PaypalNote from "./PaypalNote";

export default function PaymentForm({ selectedPlan, onBack, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const planName = selectedPlan?.name || "Selected";
  const planPrice = selectedPlan?.price || "$0";
  const planPeriod = selectedPlan?.period || "";

  const methodOptions = [
    {
      id: "stripe",
      label: "Credit/Debit Card",
      icon: <FaStripe className="text-[#635bff] w-5 h-5" />,
    },
    {
      id: "mpesa",
      label: "M-Pesa",
      icon: <FaMobileAlt className="text-green-600 w-5 h-5" />,
    },
    {
      id: "paypal",
      label: "PayPal/Bank Card",
      icon: <FaPaypal className="text-[#003087] w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white rounded-xl mx-auto px-4 py-4 border border-gray-100 shadow-md">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FiCreditCard className="h-8 w-8 text-[#2E3191]" />
          <h2 className="text-2xl font-bold text-gray-800">Secure Payment</h2>
        </div>
        <p className="text-sm text-gray-500">
          Subscribe to the <strong>{planName}</strong> plan
        </p>
      </div>

      {/* Plan Summary */}
      <div className="bg-gradient-to-r from-[#f0f3ff] to-[#fff7f1] p-5 rounded-lg border mb-8">
        <div className="flex justify-between flex-col sm:flex-row gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {planName} Plan
            </h3>
            <p className="text-sm text-gray-600">
              {selectedPlan?.description || "Custom project plan"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{planPrice}</div>
            <span className="text-sm text-gray-500">{planPeriod}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {methodOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPaymentMethod(option.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md w-full text-sm transition ${
                  paymentMethod === option.id
                    ? "bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white font-semibold"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-[#2E3191]"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Fields */}
        {paymentMethod === "stripe" && selectedPlan && (
          <StripeFields selectedPlan={selectedPlan} onBack={onBack} onClose={onClose} />
        )}

        {paymentMethod === "mpesa" && (
          <MpesaFields selectedPlan={selectedPlan} onBack={onBack} onClose={onClose} />
        )}

        {paymentMethod === "paypal" && (
          <PaypalNote selectedPlan={selectedPlan} onBack={onBack} onClose={onClose} />
        )}

        {/* Status Message */}
        {status && (
          <div
            className={`text-center font-medium px-4 py-3 rounded-md ${
              status === "success"
                ? "text-green-700 bg-green-50 border border-green-300"
                : "text-red-700 bg-red-50 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-6 text-gray-500 text-xs">
        🔒 Your payment is encrypted and securely processed.
      </div>
    </div>
  );
}
