import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import ReusableModal from '../../components/reusable/ReusableModal';
import twbLogo from '../../assets/twbFalcon.png';
import LoginModal from './LoginModal';
import { useAuth } from '../../context/AuthContext';

// Validation schema using Zod
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const RegisterModal = ({ isOpen, onClose }) => {
  const { checkAuthentication } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle Registration Submit
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
  
    try {
      // Make the registration request
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const { success, message } = response.data;

      // Check for successful registration
      if (success) {
        await checkAuthentication();
        navigate('/dashboard');
      } else {
        setError(message);
      }
    } catch (err) {
      // Handle errors, display error message if registration fails
      setError(err.response?.data?.message || 'Something went wrong, please try again.');
    } finally {
      setLoading(false); // Always stop loading spinner
    }
  };

  // Google OAuth registration
  const handleGoogleRegister = () => {
    window.location.assign(`${import.meta.env.VITE_API_URL}/auth/google`);
  };

  // Handle modal close
  const handleClose = () => {
    reset();
    onClose();
  };

  // Redirect to login modal
  const handleLoginRedirect = () => {
    handleClose();
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <ReusableModal isOpen={isOpen} onClose={handleClose}>
        <div className="p-2">
          <img src={twbLogo} alt="TWB Logo" className="w-32 h-auto mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 bg-[#F89F2D] text-white font-bold rounded-lg mb-4 hover:bg-orange-300 ${loading && 'opacity-50 cursor-not-allowed'}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Google Sign-In Button */}
          <button onClick={handleGoogleRegister} className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            <FaGoogle className="mr-2" />
            <div className='text-black font-bold'>Register with Google</div>
          </button>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <button onClick={handleLoginRedirect} className="text-[#F89F2D] hover:underline">
              Login here
            </button>
          </p>
        </div>
      </ReusableModal>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default RegisterModal;
