import React from 'react';

const Spinner = ({ size = 'medium' }) => {
  // Define size classes based on prop
  const sizeClasses = {
    small: 'w-8 h-8 border-2 border-t-2',
    medium: 'w-16 h-16 border-4 border-t-4',
    large: 'w-24 h-24 border-6 border-t-6',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`border-gray-300 border-t-[--primary-color] rounded-full animate-spin ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default Spinner;
