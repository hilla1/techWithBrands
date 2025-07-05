import React from 'react';
import Lottie from 'lottie-react';
import { FaSpinner } from 'react-icons/fa';

const ProjectOverview = ({
  projects = [],
  loading,
  onCreateClick,
  onViewMoreClick,
  onProjectClick,
  animation,
}) => {
  const hasProjects = projects.length > 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow min-h-[300px] flex flex-col">
      {/* Show header only when there are projects */}
      {hasProjects && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#2E3191]">All Projects</h3>
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-1 text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#F89F2D] to-[#2E3191] hover:opacity-80 transition"
          >
            <span className="text-lg">+</span> Create Project
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex-grow flex justify-center items-center">
          <FaSpinner className="animate-spin text-2xl text-[#2E3191]" />
        </div>
      ) : !hasProjects ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="w-48 sm:w-56 mb-4">
            <Lottie animationData={animation} loop autoplay />
          </div>
          <p className="text-sm text-gray-600">No projects available.</p>
          <button
            onClick={onCreateClick}
            className="mt-2 text-md lg:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:underline transition"
          >
            + Create Project
          </button>
        </div>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            <ul className="divide-y divide-gray-200 w-full">
              {projects.slice(0, 3).map((project, idx) => (
                <li
                  key={idx}
                  onClick={() => onProjectClick?.(project)}
                  className="py-4 px-2 hover:bg-slate-50 hover:shadow-sm rounded-lg transition cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium text-gray-700">
                      {project.projectName}
                    </span>
                    <span className="text-gray-500">{project.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2E3191] to-[#F89F2D]"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Client: {project.client?.name || 'N/A'}
                  </p>

                  {/* Add divider line if there's only one project */}
                  {projects.length === 1 && <hr className="mt-4 border-gray-200" />}
                </li>
              ))}
            </ul>
          </div>

          {projects.length > 3 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={onViewMoreClick}
                className="text-sm text-[#2E3191] font-medium hover:underline"
              >
                View More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectOverview;
