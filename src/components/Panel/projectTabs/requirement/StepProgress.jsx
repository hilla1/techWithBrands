import { FiCheck } from "react-icons/fi";

export default function StepProgress({ currentStep, steps }) {
  const step = steps.find((s) => s.id === currentStep);

  return (
    <div className="mb-6 flex items-center space-x-4 sm:space-x-6">
      {/* Step Circle */}
      <div
        className={`
          w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2
          ${
            currentStep > step.id
              ? "bg-gradient-to-r from-blue-400 to-orange-300 border-transparent text-white"
              : "border-blue-500 text-blue-600 bg-white"
          }
        `}
      >
        {currentStep > step.id ? (
          <FiCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <span className="font-medium text-base sm:text-lg">{step.id}</span>
        )}
      </div>

      {/* Step Details */}
      <div>
        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
          {step.name}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">{step.description}</p>
      </div>
    </div>
  );
}
