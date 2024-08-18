import React from 'react';
import { FaLaptopCode, FaMobileAlt, FaChartLine, FaTasks } from 'react-icons/fa';

// Map icons to their respective components
const iconMap = {
  FaLaptopCode: FaLaptopCode,
  FaMobileAlt: FaMobileAlt,
  FaChartLine: FaChartLine,
  FaTasks: FaTasks,
};

// Define the shake animation keyframes inline
const shakeAnimation = `
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}
`;

// Create a style element with the animation keyframes
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = shakeAnimation;
document.head.appendChild(styleSheet);

const Card = ({ icon: Icon, title, description, ctaText }) => {
  return (
    <div
      className="relative bg-white shadow-md rounded-lg p-6 text-center flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg overflow-hidden w-full max-w-md"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '320px', // Increased size of the card
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      }}
    >
      {/* Icon */}
      <div className="text-4xl text-[var(--primary-color)] mb-4">
        {Icon && <Icon />} {/* Render the icon if available */}
      </div>
      {/* Title */}
      <h2
        className="text-xl font-semibold gradient-text mb-2"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1, // Number of lines to show
          maxWidth: '100%',
        }}
      >
        {title}
      </h2>
      {/* Description */}
      <p
        className="text-gray-600 mb-4"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3, // Number of lines to show
          maxHeight: '4.5rem', // Adjust according to line height
          maxWidth: '100%',
        }}
      >
        {description}
      </p>
      {/* Call to Action Button */}
      <button
        className="bg-[var(--primary-color)] text-white py-2 px-4 rounded hover:bg-[var(--secondary-color)]"
      >
        {ctaText}
      </button>
      {/* Hover Animation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          animation: 'shake 0.3s ease-in-out',
        }}
      />
    </div>
  );
};

export default Card;
