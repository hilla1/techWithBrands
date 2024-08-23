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
import FadeInOnScroll from '../components/reusable/FadeInOnScroll'; // Import the new component

const LandingPage = () => {
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      setIsSplashScreenVisible(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleSplashScreenFinish = () => {
    setIsSplashScreenVisible(false);
  };

  return (
    <>
      {isSplashScreenVisible ? (
        <SplashScreen onFinish={handleSplashScreenFinish} />
      ) : (
        <>
          <Navbar />
          <FadeInOnScroll delay={0}>
            <Hero />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Features />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Solutions />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Process />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Pricing />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Blog />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Testimonials />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Contact />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Footer />
          </FadeInOnScroll>
        </>
      )}
    </>
  );
};

export default LandingPage;
