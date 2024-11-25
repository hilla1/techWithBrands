import React from 'react';

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full flex items-center justify-center border border-gray-300"
      onClick={onClick}
    >
      <span className="text-2xl text-orange-500">&lt;</span>
    </div>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full flex items-center justify-center border border-gray-300"
      onClick={onClick}
    >
      <span className="text-2xl text-orange-500">&gt;</span>
    </div>
  );
};

export { PrevArrow, NextArrow };
