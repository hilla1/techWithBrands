import { useState } from "react";
import ReusableModal from "../../reusable/ReusableModal";
import StepProgress from "./requirement/StepProgress";
import ProjectForm from "./requirement/ProjectForm";
import FeaturesForm from "./requirement/FeaturesForm";
import FileUpload from "./requirement/FileUpload";
import ReviewStep from "./requirement/ReviewStep";
import PaymentGateway from "./requirement/PaymentGateway";

// Steps configuration
const STEPS = [
  { id: 1, name: "Project Description", description: "Tell us about your project" },
  { id: 2, name: "Feature List", description: "Define key features and requirements" },
  { id: 3, name: "File Upload", description: "Upload relevant documents and assets" },
  { id: 4, name: "Review", description: "Review and submit your requirements" },
  { id: 5, name: "Payment", description: "Secure payment to proceed" },
];

export default function RequirementsModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({});
  const [featuresData, setFeaturesData] = useState({ features: [], integrations: [] });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const next = () => step < STEPS.length && setStep(step + 1);
  const back = () => step > 1 && setStep(step - 1);

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

        {step === 3 && (
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 rounded-lg">
            <FileUpload
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              prevStep={back}
              nextStep={next}
            />
          </div>
        )}

        {step === 4 && (
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

        {step === 5 && (
          <div className="bg-gradient-to-br from-white to-blue-50 sm:p-6 rounded-lg">
            <PaymentGateway
              projectData={projectData}
              featuresData={featuresData}
              onClose={() => {
                alert("✅ Payment complete! Thank you.");
                onClose();
              }}
              prevStep={back}
            />
          </div>
        )}
      </div>
    </ReusableModal>
  );
}
