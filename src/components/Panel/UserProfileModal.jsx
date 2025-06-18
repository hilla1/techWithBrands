import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaUserEdit, FaKey, FaUser, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Modal Component
const ReusableModal = ({ title, message, onClose, icon, color }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
      {icon && <div className={`text-${color}-500 text-4xl mb-2 mx-auto`}>{icon}</div>}
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <button
        onClick={onClose}
        className={`bg-${color}-500 hover:bg-${color}-600 text-white px-4 py-2 rounded`}
      >
        Close
      </button>
    </div>
  </div>
);

const editProfileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  avatar: z.string().url('Invalid URL'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmNewPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
});

const UserProfileModal = () => {
  const { user, backend, refetch } = useAuth();
  const [tab, setTab] = useState('view');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [modalData, setModalData] = useState(null); 
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputsRef = useRef([]);

  const editForm = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      avatar: user?.avatar || '',
    },
  });

  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const showModal = (title, message, icon, color = 'green') => {
    setModalData({ title, message, icon, color });
  };

  const handleEditSubmit = async (data) => {
    try {
      const res = await axios.patch(`${backend}/user/update-profile`, data, { withCredentials: true });
      if (res.data.success) {
        showModal('Success', 'Profile updated!', <FaCheckCircle />, 'green');
        refetch();
        setTab('view');
      } else {
        showModal('Error', res.data.message || 'Update failed', <FaCheckCircle />, 'red');
      }
    } catch (error) {
      showModal('Error', error.message || 'Error updating profile', <FaCheckCircle />, 'red');
    }
  };

  const handlePasswordSubmit = async (data) => {
    try {
      const { currentPassword, newPassword } = data;
      const res = await axios.patch(`${backend}/user/change-password`, { currentPassword, newPassword }, { withCredentials: true });
      if (res.data.success) {
        showModal('Success', 'Password updated!', <FaCheckCircle />, 'green');
        passwordForm.reset();
        setTab('view');
      } else {
        showModal('Error', res.data.message || 'Password update failed', <FaCheckCircle />, 'red');
      }
    } catch (error) {
      showModal('Error', error.message || 'Error changing password', <FaCheckCircle />, 'red');
    }
  };

  const handleSendOtp = async () => {
  showModal('Sending OTP', 'Sending to your Email', <FaCheckCircle />, 'blue');

  try {
    const res = await axios.post(`${backend}/auth/send-verify-otp`, {}, { withCredentials: true });
    setModalData(null);

    if (res.data.success) {
      setShowOtpModal(true);
    } else {
      showModal('Error', res.data.message || 'Failed to send OTP', <FaCheckCircle />, 'red');
    }
  } catch (error) {
    showModal('Error', error.message || 'Error sending OTP', <FaCheckCircle />, 'red');
  }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;
    try {
      const res = await axios.post(`${backend}/auth/verify-account`, { otp: otpCode }, { withCredentials: true });
      if (res.data.success) {
        setShowOtpModal(false);
        showModal('Verification Successful', 'Your account has been verified.', <FaCheckCircle />, 'green');
        refetch();
      } else {
        showModal('Error', res.data.message || 'Invalid OTP', <FaCheckCircle />, 'red');
      }
    } catch (error) {
      showModal('Error', error.message || 'Verification failed', <FaCheckCircle />, 'red');
    }
  };

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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="text-gray-700 space-y-4">
            {/* Tabs */}
      <div className="flex justify-around border-b border-gray-200 mb-4">
        {['view', 'edit', 'password'].map((type) => (
          <button
            key={type}
            onClick={() => setTab(type)}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium ${tab === type ? 'text-orange-500 border-b-2 border-orange-400' : 'text-gray-500'}`}
          >
            {type === 'view' && <FaUser />}
            {type === 'edit' && <FaUserEdit />}
            {type === 'password' && <FaKey />}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* View Tab */}
      {tab === 'view' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold text-xl">
                {user.name?.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-gray-500">Verified</p>
              <p className="font-medium">
                {user.isAccountVerified ? 'Yes ✅' : (
                  <button
                    onClick={handleSendOtp}
                    className="text-orange-500 underline"
                  >
                    Verify Now
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Tab */}
      {tab === 'edit' && (
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              {...editForm.register('name')}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {editForm.formState.errors.name && (
              <p className="text-red-500 text-sm">{editForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Avatar URL</label>
            <input
              type="text"
              {...editForm.register('avatar')}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {editForm.formState.errors.avatar && (
              <p className="text-red-500 text-sm">{editForm.formState.errors.avatar.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded shadow"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Change Password Tab */}
      {tab === 'password' && (
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Current Password</label>
            <input
              type="password"
              {...passwordForm.register('currentPassword')}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-red-500 text-sm">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              {...passwordForm.register('newPassword')}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-red-500 text-sm">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              {...passwordForm.register('confirmNewPassword')}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {passwordForm.formState.errors.confirmNewPassword && (
              <p className="text-red-500 text-sm">{passwordForm.formState.errors.confirmNewPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded shadow"
          >
            Change Password
          </button>
        </form>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold mb-2">Enter 6-digit OTP sent to {user.email}</h2>
            <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
              {otp.map((val, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  value={val}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => (inputsRef.current[i] = el)}
                  className="w-10 h-12 border text-center text-lg rounded"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
            >
              Verify
            </button>
            <button
              onClick={() => setShowOtpModal(false)}
              className="block text-sm text-gray-500 hover:text-gray-700 mt-2 mx-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for Success/Error */}
      {modalData && (
        <ReusableModal
          {...modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default UserProfileModal;
  