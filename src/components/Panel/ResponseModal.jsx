import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ReusableModal from '../reusable/ReusableModal';

const ResponseModal = ({ response, onClose }) => {
  const isOpen = !!response;
  const success = response?.success;
  const message = response?.message || '';

  // Auto-close after 3 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose}>
      <div
        className={`flex flex-col items-center justify-center text-center ${
          success ? ' text-green-800' : ' text-red-800'
        }`}
      >
        {success ? (
          <FaCheckCircle className="text-4xl mb-2" />
        ) : (
          <FaTimesCircle className="text-4xl mb-2" />
        )}
        <p className="text-lg font-semibold">{message}</p>
      </div>
    </ReusableModal>
  );
};

export default ResponseModal;
