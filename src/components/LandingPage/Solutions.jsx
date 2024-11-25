import React, { useEffect, useState, useRef } from 'react';
import Wrapper from '../reusable/Wrapper';
import SolutionCard from '../Solutions/SolutionCard';
import useApiRequest from '../../hooks/useApiRequest';
import bgSolutions from '../../assets/bgSolutions.jpg';
import { FaLightbulb, FaCog } from 'react-icons/fa';
import Spinner from '../reusable/Spinner'; 

const Solutions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const wrapperRef = useRef(null);
  const [cardsPerPage, setCardsPerPage] = useState(4); // Default number of cards per page
  const cardMargin = 16; // Adjust for margin (8px each side)

  const { makeRequest } = useApiRequest(); // Use custom hook to fetch data
  const [solutions, setSolutions] = useState([]); // Store fetched solutions
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch solutions from the backend
  const fetchSolutions = async () => {
    try {
      const fetchedSolutions = await makeRequest('/solutions'); // Replace with your backend API endpoint
      setSolutions(fetchedSolutions);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false); // Stop loading spinner after data is fetched
    }
  };

  useEffect(() => {
    fetchSolutions(); // Fetch solutions when the component mounts

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

  const totalCards = solutions.length;
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
          
          {/* Show Spinner while loading */}
          {loading ? (
            <Spinner size="large" />
          ) : (
            <div className="relative overflow-hidden">
              <div
                className="flex justify-center"
                style={{
                  transform: `translateX(-${currentIndex * (cardWidth + cardMargin)}px)`,
                  transition: 'transform 0.5s ease-in-out',
                  width: `${totalCards * (cardWidth + cardMargin)}px`,
                }}
              >
                {solutions.map((solution, index) => (
                  <div
                    key={index}
                    className="flex-none mx-2"
                    style={{
                      width: `${cardWidth}px`,
                    }}
                  >
                    <SolutionCard
                      key={solution._id}
                      images={solution.images}
                      title={solution.title}
                      description={solution.description}
                      cta={solution.cta}
                      onSelect={() => {}}
                      isSelected={false}
                    />
                  </div>
                ))}
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
          )}

          {/* Check out All Solutions Button */}
          <div className="text-center mt-8">
            <a
              href="/twb-solutions"
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
