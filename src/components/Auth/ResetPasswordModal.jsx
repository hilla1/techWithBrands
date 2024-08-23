import React from 'react';
import ReusableModal from '../../components/reusable/ReusableModal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schema with Zod
const schema = z.object({
  email: z.string().email('Invalid email address').nonempty('Email is required'),
});

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle reset password submission
    console.log('Reset password for:', data);

    // Close the modal and reset the form after submission
    onClose();
    reset();
  };

  const handleModalClose = () => {
    // Reset form values when the modal is closed
    reset();
    onClose();
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={handleModalClose}>
      <div className="p-6">
        {/* Modal Title */}
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="reset-email">
              Email
            </label>
            <input
              type="email"
              id="reset-email"
              {...register('email')}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#F89F2D] text-white font-bold rounded-lg mb-4 hover:bg-orange-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </ReusableModal>
  );
};

export default ResetPasswordModal;
