import { useState } from "react";
import PaymentPlans from "./payment/PaymentPlans";
import PaymentForm from "./payment/PaymentForm";

export default function PaymentGateway({
  onClose,
  prevStep,
  projectData,
  featuresData,
}) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);

  // Handle when payment completes and modal should be closed
  const handlePaymentClose = () => {
    console.log("✅ Payment completed and modal will close.");
    alert("✅ Payment processed successfully!");
    onClose?.(); // Close modal
  };

  return (
    <div className="space-y-12 text-sm sm:text-base break-words">
      {/* Plan Selection Section */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
          Choose a Plan
        </h2>
        <PaymentPlans
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          setAvailablePlans={setAvailablePlans}
          projectData={projectData}
          featuresData={featuresData}
        />
      </section>

      {/* Payment Form Section */}
      {selectedPlan && (
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Secure Payment
          </h2>
          <PaymentForm
            selectedPlan={selectedPlan}
            onSubmit={handlePaymentClose}
            onBack={prevStep}
            onClose={onClose} 
          />
        </section>
      )}
    </div>
  );
}
