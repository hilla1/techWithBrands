import React from 'react';

const ErrorMessage = ({ message, onRetry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-700 mb-6">{message}</p>
      <button
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  </div>
);

export default ErrorMessage;
