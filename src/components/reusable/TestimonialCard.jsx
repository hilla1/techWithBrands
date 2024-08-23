import React from 'react';

const TestimonialCard = ({ name, title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-[var(--primary-color)] mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">
        "{description}"
      </p>
      <p className="text-gray-500 text-right">
        — {name}
      </p>
    </div>
  );
};

export default TestimonialCard;
