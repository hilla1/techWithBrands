import React, { useState } from 'react';
import Wrapper from '../reusable/Wrapper';
import { FaArrowRight } from 'react-icons/fa';
import ConsultationModal from '../reusable/ConsultationModal';

const CallToAction = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-r from-[#2E3191] to-[#F89F2D]">
        <Wrapper>
          <div className="flex flex-col items-center justify-center text-center gap-6">
            {/* Text */}
            <h2 className="text-white text-4xl font-bold max-w-2xl">
              Ready to Transform Your Brand?
            </h2>
            <p className="text-white text-lg max-w-2xl">
              Book a free consultation and discover how technology can accelerate your brand's growth.
            </p>

            {/* Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="bg-white text-[#2E3191] hover:bg-opacity-90 transition-all px-8 py-3 rounded-full text-lg font-semibold flex items-center gap-3 shadow-lg"
            >
              Book Free Consultation
              <FaArrowRight />
            </button>
          </div>
        </Wrapper>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default CallToAction;
