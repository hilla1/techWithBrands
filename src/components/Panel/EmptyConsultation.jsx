import React, { useState } from 'react';
import Lottie from 'lottie-react';
import futuristicAnimation from '../../assets/lotties/futuristic2.json';
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
    <div className="flex flex-col items-center justify-center pb-4 text-center">
      <div className="w-48 h-48 md:w-60 md:h-60">
        <Lottie
          animationData={futuristicAnimation}
          loop
          autoplay
          className="w-full h-full"
        />
      </div>
      <p className="text-sm text-gray-500 mb-2">
        No consultations available.
      </p>
      <button
        onClick={() => setIsOpen(true)}
        className="text-md lg:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:underline transition"
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
