// src/hooks/useNavbar.js
import { useState, useEffect } from 'react';

// Custom hook to manage the state and behavior of the Navbar
export const useNavbar = () => {
  // State to track the current scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  // State to determine if the navbar is visible (not scrolled off the screen)
  const [visible, setVisible] = useState(true);
  // State to control the open/closed state of the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State to determine if the page has been scrolled (used for changing navbar appearance)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Function to handle scroll events
    const handleScroll = () => {
      // Get the current scroll position
      const currentScrollPosition = window.pageYOffset;
      // Update visibility based on scroll direction
      setVisible(scrollPosition > currentScrollPosition);
      // Update the current scroll position state
      setScrollPosition(currentScrollPosition);
      // Update scrolled state based on whether the scroll position is greater than 0
      setIsScrolled(currentScrollPosition > 0);
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);
    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollPosition]); // Dependency array to re-run the effect when scrollPosition changes

  // Function to toggle the state of the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Return the current state and functions to be used in the Navbar component
  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    isScrolled,
    visible
  };
};
