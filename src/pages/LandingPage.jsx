import React, { useState, useEffect } from 'react';
import Navbar from '../components/reusable/Navbar';
import Hero from '../components/LandingPage/Hero';
import Features from '../components/LandingPage/Features';
import Solutions from '../components/LandingPage/Solutions';
import Process from '../components/LandingPage/Process';
import Pricing from '../components/LandingPage/Pricing';
import Blog from '../components/LandingPage/Blog';
import Testimonials from '../components/LandingPage/Testimonials';
import Contact from '../components/reusable/Contact';
import Footer from '../components/reusable/Footer';
import SplashScreen from '../components/reusable/SplashScreen';

const LandingPage = () => {
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already visited the site
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      // If the user is visiting for the first time, show the splash screen
      setIsSplashScreenVisible(true);
      // Set a flag in localStorage to indicate the user has visited
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleSplashScreenFinish = () => {
    setIsSplashScreenVisible(false); // Hide the splash screen after it finishes
  };

  return (
    <>
      {isSplashScreenVisible ? (
        <SplashScreen onFinish={handleSplashScreenFinish} />
      ) : (
        <>
          <Navbar />
          <Hero />
          <Features />
          <Solutions />
          <Process />
          <Pricing />
          <Blog />
          <Testimonials />
          <Contact />
          <Footer />
        </>
      )}
    </>
  );
};

export default LandingPage;
