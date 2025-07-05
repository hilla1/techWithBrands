// src/components/panel/ProjectCard.jsx
import React from 'react';

const ProjectCard = ({ icon, title, value, change }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>{icon}</div>
        <div
          className={`text-sm font-medium ${
            change.startsWith('+') ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {change}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-[#2E3191]">{value}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
