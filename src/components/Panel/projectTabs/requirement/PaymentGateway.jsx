import { useState } from "react";
import PaymentPlans from "./payment/PaymentPlans";
import PaymentForm from "./payment/PaymentForm";

export default function PaymentGateway({ onSuccess, prevStep, projectData, featuresData }) {
  const [selectedPlan, setSelectedPlan] = useState(null); 
  const [availablePlans, setAvailablePlans] = useState([]); 

  const handlePaymentSubmit = (paymentInfo) => {
    console.log("Payment Data:", paymentInfo);
    alert("✅ Payment processed successfully!");
    onSuccess?.();
  };

  const selectedPlanObject = availablePlans.find((p) => p.name === selectedPlan);

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
      {selectedPlanObject && (
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Secure Payment
          </h2>
          <PaymentForm
            selectedPlan={selectedPlanObject}
            onSubmit={handlePaymentSubmit}
            onBack={prevStep}
          />
        </section>
      )}
    </div>
  );
}
