import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../reusable/Navbar';
import Footer from '../reusable/Footer';
import SuccessMessage from './SuccessMessage';
import ErrorMessage from './ErrorMessage';
import InvalidTokenMessage from './InvalidTokenMessage';
import { motion } from 'framer-motion';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const [messageComponent, setMessageComponent] = useState(null);

  useEffect(() => {
    switch (status) {
      case 'success':
        setMessageComponent(<SuccessMessage />);
        break;
      case 'error':
        setMessageComponent(<ErrorMessage />);
        break;
      case 'invalid':
        setMessageComponent(<InvalidTokenMessage />);
        break;
      default:
        setMessageComponent(<p>Processing your request...</p>);
    }
  }, [status]);

  return (
  <>
    <Navbar/>
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-2xl w-full">
        {messageComponent}
      </div>
    </motion.div>
    <Footer/>
    </>
  );
};

export default Unsubscribe;
