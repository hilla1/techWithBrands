import React, { useEffect, useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import ProjectDashboard from '../projectTabs/ProjectDashboard';
import RequirementsModal from '../projectTabs/RequirementsModal';
import EmptyProjectState from '../projectTabs/project/EmptyProjectState';

const ProjectsTab = () => {
  const {
    fetchProjects,
    projects,
    projectsLoading,
  } = useAuth();

  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgress, setFilterProgress] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    let matchesProgress = true;
    if (filterProgress === 'Completed') matchesProgress = project.progress === 100;
    else if (filterProgress === 'In Progress') matchesProgress = project.progress > 0 && project.progress < 100;
    else if (filterProgress === 'Not Started') matchesProgress = project.progress === 0;

    return matchesSearch && matchesProgress;
  });

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <div>
        <ProjectDashboard
          project={selectedProject}
          onBackToProjects={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Filter & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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

        <div className="w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-gradient-to-r from-[#bfc9ff] to-[#ffe4c2] text-gray-800 px-6 py-2 rounded-md font-semibold hover:opacity-90 transition text-sm shadow-sm"
          >
            + Add New Project
          </button>
        </div>
      </div>

      {/* Content */}
      {projectsLoading ? (
        <div className="flex justify-center items-center h-60">
          <FaSpinner className="animate-spin text-3xl text-[#2E3191]" />
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => handleProjectClick(project)}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition relative border border-gray-100 cursor-pointer hover:border-[#2E3191]"
            >
              <div className="absolute top-4 right-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreVertical />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-[#2E3191] mb-2">
                {project.projectName}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-medium text-gray-600">Client:</span>{' '}
                {project.client?.name || 'N/A'}
              </p>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#bfc9ff] to-[#ffe4c2]"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-500">{project.progress}% Completed</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyProjectState onCreateClick={() => setIsModalOpen(true)} />
      )}

      {/* Create Project Modal */}
      <RequirementsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchProjects();
        }}
      />
    </div>
  );
};

export default ProjectsTab;
