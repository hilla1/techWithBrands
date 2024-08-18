import React from 'react';
import Wrapper from '../reusable/Wrapper'; // Adjust path as necessary
import { FaChartLine, FaFileAlt, FaCog, FaStar } from 'react-icons/fa';

// Feature data
const features = [
  {
    id: 1,
    icon: <FaChartLine />,
    title: 'Analysis',
    text: 'You tell us your story and we will build on it. We conduct market research and analysis just for you. Tell us what you need to get started today.'
  },
  {
    id: 2,
    icon: <FaFileAlt />,
    title: 'Reports',
    text: 'You receive reports that you can share with your stakeholders and partners. The reports provide insights from research to implementation.'
  },
  {
    id: 3,
    icon: <FaCog />,
    title: 'Development',
    text: 'You get extra services like database, e-commerce, CMS, and ERP creation or management. We don\'t leave you stuck after showing you the way.'
  }
];

const Features = () => {
  return (
    <Wrapper>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center" style={{ color: 'var(--primary-color)' }}>
          <FaStar className="text-2xl mx-4 shining-star" />
          Our Features
          <FaStar className="text-2xl mx-4 shining-star" />
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(feature => (
          <div
            key={feature.id}
            className="bg-white border border-gray-200 rounded-lg p-6 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            <div className="text-4xl mb-4 flex justify-center" style={{ color: 'var(--primary-color)' }}>
              {feature.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center gradient-text">
              {feature.title}
            </h2>
            <p className="text-gray-700 text-center">
              {feature.text}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .shining-star {
          animation: shine 2s infinite alternate, resize 4s infinite linear;
        }

        @keyframes shine {
          0%, 100% {
            opacity: 1;
            color: var(--secondary-color);
          }
          50% {
            opacity: 0.8;
            color: #ffd700; /* Gold color for shine */
          }
        }

        @keyframes resize {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }
      `}</style>
    </Wrapper>
  );
};

export default Features;
