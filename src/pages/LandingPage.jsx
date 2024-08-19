import React, { useState } from 'react';
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
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);

  const handleSplashScreenFinish = () => {
    setIsSplashScreenVisible(false); // Hide the splash screen
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
