import { useForm } from "react-hook-form";
import { FiCreditCard } from "react-icons/fi";
import { FaPaypal, FaStripe, FaMobileAlt } from "react-icons/fa";
import { useState } from "react";
import StripeFields from "./StripeFields";
import MpesaFields from "./MpesaFields";
import PaypalNote from "./PaypalNote";

export default function PaymentForm({ selectedPlan, onSubmit, onBack }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { paymentMethod: "stripe" },
  });

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const paymentMethod = watch("paymentMethod");

  const planName = selectedPlan?.name || "Selected";
  const planPrice = selectedPlan?.price || "$0";
  const planPeriod = selectedPlan?.period || "";

  const handleSuccess = (paymentIntent) => {
    setStatus("success");
    setMessage("✅ Payment successful!");
    console.log("PaymentIntent:", paymentIntent);
    onSubmit?.();
  };

  const handleError = (msg) => {
    setStatus("error");
    setMessage(msg || "❌ Payment failed. Please try again.");
  };

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
    <div className="bg-white rounded-xl max-w-3xl mx-auto px-6 py-8 border border-gray-100 shadow-md">
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
              <label
                key={option.id}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md cursor-pointer border text-center transition text-sm ${
                  paymentMethod === option.id
                    ? "bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white font-semibold"
                    : "border-gray-300 bg-white text-gray-700 hover:border-[#2E3191]"
                }`}
              >
                <input
                  type="radio"
                  value={option.id}
                  {...register("paymentMethod")}
                  className="hidden"
                />
                {option.icon}
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Conditional Fields */}
        {paymentMethod === "stripe" && selectedPlan && (
          <StripeFields
            selectedPlan={selectedPlan}
            onPaymentSuccess={handleSuccess}
            onPaymentError={handleError}
            onBack={onBack}
          />
        )}

        {paymentMethod === "mpesa" && (
          <MpesaFields
            register={register}
            errors={errors}
            onBack={onBack}
            selectedPlan={selectedPlan}
          />
        )}

        {paymentMethod === "paypal" && (
          <PaypalNote
            selectedPlan={selectedPlan}
            onSubmit={handleSuccess}
            onBack={onBack}
          />
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
