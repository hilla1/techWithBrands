import React from 'react';

const TestimonialCard = ({ name, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 p-6 flex flex-col h-full">
      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-[var(--primary-color)] mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
        "{description}"
      </p>

      {/* Author */}
      <p className="text-gray-500 dark:text-gray-400 text-right">
        — {name}
      </p>
    </div>
  );
};

export default TestimonialCard;
