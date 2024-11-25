import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

const ContentWrapper = ({ roles = [], children }) => {
  const { isAuthenticated, loading, getUser } = useAuth();
  const { logout } = useLogout();
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (loading) return; // Exit if still loading

    if (!isAuthenticated) {
      const timer = setTimeout(logout, 3000); // Log out if unauthenticated after a delay
      return () => clearTimeout(timer);
    }

    setUser(getUser()); // Set user once authenticated
    setIsAuthChecked(true);
  }, [isAuthenticated, loading, logout, getUser]);

  // Show loading spinner if checking auth status
  if (loading || !isAuthChecked) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  // Check if user has access
  const userHasAccess = roles.length === 0 || (user && roles.includes(user.role));

  // Render based on authentication and access
  if (!isAuthenticated) {
    // Optionally, redirect to login page or return null
    return null; // Not authenticated
  }

  if (userHasAccess) {
    // If authenticated and has access, render children
    return (
      <>
        {React.Children.map(children, (child) => 
          React.isValidElement(child) ? React.cloneElement(child, { user }) : child
        )}
      </>
    );
  }

  // Unauthorized access message
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Unauthorized</h1>
          <p className="text-lg text-gray-600">You don't have permission to access this page.</p>
          <div className="mt-6">
            <img
              src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
              alt="Access Denied"
              className="mx-auto w-48 h-48"
            />
          </div>
          <p className="text-sm mt-4 text-gray-500">If you believe this is an error, please contact support.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ContentWrapper;
