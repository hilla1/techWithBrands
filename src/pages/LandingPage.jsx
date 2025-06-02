import React, { useState, useEffect } from 'react';
import Navbar from '../components/reusable/Navbar';
import Hero from '../components/LandingPage/Hero';
import Services from '../components/LandingPage/Services';
import WhyChooseUs from '../components/LandingPage/WhyChooseUs';
import Process from '../components/LandingPage/Process';
import CallToAction from '../components/LandingPage/CallToAction';
import Blog from '../components/LandingPage/Blog';
import Contact from '../components/reusable/Contact';
import Footer from '../components/reusable/Footer';
import SplashScreen from '../components/reusable/SplashScreen';
import FadeInOnScroll from '../components/reusable/FadeInOnScroll'; 

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
            <Services />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <WhyChooseUs />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Process />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <CallToAction />
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <Blog />
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
