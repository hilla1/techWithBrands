import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ResponseModal from '../ResponseModal';

const OtpModal = ({ onClose, reopenProfile }) => {
  const { user, backend, refetch } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputsRef = useRef([]);
  const [response, setResponse] = useState(null);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[idx]) {
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        newOtp[idx - 1] = '';
        setOtp(newOtp);
        inputsRef.current[idx - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = Array(6).fill('');
    pasted.forEach((val, idx) => {
      if (/[0-9]/.test(val)) newOtp[idx] = val;
    });
    setOtp(newOtp);
    inputsRef.current[pasted.length - 1]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setResponse({ success: false, message: 'Please enter all 6 digits.' });
      return;
    }

    try {
      const res = await axios.post(
        `${backend}/auth/verify-account`,
        { otp: otpCode },
        { withCredentials: true }
      );

      if (res.data.success) {
        await refetch();
        setResponse({ success: true, message: 'Account verified successfully!' });

        // Close OTP modal and reopen profile after short delay
        setTimeout(() => {
          setResponse(null);
          onClose();
          reopenProfile();
        }, 1500);
      } else {
        setResponse({ success: false, message: res.data.message || 'Invalid OTP' });
      }
    } catch (err) {
      setResponse({
        success: false,
        message: err.response?.data?.message || 'Verification failed',
      });
    }
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-lg font-semibold">Enter 6-digit OTP sent to {user.email}</h2>

      <div className="flex justify-center gap-2 mb-2" onPaste={handlePaste}>
        {otp.map((val, i) => (
          <input
            key={i}
            type="text"
            maxLength="1"
            value={val}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(el) => (inputsRef.current[i] = el)}
            className="w-10 h-12 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        ))}
      </div>

      {/* Button Row */}
      <div className="flex justify-between items-center mt-4 px-2 gap-4">
        <button
          onClick={() => {
            onClose();
            reopenProfile();
          }}
          className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleVerify}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
        >
          Verify
        </button>
      </div>

      {/* Response Modal */}
      <ResponseModal response={response} onClose={() => setResponse(null)} />
    </div>
  );
};

export default OtpModal;
