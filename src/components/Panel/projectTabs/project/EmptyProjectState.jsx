import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import futuristicAnimation from '../../../../assets/lotties/futuristic.json';

const EmptyProjectState = ({ onCreateClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-transparent via-[#ffffff0a] to-[#ffffff10] rounded-lg px-4 py-10 md:py-14">
      {/* Decorative Background Shapes - extra subtle */}
      <div className="absolute -top-28 -left-24 w-[250px] h-[250px] bg-gradient-to-tr from-[#2E3191]/5 to-[#F89F2D]/5 opacity-5 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-24 -right-24 w-[250px] h-[250px] bg-gradient-to-br from-[#F89F2D]/5 to-[#2E3191]/5 opacity-5 rounded-full blur-3xl z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start gap-10"
      >
        {/* Left Column: Smaller Lottie */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-48 sm:w-64 md:w-[320px] lg:w-[360px]">
            <Lottie animationData={futuristicAnimation} loop autoplay />
          </div>
        </motion.div>

        {/* Right Column: Top-aligned text and button */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center md:text-left flex flex-col justify-start space-y-6"
        >
          <h1 className="text-3xl lg:text-4xl md:mt-10 font-extrabold bg-gradient-to-r from-[#2E3191] to-[#F89F2D] bg-clip-text text-transparent leading-tight">
            No Projects Found
          </h1>

          <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto md:mx-0">
            You haven’t created any projects yet. Start one now and organize your work easily.
          </p>

          <motion.button
            onClick={onCreateClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:from-[#1d256a] hover:to-[#e6840c] rounded-md shadow-lg transition-all w-full md:w-fit"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 250 }}
          >
            <FaPlus className="text-sm" />
            Create Project
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmptyProjectState;
