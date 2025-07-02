import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import ReusableModal from "../../reusable/ReusableModal";
import StepProgress from "./requirement/StepProgress";
import ProjectForm from "./requirement/ProjectForm";
import FeaturesForm from "./requirement/FeaturesForm";
import FileUpload from "./requirement/FileUpload";
import ReviewStep from "./requirement/ReviewStep";
import PaymentGateway from "./requirement/PaymentGateway";
import EmailPrompt from "./requirement/EmailPrompt";
import { FaSpinner } from "react-icons/fa";

const STEPS = [
  { id: 1, name: "Project Description", description: "Tell us about your project" },
  { id: 2, name: "Feature List", description: "Define key features and requirements" },
  { id: 3, name: "File Upload", description: "Upload relevant documents and assets" },
  { id: 4, name: "Review", description: "Review and submit your requirements" },
  { id: 5, name: "Payment", description: "Secure payment to proceed" },
];

export default function RequirementsModal({ isOpen, onClose }) {
  const { user, backend, isAuthenticated, checkAuthentication } = useAuth();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({});
  const [featuresData, setFeaturesData] = useState({ features: [], integrations: [] });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasRestoredSession = useRef(false);

  const next = () => {
    if (step >= 2 && !isAuthenticated) {
      setShowEmailPrompt(true);
      return;
    }
    if (step < STEPS.length) setStep(step + 1);
  };

  const back = () => step > 1 && setStep(step - 1);

  // Restore session data, jump to step 3, and clear session storage
  useEffect(() => {
    if (
      isOpen &&
      isAuthenticated &&
      user?.email &&
      !hasRestoredSession.current
    ) {
      const sessionKey = `sessionData_${user.email}`;
      const stored = sessionStorage.getItem(sessionKey);

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProjectData(parsed.projectData || {});
          setFeaturesData(parsed.featuresData || { features: [], integrations: [] });
          setStep(3); // Jump to step 3
          sessionStorage.removeItem(sessionKey); //  Immediately clear after restoring
        } catch (err) {
          console.error("Error parsing session data", err);
        }
      }
      hasRestoredSession.current = true;
    }
  }, [isOpen, isAuthenticated, user]);

  // Close email prompt when authentication is successful
  useEffect(() => {
    if (isAuthenticated && showEmailPrompt) {
      setShowEmailPrompt(false);
      if (step >= 2) setStep(step + 1);
    }
  }, [isAuthenticated, showEmailPrompt, step]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setShowEmailPrompt(false);
      hasRestoredSession.current = false;
    }
  }, [isOpen]);

  //  Handle payment complete 
  const handlePaymentComplete = () => {
    alert("✅ Payment complete! Thank you.");
    onClose();
  };

  if (showEmailPrompt) {
    return (
      <EmailPrompt
        isOpen={isOpen}
        onClose={() => {
          setShowEmailPrompt(false);
          onClose();
        }}
        backend={backend}
        projectData={projectData}
        featuresData={featuresData}
        checkAuthentication={checkAuthentication}
      />
    );
  }

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} size="lg">
      {/* Progress Header */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-100 to-orange-100">
        <StepProgress currentStep={step} steps={STEPS} />
      </div>

      {/* Step Content */}
      <div className="space-y-8 pb-4 text-sm sm:text-base md:text-lg">
        {step === 1 && (
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 rounded-lg">
            <ProjectForm
              defaultValues={projectData}
              onSubmit={(data) => {
                setProjectData(data);
                next();
              }}
            />
          </div>
        )}

        {step === 2 && (
          <div className="bg-gradient-to-br from-white to-orange-50 p-4 sm:p-6 rounded-lg">
            <FeaturesForm
              featuresData={featuresData}
              setFeaturesData={setFeaturesData}
              prevStep={back}
              onSubmit={(data) => {
                setFeaturesData(data);
                next();
              }}
            />
          </div>
        )}

        {step === 3 && isAuthenticated && (
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 rounded-lg">
            <FileUpload
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              prevStep={back}
              nextStep={next}
            />
          </div>
        )}

        {step === 4 && isAuthenticated && (
          <div className="bg-gradient-to-br from-white to-orange-50 p-4 sm:p-6 rounded-lg">
            <ReviewStep
              projectData={projectData}
              featuresData={featuresData}
              uploadedFiles={uploadedFiles}
              prevStep={back}
              nextStep={next}
            />
          </div>
        )}

        {step === 5 && isAuthenticated && (
          <div className="bg-gradient-to-br from-white to-blue-50 sm:p-6 rounded-lg">
            <PaymentGateway
              projectData={projectData}
              featuresData={featuresData}
              onClose={handlePaymentComplete}
              prevStep={back}
            />
          </div>
        )}

        {loading && (
          <div className="flex justify-center p-4">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        )}
      </div>
    </ReusableModal>
  );
}
