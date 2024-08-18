import React, { useState, useEffect } from 'react';
import Wrapper from '../reusable/Wrapper';
import heroImage from '../../assets/heroimage3.png';

const Hero = () => {
  const [navbarHeight, setNavbarHeight] = useState(64); // Default height for the navbar

  useEffect(() => {
    const handleResize = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial height

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      className="bg-[#1d2356] pt-6 pb-6"  
      style={{ paddingTop: `${navbarHeight}px` }}
    >
      <Wrapper>
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Section (1/2) */}
          <div className="md:w-1/2 w-full flex flex-col justify-center text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              <span className="bg-gradient-to-r from-white to-[#F89F2D] bg-clip-text text-transparent">
                Sell
              </span>{" "}
              your{" "}
              <span className="bg-gradient-to-r from-white to-[#F89F2D] bg-clip-text text-transparent">
                ideas
              </span>{" "}
              with our{" "}
              <span className="bg-gradient-to-r from-white to-[#F89F2D] bg-clip-text text-transparent">
                consultation
              </span>{" "}
              services.
            </h1>
            <p className="mt-4 md:mt-6 text-md md:text-lg text-white">
              From tech solutions to branding, we turn concepts into reality.
              Develop web apps, mobile solutions, dashboards, and more. Let us guide you through brand
              solutions, offering comprehensive brand guides and packages.
            </p>
            <p className="mt-2 md:mt-4 text-md md:text-lg text-white">
              Seamlessly buy our services, track your project’s progress, and manage
              your accounts all in one place. Our system handles jobs, payment
              calculations, budgeting, invoicing, bookkeeping, and more.
            </p>
            
            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-center md:justify-start mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="w-[200px] sm:w-[250px] md:w-[300px] py-2 bg-gradient-to-r from-white to-[#F89F2D] text-[#2E3191] font-semibold rounded-lg shadow-lg hover:from-[#f7e6c3] hover:to-[#f79e1b] transition duration-300 ease-in-out">
                Get Started
              </button>
              <button className="w-[200px] sm:w-[250px] md:w-[300px] py-2 bg-transparent border-2 border-[#F89F2D] text-[#F89F2D] font-semibold rounded-lg hover:bg-[#F89F2D] hover:text-[#2E3191] transition duration-300 ease-in-out">
                Book Demo
              </button>
            </div>
          </div>

          {/* Right Section (1/2) */}
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
            margin-top: 0; /* Remove top margin on mobile */
          }
          .flex-col {
            flex-direction: column; /* Force column direction on mobile */
          }
          .mb-8 {
            margin-bottom: 20px; /* Increase margin between stacked columns on mobile */
          }
          img {
            max-width: 90%; /* Increase image size a bit on mobile */
          }
          .justify-center {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
