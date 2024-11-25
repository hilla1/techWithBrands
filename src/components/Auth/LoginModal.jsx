import React, { useState, useEffect } from 'react';
import ReusableModal from '../../components/reusable/ReusableModal';
import ResetPasswordModal from './ResetPasswordModal';
import { FaGoogle } from 'react-icons/fa';
import twbLogo from '../../assets/twbFalcon.png';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Define validation schema using Zod
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const LoginModal = ({ isOpen, onClose }) => {
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Form handling using react-hook-form and Zod for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle traditional login with email and password
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signin`, {
        email: data.email,
        password: data.password,
      }, { withCredentials: true }); 

      const { status } = response.data;

      if (status === 'authenticated') {
        // Close modal and redirect
        onClose();
        
        navigate('/settings');
      } else {
        setLoginError('Login failed');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Google Sign-In (OAuth redirect)
  const handleGoogleSignin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`; // Redirect to Google OAuth URL
  };

  // Effect to capture query params after Google sign-in (for callback handling)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      // Send the authorization code to the backend to exchange for tokens
      axios.post(`${import.meta.env.VITE_API_URL}/auth/oauth/callback`, { code }, { withCredentials: true })
        .then((response) => {
          const { status } = response.data;

          if (status === 'authenticated') {
            // Redirect to /settings
            navigate('/settings');
          } else {
            setLoginError('Google Sign-In failed');
          }
        })
        .catch((error) => {
          console.error('Error during Google OAuth callback:', error);
          setLoginError('Google Sign-In failed. Please try again.');
        });
    }
  }, [location.search, navigate]);

  // Toggle Forgot Password modal
  const handleForgotPassword = () => {
    onClose();
    setIsResetPasswordOpen(true);
  };

  return (
    <>
      {/* Main Login Modal */}
      <ReusableModal isOpen={isOpen} onClose={onClose}>
        <div className="p-2">
          {/* Logo */}
          <img src={twbLogo} alt="TWB Logo" className="w-32 h-auto mx-auto mb-4" />

          {/* Modal Title */}
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          {/* Display Login Error */}
          {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}

          {/* Display Loading Spinner */}
          {loading && <p className="text-center mb-4">Loading...</p>}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
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
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#F89F2D] text-white font-bold rounded-lg mb-4 hover:bg-orange-300"
            >
              Login
            </button>
          </form>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignin} // Trigger Google OAuth redirect
            className="w-full py-2 bg-white border flex items-center justify-center text-black font-bold rounded-lg hover:bg-gray-100"
          >
            <FaGoogle className="mr-2 text-gray-700" />
            Sign in with Google
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
