import React from 'react';
import Wrapper from '../reusable/Wrapper'; 
import pricingImage from '../../assets/pricing.png'; 

const Pricing = () => {
  return (
    <div className="bg-[#1d2356]">
      <Wrapper>
        {/* Title with orange underline */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold text-orange-400 mb-4 relative"
            style={{
              display: 'inline-block',
              paddingBottom: '0.5rem',
              borderBottom: '4px solid #f97316',  // Orange underline
            }}
          >
            Our Pricing
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Image with bounce animation */}
          <div className="flex justify-center">
            <img 
              src={pricingImage} 
              alt="Pricing illustration" 
              className="w-full max-w-md"
              style={{
                animation: 'bounce 3s infinite',
                transformOrigin: 'center',
              }}
            />
          </div>

          {/* Right Column: Text */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-white">TwB</span> is the Best Custom IT Solution Provider
            </h1>
            <p className="text-lg text-orange-400">
              At <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-400">TwB</span>, we understand that every business is unique. Our pricing plans are flexible to accommodate businesses of all sizes, ensuring that you get the best value for your investment.
            </p>
            <p className="text-lg text-white">
              Whether you're a startup looking for rapid solutions or a corporate enterprise in need of complex IT strategies, we have the perfect plan for you. Our team works closely with you to turn your ideas into cutting-edge IT solutions.
            </p>
            <p className="text-lg text-orange-400">
              Let us help you streamline your operations, enhance your digital presence, and stay ahead of the competition with our comprehensive IT services. Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-400">TwB</span>, where your success is our priority.
            </p>
          </div>
        </div>
      </Wrapper>

      {/* Inline Styles for Keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: ease-in;
          }
          50% {
            transform: translateY(-20px);
            animation-timing-function: ease-out;
          }
        }
      `}</style>
    </div>
  );
};

export default Pricing;
