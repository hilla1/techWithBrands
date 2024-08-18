import React, { useRef } from 'react';
import Wrapper from '../reusable/Wrapper'; // Ensure this path is correct

// Testimonial Card component
const TestimonialCard = ({ name, title, description, link }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105 w-full md:w-3/4 lg:w-1/2 xl:w-1/4 mx-2 mb-4 flex-shrink-0">
      <div className="p-4">
        <h3 className="text-xl font-bold text-[var(--primary-color)] mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">
          "{description}"
        </p>
        <p className="text-gray-500 mb-2">
          — {name}
        </p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "Consultation Services",
      description: "TechwithBrands' consultation services transformed our business approach. Their insights and recommendations were spot-on and helped us streamline our processes effectively.",
      link: "#consultation-services"
    },
    {
      name: "David Lee",
      title: "Tech Solutions",
      description: "The tech solutions provided by TechwithBrands were incredible. From web apps to mobile solutions, their work turned our ideas into powerful tools that really drive our business forward.",
      link: "#tech-solutions"
    },
    {
      name: "Emma Carter",
      title: "Brand Solutions",
      description: "TechwithBrands crafted a brand guide that perfectly captured our vision. Their attention to detail and creativity helped us build a strong and cohesive brand identity.",
      link: "#brand-solutions"
    },
    {
      name: "Michael Brown",
      title: "Client Services",
      description: "Managing our projects and payments has never been easier with TechwithBrands. Their client services are top-notch, making our interactions smooth and hassle-free.",
      link: "#client-services"
    },
    {
      name: "Olivia Martinez",
      title: "Account Management",
      description: "The account management system from TechwithBrands is a game-changer. It allows us to handle budgets, invoices, and progress reports with ease, saving us valuable time and effort.",
      link: "#account-management"
    }
  ];

  return (
    <div className="bg-[#1d2356]">
      <Wrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h1>
        </div>
        <div className="relative">
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[var(--secondary-color)] text-white px-4 py-2 rounded-full shadow-md z-10"
            onClick={() => scroll('left')}
          >
            &lt;
          </button>
          <div
            ref={scrollContainerRef}
            className="flex overflow-hidden"
          >
            <div className="flex flex-nowrap -mx-2">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  name={testimonial.name}
                  title={testimonial.title}
                  description={testimonial.description}
                  link={testimonial.link}
                />
              ))}
            </div>
          </div>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[var(--secondary-color)] text-white px-4 py-2 rounded-full shadow-md z-10"
            onClick={() => scroll('right')}
          >
            &gt;
          </button>
        </div>
      </Wrapper>
    </div>
  );
};

export default Testimonials;
