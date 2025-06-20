import React, { useState, useEffect } from 'react';
import Wrapper from '../reusable/Wrapper';
import heroImage from '../../assets/heroimage3.png';
import ConsultationModal from '../reusable/ConsultationModal'; 
import RequirementsModal from '../../components/Panel/projectTabs/RequirementsModal';

const Hero = () => {
  const [navbarHeight, setNavbarHeight] = useState(64);
  const [isConsultationModalOpen, setConsultationModalOpen] = useState(false);
  const [isGetStartedModalOpen, setGetStartedModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <section
        className="pt-6 pb-6 bg-slate-50"
        style={{ paddingTop: `${navbarHeight}px` }}
      >
        <Wrapper>
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Section */}
            <div className="md:w-1/2 w-full flex flex-col justify-center text-center md:text-left mb-8 md:mb-0">
              <div className="w-fit self-center text-sm font-semibold text-white mb-4 px-3 py-1 rounded-full bg-gradient-to-r from-[#2E3191] to-[#F89F2D] shadow-lg">
                Trusted by 500+ Brands
              </div>
              <h1 className="text-3xl md:text-6xl font-bold text-[#2E3191]">
                <span className="bg-gradient-to-r from-[#2E3191] to-[#F89F2D] bg-clip-text text-transparent">
                  Transform
                </span>{" "}
                your{" "}
                <span className="bg-gradient-to-r from-[#2E3191] to-[#F89F2D] bg-clip-text text-transparent">
                  Brand
                </span>{" "}
                with{" "}
                <span className="bg-gradient-to-r from-[#2E3191] to-[#F89F2D] bg-clip-text text-transparent">
                  Cutting-Edge
                </span>{" "}
                Tech
              </h1>
              <p className="mt-4 md:mt-6 text-md md:text-xl text-gray-600">
                We help brands leverage technology to drive growth, enhance customer experiences, and stay ahead of the competition.
              </p>
              <p className="mt-2 md:mt-4 text-md md:text-xl text-gray-600">
                From strategy to implementation, we're your tech partner.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center sm:justify-center md:justify-start mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                onClick={() => setGetStartedModalOpen(true)} 
                className="w-[200px] sm:w-[250px] md:w-[300px] py-2 bg-gradient-to-r from-white to-[#F89F2D] text-[#2E3191] font-semibold rounded-lg shadow-lg hover:from-[#f7e6c3] hover:to-[#f79e1b] transition duration-300 ease-in-out">
                  Get Started
                </button>
                <button
                  onClick={() => setConsultationModalOpen(true)} 
                  className="w-[200px] sm:w-[250px] md:w-[300px] py-2 bg-transparent border-2 border-[#F89F2D] text-[#F89F2D] font-semibold rounded-lg hover:bg-[#F89F2D] hover:text-[#2E3191] transition duration-300 ease-in-out"
                >
                  Book Consultation
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 w-full flex items-center justify-center overflow-visible">
              <img
                src={heroImage}
                alt="Hero Section Image"
                className="w-4/5 max-w-[520px] h-auto object-cover"
                style={{ animation: 'bounce 4s ease-in-out infinite' }}
              />
            </div>
          </div>
        </Wrapper>

        <style jsx>{`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            25% {
              transform: translateY(-20px);
            }
            50% {
              transform: translateY(0);
            }
            75% {
              transform: translateY(-10px);
            }
          }

          @media (max-width: 640px) {
            section {
              margin-top: 0;
            }
            .flex-col {
              flex-direction: column;
            }
            .mb-8 {
              margin-bottom: 20px;
            }
            img {
              max-width: 90%;
            }
            .justify-center {
              justify-content: center !important;
            }
          }
        `}</style>
      </section>

      {/* Modal Component Render */}
      <ConsultationModal isOpen={isConsultationModalOpen} onClose={() => setConsultationModalOpen(false)} />
      <RequirementsModal isOpen={isGetStartedModalOpen} onClose={() => setGetStartedModalOpen(false)} />
    </>
  );
};

export default Hero;
