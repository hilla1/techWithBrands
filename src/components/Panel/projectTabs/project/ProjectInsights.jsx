// components/ProjectDashboard/ProjectInsights.jsx
import { FiFileText } from "react-icons/fi";

export default function ProjectInsights({ recentFiles, teamActivity }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Files</h3>
        <div className="space-y-3">
          {recentFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
              <FiFileText className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{f.name}</p>
                <p className="text-xs text-gray-500">
                  {f.type} • {f.size} • {f.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Activity</h3>
        <div className="space-y-4">
          {teamActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {a.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{a.user}</span> {a.action}{" "}
                  <span className="font-medium">{a.item}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
