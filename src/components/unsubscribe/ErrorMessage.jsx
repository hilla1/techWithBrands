import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';

const ErrorMessage = () => {
  return (
    <motion.div
      className="text-center"
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AiFillCloseCircle className="mx-auto text-red-500" size={96} />
      <h1 className="text-3xl font-bold text-red-600 mt-6">Oops! Something went wrong.</h1>
      <p className="text-gray-600 mt-4">There was an error processing your request. Please try again later.</p>
    </motion.div>
  );
};

export default ErrorMessage;
