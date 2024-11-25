import React from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';

const SuccessMessage = () => {
  return (
    <motion.div
      className="text-center"
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AiFillCheckCircle className="mx-auto text-green-500" size={96} />
      <h1 className="text-3xl font-bold text-green-600 mt-6">Successfully Unsubscribed!</h1>
      <p className="text-gray-600 mt-4">
        We're sad to see you go, but we respect your decision. You've successfully been removed from our mailing list. 
        We hope that our paths will cross again someday. If this was a mistake or you've had a change of heart, 
        don't worry—you can always subscribe again! Just scroll down to the footer and click 'Subscribe' to rejoin 
        our community at any time.
      </p>
      <p className="text-gray-600 mt-4">
        We’re grateful for the time you spent with us, and we wish you all the best. Until next time, take care!
      </p>
      <p className="text-blue-500 font-semibold mt-6">
        If you clicked by mistake, scroll down to the footer and subscribe again. We’d love to have you back!
      </p>
    </motion.div>
  );
};

export default SuccessMessage;
