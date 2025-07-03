import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FaUserEdit,
  FaKey,
  FaUser,
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ViewProfile from './user/ViewProfile';
import EditProfileForm from './user/EditProfileForm';
import ChangePasswordForm from './user/ChangePasswordForm';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

const UserProfileModal = ({ onClose, onOtpOpen }) => {
  const { user, backend, refetch } = useAuth();
  const [tab, setTab] = useState('view');
  const [modalData, setModalData] = useState(null);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const showModal = (success, message) => {
    setModalData({ success, message });
  };

  // Auto-close modal after 3 seconds
  useEffect(() => {
    if (modalData) {
      const timer = setTimeout(() => {
        setModalData(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modalData]);

  const handlePasswordSubmit = async (data) => {
    try {
      const { currentPassword, newPassword } = data;
      const res = await axios.patch(
        `${backend}/user/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      if (res.data.success) {
        showModal(true, 'Password updated!');
        passwordForm.reset();
        setTab('view');
      } else {
        showModal(false, res.data.message || 'Password update failed');
      }
    } catch (error) {
      showModal(false, error.message || 'Error changing password');
    }
  };

  const handleSendOtp = async () => {
    setLoadingOtp(true);
    try {
      const res = await axios.post(
        `${backend}/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      setLoadingOtp(false);
      if (res.data.success) {
        onClose?.();
        onOtpOpen?.();
      } else {
        showModal(false, res.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setLoadingOtp(false);
      showModal(false, error.message || 'Error sending OTP');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="text-gray-700 space-y-4 relative">
      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-200 mb-4">
        {['view', 'edit', 'password'].map((type) => (
          <button
            key={type}
            onClick={() => setTab(type)}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium ${
              tab === type
                ? 'text-orange-500 border-b-2 border-orange-400'
                : 'text-gray-500'
            }`}
          >
            {type === 'view' && <FaUser />}
            {type === 'edit' && <FaUserEdit />}
            {type === 'password' && <FaKey />}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative">
        {tab === 'view' && <ViewProfile user={user} handleSendOtp={handleSendOtp} />}
        {tab === 'edit' && (
          <EditProfileForm
            onSuccess={() => {
              refetch();
              setTab('view');
            }}
          />
        )}
        {tab === 'password' && (
          <ChangePasswordForm
            passwordForm={passwordForm}
            onSubmit={handlePasswordSubmit}
          />
        )}

        {/* Inline Spinner */}
        {loadingOtp && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center rounded-lg z-30">
            <FaSpinner className="animate-spin text-3xl text-orange-500 mb-2" />
            <p className="text-sm font-medium text-gray-800">Sending OTP...</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {modalData && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg p-6 w-80 text-center">
            <div
              className={`text-4xl mb-2 mx-auto ${
                modalData.success ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {modalData.success ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <p className="text-lg font-semibold mb-4">{modalData.message}</p>
            <button
              onClick={() => setModalData(null)}
              className={`${
                modalData.success
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              } text-white px-4 py-2 rounded`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileModal;
