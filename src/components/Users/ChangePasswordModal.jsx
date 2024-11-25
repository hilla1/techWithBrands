import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReusableModal from '../reusable/ReusableModal'; // Adjust the import path

const ChangePasswordModal = ({ open, onClose, selectUser, onChangePassword }) => {
  // Zod schema for password validation
  const passwordSchema = z.object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data) => {
    onChangePassword(data);
    reset();
  };

  return (
    <ReusableModal isOpen={open} onClose={() => { onClose(); reset(); }}>
      <div>
        <h2 className="text-xl mb-4 text-blue-900">
          Change Password for {selectUser?.name || 'User'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              {...register('newPassword')}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-200 ${errors.newPassword ? 'border-red-500' : ''}`}
              aria-label="New Password"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => { onClose(); reset(); }}
              className="mr-2 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </ReusableModal>
  );
};

export default ChangePasswordModal;
