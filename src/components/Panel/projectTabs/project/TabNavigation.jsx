import { FiGrid, FiMessageSquare, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: FiGrid },
    { id: "collaboration", label: "Collaboration", icon: FiMessageSquare },
    { id: "approval", label: "Approval", icon: FiCheck },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-6 sm:space-x-10 px-4 mt-8 md:mt-4 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative pb-1.5 sm:pb-1"
            >
              {/* Icon + Label */}
              <div className="inline-flex items-center gap-2 transition-all duration-300">
                {/* Icon */}
                <Icon
                  className={`transition-colors duration-300 ${
                    isActive ? "text-orange-500" : "text-gray-500 hover:text-gray-700"
                  } h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5`}
                />
                {/* Text */}
                <span
                  className={`font-semibold transition-all duration-300 text-sm sm:text-[15px] md:text-base ${
                    isActive
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-orange-500 to-yellow-400"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </span>
              </div>

              {/* Gradient Underline */}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-600 via-orange-500 to-yellow-400 rounded"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
