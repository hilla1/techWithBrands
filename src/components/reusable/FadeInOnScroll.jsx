// src/components/reusable/FadeInOnScroll.js
import React, { useEffect, useRef, useState } from 'react';

const FadeInOnScroll = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (top < windowHeight * 0.8) { // Trigger when element is 80% in view
          setIsVisible(true);
          window.removeEventListener('scroll', handleScroll); // Stop listening once visible
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check visibility on initial load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll;
