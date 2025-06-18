import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const { checkAuthentication } = useAuth();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuth = async () => {
      const code = new URLSearchParams(search).get('code');

      if (!code) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/oauth/callback`,
          { code },
          { withCredentials: true }
        );

        if (response.data.success) {
          await checkAuthentication();
          navigate('/dashboard');
        } else {
          throw new Error(response.data.message || 'OAuth failed');
        }
      } catch (error) {
        console.error('OAuth callback error:', error.response?.message || error.message);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleOAuth();
  }, [search, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        {loading ? (
          <>
            <svg className="animate-spin h-10 w-10 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="mt-4 text-lg text-center">Processing OAuth callback...</p>
          </>
        ) : (
          <p className="text-lg text-center">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
