import React, { useState } from 'react';
import ReusableModal from '../../components/reusable/ReusableModal';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import twbLogo from '../../assets/twbFalcon.png';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LoginModal from './LoginModal'; // Adjust the path as needed

// Define validation schema with Zod
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const RegisterModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
  };

  const handleClose = () => {
    reset(); // Reset the form to its default state
    onClose(); // Close the modal
  };

  const handleLoginRedirect = () => {
    handleClose(); // Close the RegisterModal
    setIsLoginModalOpen(true); // Open the LoginModal
  };

  return (
    <>
      <ReusableModal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6">
          {/* Logo */}
          <img
            src={twbLogo}
            alt="TWB Logo"
            className="w-32 h-auto mx-auto mb-4"
          />

          {/* Modal Title */}
          <h2 className="text-2xl font-bold text-center mb-4">
            Register
          </h2>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full px-4 py-2 border rounded-lg pr-12"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  className="w-full px-4 py-2 border rounded-lg pr-12"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  className="w-full px-4 py-2 border rounded-lg pr-12"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#F89F2D] text-white font-bold rounded-lg mb-4 hover:bg-orange-600"
            >
              Register
            </button>
          </form>

          {/* Google Sign-In */}
          <button
            className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <FaGoogle className="mr-2 text-gray-700" />
            Register with Google
          </button>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-gray-700">
              Already have an account?{' '}
              <button
                className="text-[#F89F2D] font-bold hover:underline"
                onClick={handleLoginRedirect}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </ReusableModal>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default RegisterModal;
