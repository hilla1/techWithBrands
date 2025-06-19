// components/ProjectDashboard/ProjectSummary.jsx
import { FiCalendar, FiCheckCircle, FiUsers, FiLayers } from "react-icons/fi";

export default function ProjectSummary({ progress, projectPhases }) {
  // Calculate completed phases
  const totalPhases = projectPhases?.length || 0;
  const completedPhases = projectPhases?.filter(p => p.status === "completed").length || 0;

  const stats = [
    {
      icon: <FiCalendar className="h-5 w-5 text-blue-500" />,
      label: "Days Remaining",
      value: "42", // Optional: replace with a calculation if needed
    },
    {
      icon: <FiCheckCircle className="h-5 w-5 text-emerald-500" />,
      label: "Completed Tasks",
      value: "24/38", // Optional: make dynamic if needed
    },
    {
      icon: <FiUsers className="h-5 w-5 text-orange-500" />,
      label: "Team Members",
      value: "6", // Optional: make dynamic if needed
    },
    {
      icon: <FiLayers className="h-5 w-5 text-indigo-500" />,
      label: "Project Stage",
      value: `${completedPhases}/${totalPhases}`,
    },
  ];

  return (
    <>
      {/* Project Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-700">Project Progress</h3>
          <span className="text-sm font-medium text-gray-600">
            {progress || 0}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gray-50 rounded-lg">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
