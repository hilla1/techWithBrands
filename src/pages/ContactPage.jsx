import React from 'react';
import Navbar from '../components/reusable/Navbar';
import Footer from '../components/reusable/Footer';
import Contact from '../components/reusable/Contact';
import Contactmap from '../components/contact/Contactmap'; 

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <Contactmap /> 
      <Contact />
      <Footer />
    </>
  );
};

export default ContactPage;
