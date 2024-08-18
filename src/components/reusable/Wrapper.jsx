import React from 'react';

const Wrapper = ({ children }) => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-4 lg:px-4 py-8 md:py-12">
      <div className="xl:mx-20 md:mx-2">
      {children}
      </div>
    </div>
  );
};

export default Wrapper;
