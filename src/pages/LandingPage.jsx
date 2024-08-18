import React from 'react';
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

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero/>
      <Features/>
      <Solutions/>
      <Process/>
      <Pricing/>
      <Blog/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </>
  );
};

export default LandingPage;
