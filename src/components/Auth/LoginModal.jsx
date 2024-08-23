import React, { useState } from 'react';
import ReusableModal from '../../components/reusable/ReusableModal';
import ResetPasswordModal from './ResetPasswordModal'; 
import { FaGoogle } from 'react-icons/fa';
import twbLogo from '../../assets/twbFalcon.png';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schema with Zod
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const LoginModal = ({ isOpen, onClose }) => {
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
  };

  const handleForgotPassword = () => {
    onClose(); // Close the LoginModal
    setIsResetPasswordOpen(true); // Open the ResetPasswordModal
  };

  return (
    <>
      <ReusableModal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
          {/* Logo */}
          <img
            src={twbLogo}
            alt="TWB Logo"
            className="w-32 h-auto mx-auto mb-4"
          />

          {/* Modal Title */}
          <h2 className="text-2xl font-bold text-center mb-4">
            Login
          </h2>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-4">
              <button
                type="button"
                className="text-[#F89F2D] font-bold hover:text-orange-600"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#F89F2D] text-white font-bold rounded-lg mb-4 hover:bg-orange-600"
            >
              Login
            </button>
          </form>

          {/* Google Sign-In */}
          <button
            className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <FaGoogle className="mr-2 text-gray-700" />
            Login with Google
          </button>
        </div>
      </ReusableModal>

      {/* Reset Password Modal */}
      <ResetPasswordModal 
        isOpen={isResetPasswordOpen} 
        onClose={() => setIsResetPasswordOpen(false)} 
      />
    </>
  );
};

export default LoginModal;
