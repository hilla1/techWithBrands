// components/ProjectCard.jsx
import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const ProjectCard = ({ project, onRowClick, onMenuClick }) => (
  <div className="border rounded-lg shadow-md p-4 mb-4 relative">
    <button
      onClick={(event) => onMenuClick(event, project._id)}
      className="absolute top-4 right-2"
    >
      <FaEllipsisV />
    </button>
    <h3
      className="text-lg font-semibold text-gray-900 cursor-pointer"
      onClick={() => onRowClick(project._id)}
    >
      {project.title}
    </h3>
    <p className="text-gray-600"><strong>Modules:</strong> {project.modules.length}</p>
    <div className="flex items-center my-2">
      <img
        src={project.manager?.avatar || '/defaults/default-avatar.png'}
        alt={project.manager?.name || 'Default Avatar'}
        className="w-8 h-8 rounded-full mr-2"
      />
      <p className="text-gray-600">{project.manager?.name || 'N/A'}</p>
    </div>
    <p className="text-gray-600"><strong>Completion Date:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
    <div className={`py-1 px-3 mt-2 rounded ${getProgressColor(project.progress || 0)}`}>
      <strong>Progress:</strong> {project.progress || 0}%
    </div>
  </div>
);

const getProgressColor = (progress) => {
  if (progress < 50) return 'bg-yellow-300 text-yellow-800'; // Warning
  if (progress < 100) return 'bg-orange-300 text-orange-800'; // In-progress
  return 'bg-green-300 text-green-800'; // Complete
};

export default ProjectCard;
