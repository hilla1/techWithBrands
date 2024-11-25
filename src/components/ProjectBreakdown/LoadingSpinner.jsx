import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin h-10 w-10 border-4 border-blue-900 border-t-transparent rounded-full" />
  </div>
);

export default LoadingSpinner;
