// Header.jsx
import { FiArrowLeft, FiPlus, FiUpload } from "react-icons/fi";
import NotificationButton from "./NotificationButton";

export default function Header({
  project,
  onBackToProjects,
  showNotifications,
  toggleNotifications,
  notifications,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        {onBackToProjects && (
          <button
            onClick={onBackToProjects}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {project.title}
          </h1>
          <p className="text-gray-500 mt-1">Client: {project.client}</p>
        </div>
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm">
          <FiPlus className="h-4 w-4" />
          Add Task
        </button>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm">
          <FiUpload className="h-4 w-4" />
          Upload File
        </button>
        <NotificationButton
          notifications={notifications}
          show={showNotifications}
          toggle={toggleNotifications}
        />
      </div>
    </div>
  );
}
