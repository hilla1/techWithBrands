import React, { useEffect, useState, useRef } from 'react';
import Wrapper from '../reusable/Wrapper';
import Card from '../reusable/Card';
import solutionsData from '../../assets/data/solutions.json';
import bgSolutions from '../../assets/bgSolutions.jpg';
import { FaLightbulb, FaCog, FaLaptopCode, FaMobileAlt, FaChartLine, FaTasks } from 'react-icons/fa';

const iconMap = {
  FaLaptopCode: FaLaptopCode,
  FaMobileAlt: FaMobileAlt,
  FaChartLine: FaChartLine,
  FaTasks: FaTasks,
};

const Solutions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const wrapperRef = useRef(null);
  const [cardsPerPage, setCardsPerPage] = useState(4); // Default number of cards per page
  const cardMargin = 16; // Adjust for margin (8px each side)

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;

        // Adjust cardsPerPage based on screen width
        if (wrapperWidth < 640) {
          setCardsPerPage(1); // 1 card on mobile screens
        } else if (wrapperWidth < 1024) {
          setCardsPerPage(2); // 2 cards on tablet screens
        } else if (wrapperWidth < 1280) {
          setCardsPerPage(3); // 3 cards on smaller desktops
        } else {
          setCardsPerPage(4); // 4 cards on larger desktops
        }

        setCardWidth((wrapperWidth / cardsPerPage) - cardMargin);
      }
    };

    // Initial calculation
    handleResize();

    // Recalculate on window resize
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [cardsPerPage]);

  const totalCards = solutionsData.length;
  const maxIndex = totalCards - cardsPerPage;

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  return (
    <div
      className="relative bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgSolutions})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Wrapper>
        <div ref={wrapperRef}>
          {/* Main Title with Icons */}
          <div className="text-center mb-8 px-4">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center space-x-4"
              style={{
                color: 'var(--secondary-color)',
              }}
            >
              <FaLightbulb className="text-3xl md:text-4xl lg:text-5xl animate-pulse" />
              <span>Our Solutions</span>
              <FaCog
                className="text-3xl md:text-4xl lg:text-5xl"
                style={{ animation: 'spin 20s linear infinite', color: 'var(--secondary-color)' }}
              />
            </h1>
          </div>
          <div className="relative overflow-hidden">
            <div
              className="flex justify-center"
              style={{
                transform: `translateX(-${currentIndex * (cardWidth + cardMargin)}px)`,
                transition: 'transform 0.5s ease-in-out',
                width: `${totalCards * (cardWidth + cardMargin)}px`,
              }}
            >
              {solutionsData.map((card, index) => {
                const IconComponent = iconMap[card.icon];
                return (
                  <div
                    key={index}
                    className="flex-none mx-2"
                    style={{
                      width: `${cardWidth}px`,
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
                className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] focus:outline-none text-xl sm:text-2xl md:text-3xl p-2 sm:p-3 rounded-full shadow-lg opacity-50 hover:opacity-80 transition-opacity duration-300"
              >
                &lt;
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2 sm:px-4">
              <button
                onClick={handleNextClick}
                className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] focus:outline-none text-xl sm:text-2xl md:text-3xl p-2 sm:p-3 rounded-full shadow-lg opacity-50 hover:opacity-80 transition-opacity duration-300"
              >
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
        </div>
      </Wrapper>
    </div>
  );
};

export default Solutions;
