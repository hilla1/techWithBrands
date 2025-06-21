import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiCreditCard } from "react-icons/fi";
import { FaPaypal, FaMobileAlt } from "react-icons/fa";
import MpesaFields from "./MpesaFields";
import PaypalNote from "./PaypalNote";
import { paymentSchema } from "./schemas";

export default function PaymentForm({ selectedPlan, onSubmit, onBack }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: "paypal" }, 
  });

  const paymentMethod = watch("paymentMethod");

  const methodOptions = [
    {
      id: "paypal",
      label: "Credit/Debit Card / PayPal",
      icon: <FaPaypal className="text-[#003087] w-5 h-5" />,
    },
    {
      id: "mpesa",
      label: "M-Pesa",
      icon: <FaMobileAlt className="text-green-600 w-5 h-5" />,
    },
  ];

  const planName = selectedPlan?.name || "Selected";
  const planPrice = selectedPlan?.price || "$0";
  const planPeriod = selectedPlan?.period || "";

  return (
    <div className="bg-white rounded-xl max-w-3xl mx-auto px-4 sm:px-6 py-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FiCreditCard className="h-8 w-8 text-[#2E3191]" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Secure Payment
          </h2>
        </div>
        <p className="text-sm text-gray-500">
          Subscribe to the <strong>{planName}</strong> plan
        </p>
      </div>

      {/* Plan Summary */}
      <div className="bg-gradient-to-r from-[#f0f3ff] to-[#fff7f1] p-5 rounded-lg border mb-8">
        <div className="flex justify-between flex-col sm:flex-row gap-4 sm:gap-0">
          <div>
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
              {planName} Plan
            </h3>
            <p className="text-sm text-gray-500">{selectedPlan?.description || "Custom project plan"}</p>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              {planPrice}
              <span className="text-sm font-normal text-gray-500">
                {planPeriod}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        {/* Payment Method Selector */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {methodOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-center gap-2 border px-4 py-2 rounded-md text-center cursor-pointer transition ${
                  paymentMethod === option.id
                    ? "bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white font-semibold"
                    : "border-gray-300 bg-white text-gray-700"
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
          {errors.paymentMethod && (
            <p className="text-red-600 mt-1">{errors.paymentMethod.message}</p>
          )}
        </div>

        {/* Conditional Fields */}
        {paymentMethod === "paypal" && (
          <PaypalNote selectedPlan={selectedPlan} />
        )}
        {paymentMethod === "mpesa" && (
          <MpesaFields register={register} errors={errors} />
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:opacity-80"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white font-semibold rounded-md hover:opacity-90 transition"
          >
            {paymentMethod === "paypal"
              ? "Pay with Card or PayPal"
              : `Complete Payment – ${planPrice}${planPeriod}`}
          </button>
        </div>
      </form>

      <div className="text-center mt-6 text-gray-500 text-xs">
        🔒 Your payment is encrypted and securely processed.
      </div>
    </div>
  );
}
