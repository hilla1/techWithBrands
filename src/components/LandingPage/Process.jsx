import React from 'react';
import { FaEnvelope, FaHandshake, FaCogs, FaLongArrowAltRight, FaLongArrowAltDown } from 'react-icons/fa';
import Wrapper from '../reusable/Wrapper'; // Adjust path as needed

// Card component to display each step
const Card = ({ icon, title, description }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs mx-4 border border-gray-200 transition-colors hover:bg-[#F9A826] hover:text-white">
    <div className="flex justify-center items-center text-5xl mb-4 text-[var(--primary-color)]">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
    <p className="text-gray-700 text-center">{description}</p>
  </div>
);

const Process = () => {
  return (
    <div className="bg-gray-100 py-12">
      <Wrapper>
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Title and Description */}
          <div className="md:w-1/4 mb-8 md:mb-0 md:pr-8 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-4 text-[var(--primary-color)]">Our Process</h1>
            <p className="text-lg text-gray-600">
              TwB offers innovative, long-term solutions. Getting started is easy—contact us today to begin your transformation.
            </p>
          </div>
          {/* Cards and arrows */}
          <div className="flex flex-col md:flex-row items-center md:items-start overflow-x-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
              {/* Contact Us Card */}
              <Card
                icon={<FaEnvelope />}
                title="Contact Us"
                description="Reach out via email or WhatsApp to book a consultation. We’ll confirm your appointment and send reminders."
              />
              {/* Arrow */}
              <FaLongArrowAltDown className="text-[var(--secondary-color)] text-4xl md:hidden" />
              <FaLongArrowAltRight className="hidden md:block text-[var(--secondary-color)] text-4xl md:text-5xl" />
              {/* Meeting Card */}
              <Card
                icon={<FaHandshake />}
                title="Meeting"
                description="Share your vision, mission, and goals with us. We’ll collaborate to craft a plan tailored to your long-term needs."
              />
              {/* Arrow */}
              <FaLongArrowAltDown className="text-[var(--secondary-color)] text-4xl md:hidden" />
              <FaLongArrowAltRight className="hidden md:block text-[var(--secondary-color)] text-4xl md:text-5xl" />
              {/* Implementation Card */}
              <Card
                icon={<FaCogs />}
                title="Implementation"
                description="We turn your solutions into reality, focusing on practical actions to deliver long-term value."
              />
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default Process;
