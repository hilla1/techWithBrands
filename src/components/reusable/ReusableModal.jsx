import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ReusableModal = ({ isOpen, onClose, children, size = 'default' }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    default: 'w-full max-w-md md:max-w-1/3 lg:max-w-1/2',
    sm: 'w-full max-w-sm',
    lg: 'w-full max-w-3xl',
    xl: 'w-full max-w-5xl',
    full: 'w-full h-full',
  };

  return (
    <>
      {/* Custom scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.6);
          border-radius: 8px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.6) transparent;
        }
      `}</style>

      {/* Modal backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true" />

        {/* Modal container */}
        <div
          className={`relative bg-white shadow-lg z-10 mx-4 overflow-hidden rounded-lg ${sizeClasses[size]}`}
          style={{ maxHeight: size === 'full' ? '100vh' : '80vh' }}
        >
          {/* Sticky top bar with curved top corners and close button */}
          <div className="sticky top-0 z-10 bg-white h-[30px] px-1 flex items-center justify-end rounded-tl-lg rounded-tr-lg">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes size={22} />
            </button>
          </div>

          {/* Scrollable content area */}
          <div
            className="custom-scrollbar overflow-y-auto px-4 pb-4 pt-2 space-y-4"
            style={{
              maxHeight: size === 'full' ? 'calc(100vh - 2rem)' : 'calc(80vh - 2rem)',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReusableModal;
