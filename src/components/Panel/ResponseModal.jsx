import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ReusableModal from '../reusable/ReusableModal';

const ResponseModal = ({ response, onClose }) => {
  const isOpen = !!response;
  const success = response?.success;
  const message = response?.message || '';

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
