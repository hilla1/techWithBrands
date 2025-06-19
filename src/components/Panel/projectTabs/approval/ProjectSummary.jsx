// components/FinalApproval/ProjectSummary.jsx
import { FiCheck } from "react-icons/fi"

export default function ProjectSummary({ summary }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-orange-500 to-yellow-500 mb-6">
        Project Summary Overview
      </h2>

      {/* Project Info & Technologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Project Name:</span>
              <span className="font-medium text-gray-800">{summary.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-800">{summary.duration}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-green-600">Completed</span>
            </div>
          </div>
        </div>

        {/* Technologies Used */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Technologies Used</h3>
          <div className="flex flex-wrap gap-2">
            {summary.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Completed Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {summary.completedFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition"
            >
              <FiCheck className="text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Members</h3>
        <div className="space-y-1 pl-1">
          {summary.teamMembers.map((member, index) => (
            <div key={index} className="text-sm text-gray-700 leading-relaxed">
              • {member}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
