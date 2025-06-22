import { useMemo } from "react";
import ReusableModal from "./ReusableModal";
import PaymentForm from "../Panel/projectTabs/requirement/payment/PaymentForm";

export default function PaymentModal({ amount, description, isOpen, onClose }) {
  const selectedPlan = useMemo(() => {
    return {
      name: description || "Custom Payment",
      description: "Payment for: " + description,
      price: `$${parseFloat(amount).toFixed(2)}`,
      period: "",
    };
  }, [amount, description]);

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} size="lg">
      <PaymentForm
        selectedPlan={selectedPlan}
        onBack={onClose}
        onClose={onClose}
      />
    </ReusableModal>
  );
}
