// src/components/tabs/ProjectsTab.jsx
import React, { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

const ProjectsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgress, setFilterProgress] = useState('All');

  const projects = [
    {
      id: 1,
      title: 'Mobile App Redesign',
      client: 'ABC Corp',
      progress: 80,
    },
    {
      id: 2,
      title: 'E-commerce Setup',
      client: 'XYZ Ltd',
      progress: 45,
    },
    {
      id: 3,
      title: 'Website Launch',
      client: 'FooBar Inc',
      progress: 100,
    },
    {
      id: 4,
      title: 'Marketing Campaign',
      client: 'StartupX',
      progress: 20,
    },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesProgress = true;
    if (filterProgress === 'Completed') matchesProgress = project.progress === 100;
    else if (filterProgress === 'In Progress') matchesProgress = project.progress > 0 && project.progress < 100;
    else if (filterProgress === 'Not Started') matchesProgress = project.progress === 0;

    return matchesSearch && matchesProgress;
  });

  return (
    <div>
      {/* Header: Search, Filter & Add New */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Search and Filter on left */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search projects..."
            className="rounded-md px-4 py-2 text-sm bg-gradient-to-r from-[#f1f1f1] to-[#e4e4ff] text-gray-700 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E3191] w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded-md px-4 py-2 text-sm bg-gradient-to-r from-[#f1f1f1] to-[#e4e4ff] text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            value={filterProgress}
            onChange={(e) => setFilterProgress(e.target.value)}
          >
            <option value="All">All Progress</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Add New Project button on right */}
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-gradient-to-r from-[#bfc9ff] to-[#ffe4c2] text-gray-800 px-6 py-2 rounded-md font-semibold hover:opacity-90 transition text-sm shadow-sm">
            + Add New Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition relative border border-gray-100"
            >
              {/* Actions Menu */}
              <div className="absolute top-4 right-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreVertical />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-[#2E3191] mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-medium text-gray-600">Client:</span> {project.client}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#bfc9ff] to-[#ffe4c2]"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-500">{project.progress}% Completed</p>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;
