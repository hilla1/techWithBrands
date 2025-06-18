import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Oval } from 'react-loader-spinner';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showInternetError, setShowInternetError] = useState(false);

  useEffect(() => {
    const sessionCookie = Cookies.get('twb');

    if (!loading) {
      if (isAuthenticated === false) {
        if (sessionCookie === 'session') {
          setShowInternetError(true);
        } else {
          navigate('/', { replace: true });
        }
      }
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || isAuthenticated === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Oval
          height={60}
          width={60}
          strokeWidth={5}
          color="#2E3191"
          secondaryColor="#F89F2D"
          ariaLabel="loading"
        />
      </div>
    );
  }

  if (showInternetError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="text-4xl font-semibold text-[#2E3191] mb-4">Connection Issue</div>
        <p className="text-lg text-gray-600 mb-6 max-w-md">
          It seems you're connected, but we can't verify your session. Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white rounded-xl shadow-lg transition hover:scale-105"
        >
          Retry
        </button>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
