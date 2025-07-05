import { FiArrowLeft } from "react-icons/fi";
import PaymentPlans from "./payment/PaymentPlans";

export default function ChoosePlan({
  selectedPlan,
  setSelectedPlan,
  setAvailablePlans,
  onBack,
  onPayLater,
  onPayNow,
  projectData,
  featuresData,
}) {
  return (
    <div className="px-3 py-4 sm:px-4 sm:py-5 space-y-4 text-sm sm:text-base">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
        >
          <FiArrowLeft className="mr-1" /> Back
        </button>
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
        Choose a Plan
      </h2>

      {/* Pricing Plans */}
      <PaymentPlans
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        setAvailablePlans={setAvailablePlans}
        projectData={projectData}
        featuresData={featuresData}
      />

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPayLater}
          className="text-gray-700 font-medium hover:underline"
        >
          Pay Later
        </button>

        <button
          onClick={onPayNow}
          disabled={!selectedPlan}
          className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-md text-white font-medium transition ${
            selectedPlan
              ? "bg-gradient-to-r from-blue-500 to-orange-400 hover:opacity-90"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
