import React from 'react';
import { motion } from 'framer-motion';

const SolutionDetails = ({ solution, onShowContactForm }) => {
  return (
    <motion.div
      className="bg-gray-100 shadow-lg rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mt-10">
        <img 
          src={solution.images[0]} 
          alt={solution.title} 
          className="w-full h-64 object-cover" 
          style={{ filter: 'brightness(80%)' }} // Add a slight darkening filter for better contrast
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-4xl font-bold text-white shadow-md">{solution.title}</h1>
        </div>
      </div>
      <div className="p-6 bg-white text-gray-800">
        <p className="text-lg mb-4">{solution.description}</p>
        <a 
          href={solution.cta.href} 
          className="inline-block px-6 py-3 rounded-lg shadow-lg hover:bg-[var(--secondary-color)] transition-transform transform hover:scale-105"
          style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
        >
          {solution.cta.text}
        </a>
      </div>
    </motion.div>
  );
};

export default SolutionDetails;
