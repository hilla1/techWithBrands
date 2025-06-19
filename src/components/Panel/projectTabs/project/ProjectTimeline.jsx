// components/ProjectDashboard/ProjectTimeline.jsx
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

export default function ProjectTimeline({ projectPhases, milestones }) {
  const getStatusIcon = (status) => {
    if (status === "completed") return <FiCheckCircle className="h-4 w-4 text-emerald-500" />;
    if (status === "active") return <FiAlertTriangle className="h-4 w-4 text-blue-400" />;
    return <FiAlertTriangle className="h-4 w-4 text-gray-300" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700";
      case "active":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Project Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Project Timeline</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200"></div>
          <div className="space-y-4">
            {projectPhases.map((phase) => (
              <div key={phase.id} className="relative flex items-start gap-4">
                <div className="relative z-10 flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-white">
                    {getStatusIcon(phase.status)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-800">{phase.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(phase.status)}`}>
                      {phase.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {phase.startDate} - {phase.endDate}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        phase.status === "completed"
                          ? "bg-emerald-400"
                          : phase.status === "active"
                          ? "bg-blue-300"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500">{phase.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Milestones */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Current Milestones</h2>
        <div className="space-y-3">
          {milestones.map((m) => (
            <div key={m.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-800">{m.title}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Due: {m.dueDate}</span>
                  {getStatusIcon(m.status)}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                <div
                  className={`h-1.5 rounded-full ${
                    m.status === "completed"
                      ? "bg-emerald-400"
                      : m.status === "active"
                      ? "bg-blue-300"
                      : "bg-gray-300"
                  }`}
                  style={{ width: `${m.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-gray-700">{m.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
