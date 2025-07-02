import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ReusableModal = ({ isOpen, onClose, children, size = 'default' }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Utility: Get how many modals are open
  const getOpenCount = () => parseInt(document.body.dataset.modalOpen || '0', 10);

  // Utility: Set modal open count
  const setOpenCount = (count) => {
    document.body.dataset.modalOpen = count.toString();
  };

  useEffect(() => {
    if (isOpen) {
      const current = getOpenCount();
      setOpenCount(current + 1);
      document.body.style.overflow = 'hidden';

      // Only show overlay if this is the first modal
      if (current === 0) {
        setIsOverlayVisible(true);
      }
    }

    return () => {
      if (isOpen) {
        const current = getOpenCount();
        const next = Math.max(current - 1, 0);
        setOpenCount(next);

        if (next === 0) {
          document.body.style.overflow = '';
          setIsOverlayVisible(false);
        }
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Modal size options
  const sizeClasses = {
    default: 'w-full max-w-md md:max-w-1/3 lg:max-w-1/2',
    sm: 'w-full max-w-sm',
    lg: 'w-full max-w-3xl',
    xl: 'w-full max-w-5xl',
    full: 'w-full h-full',
  };

  return (
    <>
      {/* Scrollbar styling */}
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

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Render overlay only once */}
        {isOverlayVisible && (
          <div
            className="absolute inset-0 bg-black opacity-50 transition-opacity duration-200"
            aria-hidden="true"
          />
        )}

        {/* Modal container */}
        <div
          className={`relative bg-white shadow-lg z-10 mx-4 overflow-hidden rounded-lg ${sizeClasses[size]}`}
          style={{ maxHeight: size === 'full' ? '100vh' : '80vh' }}
        >
          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-white h-[30px] px-1 flex items-center justify-end rounded-tl-lg rounded-tr-lg">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes size={22} />
            </button>
          </div>

          {/* Modal content */}
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
