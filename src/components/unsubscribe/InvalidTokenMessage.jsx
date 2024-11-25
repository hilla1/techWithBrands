import React from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';

const InvalidTokenMessage = () => {
  return (
    <motion.div
      className="text-center"
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AiOutlineExclamationCircle className="mx-auto text-yellow-500" size={96} />
      <h1 className="text-3xl font-bold text-yellow-600 mt-6">You already had Unsubscribed</h1>
      <p className="text-gray-600 mt-4">The link has been used already.</p>
    </motion.div>
  );
};

export default InvalidTokenMessage;

