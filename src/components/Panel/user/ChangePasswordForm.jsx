import React, { useState } from 'react';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePasswordForm = ({ passwordForm, onSubmit }) => {
  const isSubmitting = passwordForm.formState.isSubmitting;

  // Track visibility for each field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleVisibility = (field) => {
    if (field === 'current') setShowCurrent((prev) => !prev);
    if (field === 'new') setShowNew((prev) => !prev);
    if (field === 'confirm') setShowConfirm((prev) => !prev);
  };

  return (
    <form onSubmit={passwordForm.handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            {...passwordForm.register('currentPassword')}
            placeholder="Enter current password"
            className="w-full border rounded px-3 py-2 mt-1 pr-10"
          />
          <span
            className="absolute top-3.5 right-3 text-gray-500 cursor-pointer"
            onClick={() => toggleVisibility('current')}
          >
            {showCurrent ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {passwordForm.formState.errors.currentPassword && (
          <p className="text-red-500 text-sm">
            {passwordForm.formState.errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium">New Password</label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            {...passwordForm.register('newPassword')}
            placeholder="Enter new password"
            className="w-full border rounded px-3 py-2 mt-1 pr-10"
          />
          <span
            className="absolute top-3.5 right-3 text-gray-500 cursor-pointer"
            onClick={() => toggleVisibility('new')}
          >
            {showNew ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {passwordForm.formState.errors.newPassword && (
          <p className="text-red-500 text-sm">
            {passwordForm.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block text-sm font-medium">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            {...passwordForm.register('confirmNewPassword')}
            placeholder="Confirm new password"
            className="w-full border rounded px-3 py-2 mt-1 pr-10"
          />
          <span
            className="absolute top-3.5 right-3 text-gray-500 cursor-pointer"
            onClick={() => toggleVisibility('confirm')}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {passwordForm.formState.errors.confirmNewPassword && (
          <p className="text-red-500 text-sm">
            {passwordForm.formState.errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button Right-Aligned */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded shadow flex items-center gap-2 disabled:opacity-60"
        >
          {isSubmitting && <FaSpinner className="animate-spin" />}
          Change Password
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
