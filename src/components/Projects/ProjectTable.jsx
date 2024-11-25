import React from 'react';
import { IconButton } from '@mui/material';
import { FaEllipsisV } from 'react-icons/fa';

const ProjectTable = ({ projects, onRowClick, onMenuClick, onEditClick }) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="min-w-full text-left border border-gray-200 rounded-lg shadow-md">
      <thead className="bg-gray-100">
        <tr className="text-sm font-semibold text-gray-700">
          <th className="py-3 px-4 border-b">Project Name</th>
          <th className="py-3 px-4 border-b">Number of Modules</th>
          <th className="py-3 px-4 border-b">Manager</th>
          <th className="py-3 px-4 border-b">Completion Date</th>
          <th className="py-3 px-4 border-b">Progress (%)</th>
          <th className="py-3 px-2 border-b w-12 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr
            key={project._id}
            className="hover:bg-gray-100 cursor-pointer"
            onClick={() => onRowClick(project._id)}
          >
            <td className="py-4 px-4 border-b text-gray-900">{project.title}</td>
            <td className="py-4 px-4 border-b text-gray-600">{project.modules.length}</td>
            <td className="py-4 px-4 border-b text-gray-600 flex items-center">
              <img
                src={project.manager?.avatar || '/defaults/default-avatar.png'}
                alt={project.manager?.name || 'Default Avatar'}
                className="w-8 h-8 rounded-full mr-2"
              />
              {project.manager?.name || 'N/A'}
            </td>
            <td className="py-4 px-4 border-b text-gray-600">{new Date(project.deadline).toLocaleDateString()}</td>
            <td className="py-4 px-4 border-b">
              <div className={`py-1 px-3 rounded ${getProgressColor(project.progress || 0)}`}>
                {project.progress || 0}%
              </div>
            </td>
            <td className="py-4 px-2 border-b text-center">
              <IconButton 
                onClick={(event) => {
                  event.stopPropagation(); // Prevent the row click event
                  onMenuClick(event, project._id);
                }}
              >
                <FaEllipsisV />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const getProgressColor = (progress) => {
  if (progress < 50) return 'bg-yellow-300 text-yellow-800'; // Warning
  if (progress < 100) return 'bg-orange-300 text-orange-800'; // In-progress
  return 'bg-green-300 text-green-800'; // Complete
};

export default ProjectTable;
