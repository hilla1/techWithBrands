import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import ReusableModal from "../../reusable/ReusableModal";
import StepProgress from "./requirement/StepProgress";
import ProjectForm from "./requirement/ProjectForm";
import ChoosePlan from "./requirement/ChoosePlan";
import FeaturesForm from "./requirement/FeaturesForm";
import FileUpload from "./requirement/FileUpload";
import ReviewStep from "./requirement/ReviewStep";
import PaymentForm from "./requirement/payment/PaymentForm";
import EmailPrompt from "./requirement/EmailPrompt";
import ResponseModal from "../ResponseModal";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const STEPS = [
  { id: 1, name: "Project Description", description: "Tell us about your project" },
  { id: 2, name: "Feature List", description: "Define key features and requirements" },
  { id: 3, name: "File Upload", description: "Upload relevant documents and assets" },
  { id: 4, name: "Review", description: "Review and submit your requirements" },
  { id: 5, name: "Choose Plan", description: "Select a pricing plan" },
  { id: 6, name: "Payment", description: "Secure payment to proceed" },
];

export default function RequirementsModal({ isOpen, onClose }) {
  const { user, backend, isAuthenticated, checkAuthentication } = useAuth();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({});
  const [featuresData, setFeaturesData] = useState({ features: [], integrations: [] });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [response, setResponse] = useState(null);
  const hasRestoredSession = useRef(false);

  const sessionKey = user?.email ? `sessionData_${user.email}` : null;

  const next = () => {
    if (step >= 2 && !isAuthenticated) {
      setShowEmailPrompt(true);
      return;
    }
    if (step < STEPS.length) setStep(step + 1);
  };

  const back = () => step > 1 && setStep(step - 1);

  const handleSubmitProject = async () => {
    setLoading(true);
    try {
      const payload = {
        ...projectData,
        ...featuresData,
        files: uploadedFiles.map(file => ({
          name: file.name,
          size: file.size,
          url: file.url,
          publicId: file.publicId,
        })),
        projectId: projectId || undefined,
        plan: selectedPlan || undefined,
      };

      let res;
      if (projectId) {
        res = await axios.patch(`${backend}/project/update/${projectId}`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        res = await axios.post(`${backend}/project/create`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      }

      const { success, message, project } = res.data;

      if (!success) {
        setResponse({ success: false, message });
        return;
      }

      if (!projectId && project?._id) {
        setProjectId(project._id);
        sessionStorage.setItem("projectId", project._id);
      }

      setHasUnsavedChanges(false);
      setResponse({ success: true, message });
      if (step === 4) setStep(step + 1);
    } catch (err) {
      setResponse({
        success: false,
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    onClose();
  };

  useEffect(() => {
    if (
      isOpen &&
      isAuthenticated &&
      user?.email &&
      !hasRestoredSession.current
    ) {
      const stored = sessionStorage.getItem(sessionKey);
      const storedId = sessionStorage.getItem("projectId");

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProjectData(parsed.projectData || {});
          setFeaturesData(parsed.featuresData || { features: [], integrations: [] });
          setUploadedFiles(parsed.uploadedFiles || []);
          setSelectedPlan(parsed.selectedPlan || null);
          if (parsed.step) setStep(parsed.step);
        } catch (err) {
          console.error("Error parsing session data", err);
        }
      }

      if (storedId) {
        setProjectId(storedId);
      }

      hasRestoredSession.current = true;
    }
  }, [isOpen, isAuthenticated, user, sessionKey]);

  useEffect(() => {
    if (isAuthenticated && showEmailPrompt) {
      setShowEmailPrompt(false);
      if (step >= 2) setStep(step + 1);
    }
  }, [isAuthenticated, showEmailPrompt, step]);

  useEffect(() => {
    if (!isOpen && uploadedFiles.length > 0 && hasUnsavedChanges) {
      const deleteUnsavedFiles = async () => {
        for (const file of uploadedFiles) {
          if (file.publicId && !projectId) {
            try {
              await axios.post(
                `${backend}/file/delete`,
                { publicId: file.publicId },
                {
                  withCredentials: true,
                  headers: { "Content-Type": "application/json" },
                }
              );
            } catch (err) {
              console.error(`Failed to delete file "${file.name}":`, err.message);
            }
          }
        }
      };

      deleteUnsavedFiles().finally(() => {
        setStep(1);
        setProjectData({});
        setFeaturesData({ features: [], integrations: [] });
        setUploadedFiles([]);
        setShowEmailPrompt(false);
        setSelectedPlan(null);
        setProjectId(null);
        setResponse(null);
        setHasUnsavedChanges(false);
        if (sessionKey) sessionStorage.removeItem(sessionKey);
        sessionStorage.removeItem("projectId");
        hasRestoredSession.current = false;
      });
    }
  }, [isOpen, uploadedFiles, hasUnsavedChanges, backend, projectId, sessionKey]);

  const handlePaymentComplete = () => {
    alert("✅ Payment complete! Thank you.");
    onClose();
  };

  if (showEmailPrompt) {
    return (
      <EmailPrompt
        isOpen={isOpen}
        onClose={handleModalClose}
        backend={backend}
        projectData={projectData}
        featuresData={featuresData}
        checkAuthentication={checkAuthentication}
      />
    );
  }

  return (
    <>
      <ReusableModal isOpen={isOpen} onClose={handleModalClose} size="lg">
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-100 to-orange-100">
          <StepProgress currentStep={step} steps={STEPS} />
        </div>

        <div className="space-y-8 pb-4 text-sm sm:text-base md:text-lg">
          {step === 1 && (
            <div className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 rounded-lg">
              <ProjectForm
                defaultValues={projectData}
                onSubmit={(data) => {
                  setProjectData(data);
                  setHasUnsavedChanges(true);
                  sessionStorage.setItem(sessionKey, JSON.stringify({ ...projectData, step }));
                  next();
                }}
              />
            </div>
          )}

          {step === 2 && (
            <div className="bg-gradient-to-br from-white to-orange-50 p-4 sm:p-6 rounded-lg">
              <FeaturesForm
                featuresData={featuresData}
                setFeaturesData={(data) => {
                  setFeaturesData(data);
                  setHasUnsavedChanges(true);
                }}
                prevStep={back}
                onSubmit={(data) => {
                  setFeaturesData(data);
                  setHasUnsavedChanges(true);
                  next();
                }}
              />
            </div>
          )}

          {step === 3 && isAuthenticated && (
            <div className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 rounded-lg">
              <FileUpload
                uploadedFiles={uploadedFiles}
                setUploadedFiles={(files) => {
                  setUploadedFiles(files);
                  setHasUnsavedChanges(true);
                }}
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
                nextStep={handleSubmitProject}
              />
            </div>
          )}

          {step === 5 && isAuthenticated && (
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-lg">
              <ChoosePlan
                selectedPlan={selectedPlan}
                setSelectedPlan={(plan) => {
                  setSelectedPlan(plan);
                  setHasUnsavedChanges(true);
                }}
                setAvailablePlans={setAvailablePlans}
                onBack={back}
                onPayLater={async () => {
                  await handleSubmitProject();
                  onClose();
                }}
                onPayNow={() => setStep(6)}
                projectData={projectData}
                featuresData={featuresData}
              />
            </div>
          )}

          {step === 6 && isAuthenticated && (
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg">
              <PaymentForm
                selectedPlan={selectedPlan}
                onSubmit={handlePaymentComplete}
                onBack={() => setStep(5)}
                onClose={handlePaymentComplete}
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

      {response && (
        <ResponseModal
          response={response}
          onClose={() => setResponse(null)}
        />
      )}
    </>
  );
}
