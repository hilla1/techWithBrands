import React, { useState } from 'react';
import ConsultationModal from '../reusable/ConsultationModal';

const EmptyConsultation = ({ onCreated }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (typeof onCreated === 'function') {
      await onCreated();
    }
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="text-sm text-gray-500 mb-4">No consultations available.</p>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:underline transition"
      >
        + Create Consultation
      </button>

      {isOpen && (
        <ConsultationModal
          isOpen={true}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EmptyConsultation;
