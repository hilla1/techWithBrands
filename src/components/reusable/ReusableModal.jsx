import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ReusableModal = ({ isOpen, onClose, children }) => {
  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true"></div>

      {/* Modal Box */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-1/3 lg:max-w-1/2 mx-4 md:mx-auto z-10 overflow-y-auto"
        style={{ maxHeight: '80vh' }}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>

        <div className="m-4 space-y-4">
          {/* Modal Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ReusableModal;
