// components/ProjectDashboard/TabNavigation.jsx
import { FiGrid, FiMessageSquare, FiCheck } from "react-icons/fi";

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: <FiGrid className="h-4 w-4" /> },
    {
      id: "collaboration",
      label: "Collaboration",
      icon: <FiMessageSquare className="h-4 w-4" />,
    },
    {
      id: "approval",
      label: "Approval",
      icon: <FiCheck className="h-4 w-4" />,
    },
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
