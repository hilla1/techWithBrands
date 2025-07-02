import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ReusableModal from "../../../reusable/ReusableModal";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import LoginModal from '../../../Auth/LoginModal';

export default function EmailPrompt({
  isOpen,
  onClose,
  backend,
  projectData,
  featuresData,
  checkAuthentication,
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navigate = useNavigate();

  const checkEmail = async () => {
    try {
      const res = await axios.post(`${backend}/consultation/check-email`, {
        email,
      });
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Server error",
      };
    }
  };

  const storeSessionData = () => {
    const sessionData = {
      projectData,
      featuresData,
      ...(step === 2 && !userExists && {
        fullName,
        password,
      }),
    };
    sessionStorage.setItem(`sessionData_${email}`, JSON.stringify(sessionData));
  };

  const handleEmailSubmit = async () => {
    if (!email) return setError("Email is required");
    setLoading(true);
    setError("");

    const result = await checkEmail();
    setLoading(false);

    if (result.success) {
      setUserExists(true);
      setStep(2);
    } else if (result.message === "User does not exist") {
      setUserExists(false);
      setSubStep(1);
      setStep(2);
    } else {
      setError(result.message || "Error verifying email");
    }
  };

  const handleFinalSubmit = async () => {
    if (!fullName || !password || !confirmPassword) {
      return setError("All fields are required");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${backend}/auth/register`,
        { email, name: fullName, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        storeSessionData(); // Store only after successful registration
        await checkAuthentication();
        navigate("/dashboard"); 
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ReusableModal isOpen={isOpen} onClose={onClose}>
        <div className="p-2 bg-white">
          {step === 1 ? (
            <>
              <h2 className="text-lg font-semibold mb-4 text-orange-600">
                Continue with Email
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                You need to verify your email to proceed to the next step.
              </p>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

              <button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="mt-3 w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white py-2 px-4 rounded flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4 text-orange-600">
                {userExists ? "Continue with your account" : "Almost there!"}
              </h2>

              {userExists ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    We found an account with this email. Please continue with your
                    account.
                  </p>
                  {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        storeSessionData(); // Store only when user clicks login
                        setLoginModalOpen(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white py-2 px-4 rounded transition-colors"
                    >
                      Login
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {subStep === 1 && (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Please enter your full name.
                      </p>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </>
                  )}

                  {subStep === 2 && (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Please create a password.
                      </p>
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </>
                  )}

                  {subStep === 3 && (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Confirm your password.
                      </p>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </>
                  )}

                  {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        subStep === 1 ? setStep(1) : setSubStep(subStep - 1)
                      }
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors"
                    >
                      Back
                    </button>

                    {subStep < 3 ? (
                      <button
                        onClick={() => {
                          if (
                            (subStep === 1 && !fullName) ||
                            (subStep === 2 && !password)
                          ) {
                            setError("This field is required");
                          } else {
                            setError("");
                            setSubStep(subStep + 1);
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white py-2 px-4 rounded transition-colors"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white py-2 px-4 rounded transition-colors"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <FaSpinner className="animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </ReusableModal>
      <LoginModal
        isOpen={loginModalOpen}
        email={email}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
