import React, { useState, useEffect } from 'react';
import ReusableModal from '../../components/reusable/ReusableModal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const emailSchema = z.object({
  email: z.string().email('Invalid email').nonempty('Email is required'),
});

const passwordSchema = z
  .object({
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const emailForm = useForm({ resolver: zodResolver(emailSchema) });
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    const fullOtp = otpDigits.join('');
    passwordForm.setValue('otp', fullOtp);
  }, [otpDigits]);

  const handleModalClose = () => {
    setStep(1);
    setEmail('');
    setOtpDigits(['', '', '', '', '', '']);
    emailForm.reset();
    passwordForm.reset();
    setMessage('');
    onClose();
  };

  const handleEmailSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-reset-otp`, {
        email: data.email,
      });

      if (res.data.success) {
        setEmail(data.email);
        setMessage('OTP has been sent to your email. Please enter the 6-digit code below to reset your password.');
        setStep(2);
      } else {
        setMessage(res.data.message || 'Failed to send OTP.');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-reset-otp`, { email });
      if (res.data.success) {
        setMessage('OTP resent. Please check your email again.');
      } else {
        setMessage(res.data.message || 'Failed to resend OTP.');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handlePasswordReset = async (data) => {
    if (otpDigits.some((digit) => digit === '')) {
      passwordForm.setError('otp', { message: 'Please enter the complete OTP' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      if (res.data.success) {
        setMessage('Password reset successful. You can now log in with your new password.');
        setTimeout(() => {
          handleModalClose();
        }, 2500);
      } else {
        setMessage(res.data.message || 'Failed to reset password.');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otpDigits];
      newOtp[index] = value.slice(-1);
      setOtpDigits(newOtp);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasted.every((char) => /^\d$/.test(char))) {
      setOtpDigits([...pasted, '', '', '', '', ''].slice(0, 6));
    }
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={handleModalClose}>
      <div className="p-4 min-w-[300px] max-w-[400px]">
        <h2 className="text-xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#2E3191] to-[#F89F2D]">
          {step === 1 ? 'Reset Your Password' : 'Enter OTP & New Password'}
        </h2>

        {message && (
          <p className="text-sm text-center mb-4 text-gray-700">{message}</p>
        )}

        {step === 1 ? (
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                {...emailForm.register('email')}
                className="w-full px-4 py-2 border rounded"
              />
              {emailForm.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white rounded bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:opacity-90"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)}>
            <div className="flex justify-center gap-2 mb-4" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-10 h-12 text-center border rounded"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                />
              ))}
            </div>
            {passwordForm.formState.errors.otp && (
              <p className="text-red-500 text-sm mb-2">{passwordForm.formState.errors.otp.message}</p>
            )}

            <div className="mb-3">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                {...passwordForm.register('newPassword')}
                className="w-full px-4 py-2 border rounded"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                {...passwordForm.register('confirmPassword')}
                className="w-full px-4 py-2 border rounded"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-sm text-[#2E3191] hover:underline disabled:text-gray-400"
              >
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white rounded bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:opacity-90"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </ReusableModal>
  );
};

export default ResetPasswordModal;
