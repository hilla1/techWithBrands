import React, { useState, useEffect } from 'react';
import ReusableModal from '../../components/reusable/ReusableModal';
import ResetPasswordModal from './ResetPasswordModal';
import { FaGoogle } from 'react-icons/fa';
import twbLogo from '../../assets/twbFalcon.png';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Validation schema
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const LoginModal = ({ isOpen, onClose, email = '' }) => {
  const { checkAuthentication } = useAuth();
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(null);

  const [activeModal, setActiveModal] = useState('login'); 
  const [storedEmail, setStoredEmail] = useState(email);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email },
  });

  useEffect(() => {
    reset({ email });
  }, [email, reset]);

  const handleForgotPassword = () => {
    setStoredEmail(getValues('email'));
    setActiveModal('reset');
  };

  const handleResetSuccess = () => {
    setActiveModal('login');
    setResetSuccessMessage('Password reset successful! Please login with your new password.');
  };

  const handleGoogleSignin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      const { success, message } = response.data;

      if (success) {
        setResetSuccessMessage(null);
        await checkAuthentication();
        onClose();
        navigate('/dashboard');
      } else {
        setLoginError(message);
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ReusableModal isOpen={isOpen} onClose={onClose}>
        <div className="p-2 transition-all duration-300">
          {/* Conditional rendering inside modal */}
          {activeModal === 'login' && (
            <div className="animate-fade-in">
              <img src={twbLogo} alt="TWB Logo" className="w-32 h-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

              {resetSuccessMessage && (
                <p className="text-green-600 text-center mb-4">{resetSuccessMessage}</p>
              )}
              {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}
              {loading && <p className="text-center mb-4">Loading...</p>}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">
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
                  <label htmlFor="password" className="block text-gray-700 mb-2">
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

                <div className="text-right mb-4">
                  <button
                    type="button"
                    className="text-[#F89F2D] font-bold hover:text-orange-500"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#F89F2D] text-white font-bold rounded-lg mb-4 hover:bg-orange-300"
                  disabled={loading}
                >
                  Login
                </button>
              </form>

              <button
                onClick={handleGoogleSignin}
                className="w-full py-2 bg-white border flex items-center justify-center text-black font-bold rounded-lg hover:bg-gray-100"
              >
                <FaGoogle className="mr-2 text-gray-700" />
                Sign in with Google
              </button>
            </div>
          )}

          {activeModal === 'reset' && (
            <div className="animate-fade-in">
              <ResetPasswordModal
                isOpen={true}
                onClose={() => setActiveModal('login')}
                onResetSuccess={handleResetSuccess}
                email={storedEmail}
              />
            </div>
          )}
        </div>
      </ReusableModal>
    </>
  );
};

export default LoginModal;
