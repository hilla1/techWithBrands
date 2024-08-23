import React, { useState, useEffect, useRef } from 'react';
import Wrapper from '../reusable/Wrapper';
import TestimonialCard from '../reusable/TestimonialCard';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1); // Default to 1 card
  const wrapperRef = useRef(null);
  const cardMargin = 16;

  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "Consultation Services",
      description: "TechwithBrands' consultation services transformed our business approach. Their insights and recommendations were spot-on and helped us streamline our processes effectively.",
    },
    {
      name: "David Lee",
      title: "Tech Solutions",
      description: "The tech solutions provided by TechwithBrands were incredible. From web apps to mobile solutions, their work turned our ideas into powerful tools that really drive our business forward.",
    },
    {
      name: "Emma Carter",
      title: "Brand Solutions",
      description: "TechwithBrands crafted a brand guide that perfectly captured our vision. Their attention to detail and creativity helped us build a strong and cohesive brand identity.",
    },
    {
      name: "Michael Brown",
      title: "Client Services",
      description: "Managing our projects and payments has never been easier with TechwithBrands. Their client services are top-notch, making our interactions smooth and hassle-free.",
    },
    {
      name: "Olivia Martinez",
      title: "Account Management",
      description: "The account management system from TechwithBrands is a game-changer. It allows us to handle budgets, invoices, and progress reports with ease, saving us valuable time and effort.",
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;

        // Calculate cardsPerPage based on screen size
        if (wrapperWidth < 640) {
          setCardsPerPage(1); // 1 card on mobile
        } else if (wrapperWidth < 1024) {
          setCardsPerPage(2); // 2 cards on tablet
        } else {
          setCardsPerPage(4); // 4 cards on desktop
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

  const totalCards = testimonials.length;
  const maxIndex = Math.max(totalCards - cardsPerPage, 0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, maxIndex);
      return newIndex;
    });
  };

  return (
    <div className="bg-[#1d2356]">
      <Wrapper>
        <div className="text-center mb-12 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--secondary-color)]">
            What Our Clients Say
          </h1>
        </div>
        <div className="relative overflow-hidden" ref={wrapperRef}>
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * (cardWidth + cardMargin)}px)`,
              width: `${totalCards * (cardWidth + cardMargin)}px`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-none"
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${cardMargin}px`,
                }}
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
          <button
            onClick={handlePrevClick}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 bg-[rgba(248,159,45,0.6)] text-[#1d2356] rounded-full shadow-lg border-[#1d2356] hover:bg-[rgba(248,159,45,0.8)] hover:text-white transition-colors duration-300"
          >
            &lt;
          </button>
          <button
            onClick={handleNextClick}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 bg-[rgba(248,159,45,0.6)] text-[#1d2356] rounded-full shadow-lg border-[#1d2356] hover:bg-[rgba(248,159,45,0.8)] hover:text-white transition-colors duration-300"
          >
            &gt;
          </button>
        </div>
        <div className="text-center mt-8">
          <a
            href="/testimonials"
            className="bg-[var(--secondary-color)] text-white py-2 px-6 rounded-lg hover:bg-[var(--primary-color)]"
          >
            See All Testimonials
          </a>
        </div>
      </Wrapper>
    </div>
  );
};

export default Testimonials;
