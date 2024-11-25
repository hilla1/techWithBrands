import React, { useState, useEffect } from 'react';
import Wrapper from '../reusable/Wrapper';
import TestimonialCard from '../reusable/TestimonialCard';
import ReusableModal from '../reusable/ReusableModal';
import Spinner from '../reusable/Spinner';
import useApiRequest from '../../hooks/useApiRequest';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);
  const cardGap = 16; // Gap between cards (in pixels)

  // API Request Hook
  const { data: testimonials, loading, error, makeRequest } = useApiRequest();

  // Fetch testimonials from API on component mount
  useEffect(() => {
    makeRequest('/testimonials'); // Adjust the endpoint to your actual API URL
  }, [makeRequest]);

  const totalCards = testimonials ? testimonials.length : 0;

  // Determine number of cards per view based on screen width
  const getCardsPerPage = () => {
    const width = window.innerWidth;
    if (width < 640) return 1; // Mobile (less than 640px)
    if (width < 1024) return 2; // Tablet (640px to 1023px)
    return 4; // Desktop (1024px and above)
  };

  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());

  // Update cardsPerPage on window resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerPage(getCardsPerPage());
      setCurrentIndex(0); // Reset to first card on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update the visible testimonials based on the current index and number of cards per page
  useEffect(() => {
    if (testimonials) {
      setVisibleTestimonials(testimonials.slice(currentIndex, currentIndex + cardsPerPage));
    }
  }, [testimonials, currentIndex, cardsPerPage]);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - cardsPerPage, 0));
    }
  };

  const handleNextClick = () => {
    if (currentIndex + cardsPerPage < totalCards) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + cardsPerPage, totalCards - cardsPerPage));
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Show Spinner while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Error loading testimonials: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1d2356] py-12">
      <Wrapper>
        {/* Title */}
        <div className="text-center mb-12 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--secondary-color)]">
            What Our Clients Say
          </h1>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${cardsPerPage}, minmax(0, 1fr))`,
            }}
          >
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-none w-full px-2"
                style={{ marginRight: `${index < totalCards - 1 ? cardGap : 0}px` }}
              >
                <TestimonialCard
                  name={testimonial.name}
                  title={testimonial.title}
                  description={testimonial.description}
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {totalCards > cardsPerPage && (
            <>
              <button
                onClick={handlePrevClick}
                className={`absolute top-1/2 left-2 transform -translate-y-1/2 px-4 py-2 bg-[rgba(248,159,45,0.6)] text-[#1d2356] rounded-full shadow-lg border-[#1d2356] hover:bg-[rgba(248,159,45,0.8)] hover:text-white transition-colors duration-300 z-10 ${
                  currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentIndex === 0}
                aria-label="Previous Testimonials"
              >
                &lt;
              </button>
              <button
                onClick={handleNextClick}
                className={`absolute top-1/2 right-2 transform -translate-y-1/2 px-4 py-2 bg-[rgba(248,159,45,0.6)] text-[#1d2356] rounded-full shadow-lg border-[#1d2356] hover:bg-[rgba(248,159,45,0.8)] hover:text-white transition-colors duration-300 z-10 ${
                  currentIndex + cardsPerPage >= totalCards
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={currentIndex + cardsPerPage >= totalCards}
                aria-label="Next Testimonials"
              >
                &gt;
              </button>
            </>
          )}
        </div>

        {/* See All Testimonials Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleModalOpen}
            className="bg-[var(--secondary-color)] text-white py-2 px-6 rounded-lg hover:bg-[var(--primary-color)] transition-colors duration-300"
          >
            See All Testimonials
          </button>
        </div>
      </Wrapper>

      {/* Modal for displaying all testimonials */}
      <ReusableModal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">All Testimonials</h2>
          <div className="space-y-4">
            {testimonials &&
              testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  name={testimonial.name}
                  title={testimonial.title}
                  description={testimonial.description}
                />
              ))}
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};

export default Testimonials;
