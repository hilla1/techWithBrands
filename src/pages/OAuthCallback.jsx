import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        // Authorization code not found, redirect to homepage
        navigate('/');
        return;
      }

      try {
        // Make a request to your backend to handle the OAuth callback
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/oauth/callback`, {
          code, // Send the code in the request body
        }, {
          withCredentials: true, // Ensure cookies are sent with the request and set by backend
        });

        // Redirect to settings or another page after successful login
        navigate('/settings');
      } catch (error) {
        console.error('Error during OAuth callback:', error.response?.data || error.message);
        navigate('/'); // Redirect to homepage if there's an issue
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [location.search, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? (
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <svg className="animate-spin h-10 w-10 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          {/* Loading text */}
          <p className="mt-4 text-lg text-center">Processing OAuth callback...</p>
        </div>
      ) : (
        <p className="text-lg text-center">Redirecting...</p>
      )}
    </div>
  );
};

export default OAuthCallback;
