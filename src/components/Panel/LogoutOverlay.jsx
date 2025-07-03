import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LogoutOverlay = () => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-[9999] px-4"
      aria-live="assertive"
      role="alert"
    >
      <FaSpinner
        className="text-4xl sm:text-5xl text-white animate-spin mb-3"
        aria-hidden="true"
      />
      <p className="text-white text-base sm:text-lg font-medium text-center">
        Signing out...
      </p>
    </div>
  );
};

export default LogoutOverlay;
