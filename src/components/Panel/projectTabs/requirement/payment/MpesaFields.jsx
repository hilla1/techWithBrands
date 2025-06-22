import { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import axios from "axios";
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

export default function MpesaFields({ register, errors, onBack, selectedPlan, onSuccess }) {
  const [status, setStatus] = useState('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [callbackDetails, setCallbackDetails] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { backend } = useAuth();

  // Calculate KES amount when component mounts or plan changes
  useEffect(() => {
    const calculateKESAmount = async () => {
      if (!selectedPlan?.price) return;
      
      setIsCalculating(true);
      try {
        const usdAmount = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, "")) || 1;
        const kesAmount = await convertToKES(usdAmount);
        setAmount(kesAmount);
      } catch (err) {
        console.error("Amount calculation error:", err);
        const usdAmount = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, "")) || 1;
        setAmount(Math.round(usdAmount * 150));
      } finally {
        setIsCalculating(false);
      }
    };

    calculateKESAmount();
  }, [selectedPlan, backend]);

  // Convert USD to KES
  const convertToKES = async (usdAmount) => {
    try {
      const { data: rateRes } = await axios.get(`${backend}/exchange/usd-to-kes`);
      return Math.round(usdAmount * (rateRes?.rate || 150));
    } catch (err) {
      console.error("Conversion error:", err);
      return Math.round(usdAmount * 150);
    }
  };

  // Handle STK Push
  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;

    if (!phone || !/^0\d{9}$/.test(phone)) {
      setStatus('failed');
      setErrorMessage('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    try {
      setStatus('sending');
      setErrorMessage('');
      setPollAttempts(0);
      setCallbackDetails(null);

      const { data } = await axios.post(`${backend}/mpesa/stk-push`, {
        phone,
        amount,
      });

      if (data.success) {
        setCheckoutRequestId(data.data.CheckoutRequestID);
        setStatus('waiting');
        setCallbackDetails({
          message: "STK Push initiated successfully",
          details: data.data
        });
      } else {
        throw new Error(data.message || "Payment initiation failed");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setStatus('failed');
      setErrorMessage(err.response?.data?.message || err.message || "Payment failed. Please try again.");
      setCallbackDetails({
        error: true,
        message: "Payment initiation failed",
        details: err.response?.data || err.message
      });
    }
  };

  // Poll for payment status
  useEffect(() => {
    if (status !== 'waiting' || !checkoutRequestId) return;

    const maxAttempts = 3;
    const pollInterval = 10000;
    let timeoutId;

    const pollTransactionStatus = async () => {
      try {
        const { data } = await axios.get(`${backend}/mpesa/transaction-status`, {
          params: { checkoutRequestId }
        });

        if (data.status === 'Completed') {
          clearTimeout(timeoutId);
          setStatus('success');
          setCallbackDetails({
            message: "Payment completed successfully",
            details: data
          });
          setTimeout(() => onSuccess?.(amount), 2000);
        } else if (data.status === 'Failed') {
          clearTimeout(timeoutId);
          setStatus('failed');
          setErrorMessage(data.reason || "Payment failed. Please check your M-Pesa balance and try again.");
          setCallbackDetails({
            error: true,
            message: "Payment failed",
            details: data
          });
        } else if (data.status === 'InsufficientBalance') {
          clearTimeout(timeoutId);
          setStatus('insufficient');
          setErrorMessage("Insufficient balance in your M-Pesa account");
          setCallbackDetails({
            error: true,
            message: "Insufficient balance",
            details: data
          });
        } else {
          // Update with latest polling response
          setCallbackDetails({
            message: "Waiting for payment confirmation",
            details: data
          });
        }
      } catch (err) {
        console.error("Polling error:", err);
        setCallbackDetails({
          error: true,
          message: "Error checking payment status",
          details: err.response?.data || err.message
        });
      }
    };

    // Initial immediate check
    pollTransactionStatus();

    // Set up polling interval
    const intervalId = setInterval(() => {
      setPollAttempts(prev => {
        const newAttempt = prev + 1;
        if (newAttempt >= maxAttempts) {
          clearInterval(intervalId);
          setStatus('timeout');
          setErrorMessage("Payment verification timed out. Please check your M-Pesa transactions.");
          setCallbackDetails({
            error: true,
            message: "Payment verification timeout",
            details: "Exceeded maximum polling attempts"
          });
        }
        return newAttempt;
      });
      pollTransactionStatus();
    }, pollInterval);

    // Set overall timeout
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (status === 'waiting') {
        setStatus('timeout');
        setErrorMessage("Payment verification timed out. Please check your M-Pesa transactions.");
        setCallbackDetails({
          error: true,
          message: "Payment verification timeout",
          details: "Overall timeout reached"
        });
      }
    }, maxAttempts * pollInterval + 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [status, checkoutRequestId, backend, amount, onSuccess]);

  const resetPayment = () => {
    setStatus('idle');
    setCheckoutRequestId(null);
    setErrorMessage('');
    setCallbackDetails(null);
  };

  const statusConfig = {
    sending: {
      icon: <FaSpinner className="animate-spin text-4xl text-blue-500" />,
      message: "Sending payment request to your phone...",
      showAction: false
    },
    waiting: {
      icon: <FaSpinner className="animate-spin text-4xl text-blue-500" />,
      message: `Waiting for payment (attempt ${pollAttempts}/3)...`,
      showAction: false
    },
    success: {
      icon: <FaCheckCircle className="text-4xl text-green-500" />,
      message: `Payment of KES ${amount.toLocaleString()} received`,
      showAction: true,
      actionText: "Continue"
    },
    failed: {
      icon: <FaTimesCircle className="text-4xl text-red-500" />,
      message: errorMessage || "Payment failed or was cancelled",
      showAction: true,
      actionText: "Try Again"
    },
    timeout: {
      icon: <FaTimesCircle className="text-4xl text-yellow-500" />,
      message: errorMessage || "Didn't receive payment confirmation",
      showAction: true,
      actionText: "Retry Payment"
    },
    insufficient: {
      icon: <FaExclamationTriangle className="text-4xl text-orange-500" />,
      message: errorMessage || "Insufficient balance in M-Pesa account",
      showAction: true,
      actionText: "Try Again"
    }
  };

  return (
    <form onSubmit={handleMpesaPayment} className="space-y-6 mt-4 relative">
      {/* Status Overlay */}
      {status !== 'idle' && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10 p-4">
          {statusConfig[status].icon}
          <p className="text-lg font-medium text-center mt-4">
            {statusConfig[status].message}
          </p>
          
          {errorMessage && status !== 'success' && (
            <p className="text-sm text-center text-red-600 mt-2 max-w-xs">
              {errorMessage}
            </p>
          )}

          {callbackDetails && (
            <div className="w-full max-w-md mt-4">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-center text-sm text-blue-600 hover:underline"
              >
                <FaInfoCircle className="mr-1" />
                {showDetails ? 'Hide details' : 'Show transaction details'}
              </button>
              
              {showDetails && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md text-left overflow-auto max-h-40">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(callbackDetails.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {statusConfig[status].showAction && (
            <button
              type="button"
              onClick={status === 'success' ? () => onSuccess?.(amount) : resetPayment}
              className="mt-6 px-6 py-2 bg-[#2E3191] text-white rounded-md hover:opacity-90"
            >
              {statusConfig[status].actionText}
            </button>
          )}
        </div>
      )}

      {/* Phone Input */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="0712345678"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^0\d{9}$/,
              message: "Enter a valid Kenyan number (e.g., 0712345678)"
            }
          })}
          className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
          disabled={status !== 'idle'}
        />
        {errors?.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Plan Info */}
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="font-medium">Plan: {selectedPlan?.name}</p>
        <p className="text-gray-600">
          Amount: KES {isCalculating ? (
            <FaSpinner className="inline animate-spin ml-1" />
          ) : (
            amount.toLocaleString()
          )}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={status !== 'idle'}
          className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:opacity-80 disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={status !== 'idle' || isCalculating}
          className={`px-6 py-3 font-semibold text-white rounded-md transition ${
            status !== 'idle' || isCalculating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:opacity-90"
          }`}
        >
          {isCalculating ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              Calculating...
            </span>
          ) : (
            `Pay KES ${amount.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
}