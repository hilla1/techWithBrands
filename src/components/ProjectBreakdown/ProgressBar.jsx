import React from 'react';

const getProgressColor = (progress) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 lg:h-4">
    <div
      className={`${getProgressColor(progress)} h-2 lg:h-4 rounded-full`}
      style={{ width: `${progress}%` }}
    ></div>
    <span className="text-xs lg:text-sm">{progress}%</span>
  </div>
);

export default ProgressBar;
