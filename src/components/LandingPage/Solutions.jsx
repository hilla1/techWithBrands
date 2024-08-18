import React, { useEffect, useState } from 'react';
import Wrapper from '../reusable/Wrapper';
import Card from '../reusable/Card';
import solutionsData from '../../assets/data/solutions.json';
import bgSolutions from '../../assets/bgSolutions.jpg';
import { FaLightbulb, FaCog, FaLaptopCode, FaMobileAlt, FaChartLine, FaTasks } from 'react-icons/fa';

// Map icons to their respective components
const iconMap = {
  FaLaptopCode: FaLaptopCode,
  FaMobileAlt: FaMobileAlt,
  FaChartLine: FaChartLine,
  FaTasks: FaTasks,
};

const Solutions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 4;
  const totalCards = solutionsData.length;
  const cardWidth = 320; // Width of each card
  const visibleCards = cardsPerPage;

  // Inline styles for animations
  const spinAnimation = {
    animation: 'spin 20s linear infinite',
  };

  const pulseAnimation = {
    animation: 'pulse 2s ease-in-out infinite',
  };

  // Keyframes for animations
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0% {
        text-shadow: 0 0 5px rgba(248, 159, 45, 0.5);
        color: rgba(248, 159, 45, 1);
      }
      50% {
        text-shadow: 0 0 20px rgba(248, 159, 45, 1);
        color: rgba(248, 159, 45, 0.7);
      }
      100% {
        text-shadow: 0 0 5px rgba(248, 159, 45, 0.5);
        color: rgba(248, 159, 45, 1);
      }
    }
  `;

  // Inject keyframes into the document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [keyframes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (totalCards - visibleCards + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [totalCards, visibleCards]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : totalCards - visibleCards));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < totalCards - visibleCards ? prevIndex + 1 : 0));
  };

  return (
    <div
      className="relative bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgSolutions})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a background color overlay for better text visibility
      }}
    >
      <Wrapper>
        {/* Main Title with Icons */}
        <div className="text-center mb-8 px-4">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center space-x-4"
            style={{
              color: 'var(--secondary-color)', // Set title color to secondary color
            }}
          >
            <FaLightbulb
              className="text-3xl md:text-4xl lg:text-5xl"
              style={pulseAnimation}
            />
            <span>Our Solutions</span>
            <FaCog
              className="text-3xl md:text-4xl lg:text-5xl"
              style={{ ...spinAnimation, color: 'var(--secondary-color)' }} // Set gear icon color to secondary color
            />
          </h1>
        </div>
        <div className="relative overflow-hidden" style={{ height: 'auto' }}>
          <div
            className="flex"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
              transition: 'transform 0.5s ease-in-out',
              width: `${totalCards * cardWidth}px`,
            }}
          >
            {solutionsData.map((card, index) => {
              const IconComponent = iconMap[card.icon];
              return (
                <div
                  key={index}
                  className="flex-none w-80 mx-2 sm:mx-4"
                  style={{
                    maxWidth: '320px',
                  }}
                >
                  <Card
                    icon={IconComponent}
                    title={card.title}
                    description={card.description}
                    ctaText={card.ctaText}
                  />
                </div>
              );
            })}
          </div>
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-2 sm:px-4">
            <button 
              onClick={handlePrevClick}
              className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] focus:outline-none text-xl sm:text-2xl md:text-3xl p-2 sm:p-3 rounded-full shadow-lg">
              &lt;
            </button>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2 sm:px-4">
            <button 
              onClick={handleNextClick}
              className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] focus:outline-none text-xl sm:text-2xl md:text-3xl p-2 sm:p-3 rounded-full shadow-lg">
              &gt;
            </button>
          </div>
        </div>
        {/* Check out All Solutions Button */}
        <div className="text-center mt-8">
          <a
            href="/all-solutions"
            className="bg-[var(--secondary-color)] text-white py-2 px-6 rounded-lg hover:bg-[var(--primary-color)] focus:outline-none text-lg font-semibold"
          >
            Check out All Solutions
          </a>
        </div>
      </Wrapper>
    </div>
  );
};

export default Solutions;
