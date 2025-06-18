import { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiFileText,
  FiPlus,
  FiUpload,
  FiBell,
  FiCheckCircle,
  FiCircle,
  FiAlertTriangle,
  FiMessageSquare,
  FiFolder,
  FiCheck,
  FiGrid,
  FiArrowLeft
} from "react-icons/fi";
import CollaborationHub from "./CollaborationHub";
import FinalApproval from "./FinalApproval";
import RequirementsWizard from "./RequirementsWizard";

export default function ProjectDashboard({ project, onBackToProjects }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  const projectPhases = [
    {
      id: 1,
      name: "Discovery",
      status: "completed",
      startDate: "2024-01-15",
      endDate: "2024-01-29",
      progress: 100,
    },
    {
      id: 2,
      name: "Design",
      status: "completed",
      startDate: "2024-01-30",
      endDate: "2024-02-19",
      progress: 100,
    },
    {
      id: 3,
      name: "Development",
      status: "active",
      startDate: "2024-02-20",
      endDate: "2024-04-15",
      progress: project?.progress || 65,
    },
    {
      id: 4,
      name: "Testing",
      status: "pending",
      startDate: "2024-04-16",
      endDate: "2024-04-30",
      progress: 0,
    },
    {
      id: 5,
      name: "Deployment",
      status: "pending",
      startDate: "2024-05-01",
      endDate: "2024-05-07",
      progress: 0,
    },
  ];

  const milestones = [
    { id: 1, title: "User Authentication System", progress: 100, dueDate: "2024-02-15", status: "completed" },
    { id: 2, title: "Dashboard UI Components", progress: 85, dueDate: "2024-03-01", status: "active" },
    { id: 3, title: "Payment Integration", progress: 40, dueDate: "2024-03-15", status: "active" },
    { id: 4, title: "Admin Panel", progress: 0, dueDate: "2024-04-01", status: "pending" },
  ];

  const notifications = [
    { id: 1, type: "update", message: "New design mockups uploaded", time: "2 hours ago", unread: true },
    { id: 2, type: "milestone", message: "Authentication milestone completed", time: "1 day ago", unread: true },
    { id: 3, type: "comment", message: "Client feedback on dashboard design", time: "2 days ago", unread: false },
    { id: 4, type: "deadline", message: "Payment integration due in 3 days", time: "3 days ago", unread: false },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="h-4 w-4 text-emerald-500" />;
      case "active":
        return <FiCircle className="h-4 w-4 text-blue-400" />;
      case "pending":
        return <FiCircle className="h-4 w-4 text-gray-300" />;
      default:
        return <FiCircle className="h-4 w-4 text-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const TabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => setActiveTab("overview")}
        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "overview"
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <FiGrid className="h-4 w-4" />
          Overview
        </div>
      </button>
      <button
        onClick={() => setActiveTab("collaboration")}
        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "collaboration"
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <FiMessageSquare className="h-4 w-4" />
          Collaboration
        </div>
      </button>
      <button
        onClick={() => setActiveTab("requirements")}
        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "requirements"
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <FiFolder className="h-4 w-4" />
          Requirements
        </div>
      </button>
      <button
        onClick={() => setActiveTab("approval")}
        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "approval"
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <FiCheck className="h-4 w-4" />
          Approval
        </div>
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Project Progress</h3>
                <span className="text-sm font-medium text-gray-600">{project?.progress || 0}% Complete</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400"
                  style={{ width: `${project?.progress || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                { icon: <FiCalendar className="h-5 w-5 text-blue-500" />, label: "Days Remaining", value: "42" },
                { icon: <FiCheckCircle className="h-5 w-5 text-emerald-500" />, label: "Completed Tasks", value: "24/38" },
                { icon: <FiUsers className="h-5 w-5 text-indigo-500" />, label: "Team Members", value: "6" },
                { icon: <FiClock className="h-5 w-5 text-amber-500" />, label: "Hours Logged", value: "156" },
              ].map((stat, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    ? "bg-blue-400" 
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

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Current Milestones</h2>
                <div className="space-y-3">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-800">{milestone.title}</h3>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500">Due: {milestone.dueDate}</span>
                          {milestone.status === "completed" && <FiCheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                          {milestone.status === "active" && <FiAlertTriangle className="h-3.5 w-3.5 text-blue-400" />}
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            milestone.status === "completed" ? "bg-emerald-400" : "bg-blue-400"
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-gray-700">{milestone.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Files</h3>
                <div className="space-y-3">
                  {[
                    { name: "Dashboard_Mockup_v2.fig", type: "Figma", time: "2 hours ago", size: "2.4 MB" },
                    { name: "API_Documentation.pdf", type: "PDF", time: "1 day ago", size: "1.8 MB" },
                    { name: "User_Flow_Diagram.png", type: "Image", time: "2 days ago", size: "856 KB" },
                    { name: "Database_Schema.sql", type: "SQL", time: "3 days ago", size: "12 KB" },
                  ].map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                      <FiFileText className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.type} • {file.size} • {file.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Activity</h3>
                <div className="space-y-4">
                  {[
                    {
                      user: "Sarah Chen",
                      action: "completed task",
                      item: "User authentication",
                      time: "2 hours ago",
                      avatar: "/placeholder.svg?height=32&width=32",
                    },
                    {
                      user: "Mike Johnson",
                      action: "uploaded file",
                      item: "Dashboard mockup v2",
                      time: "4 hours ago",
                      avatar: "/placeholder.svg?height=32&width=32",
                    },
                    {
                      user: "Emily Davis",
                      action: "commented on",
                      item: "Payment integration",
                      time: "1 day ago",
                      avatar: "/placeholder.svg?height=32&width=32",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {activity.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                          <span className="font-medium">{activity.item}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case "collaboration":
        return <CollaborationHub />;
      case "requirements":
        return <RequirementsWizard />;
      case "approval":
        return <FinalApproval project={project} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
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
            <h1 className="text-2xl font-semibold text-gray-800">{project?.title || "Project Dashboard"}</h1>
            <p className="text-gray-500 mt-1">Client: {project?.client || "Client Name"}</p>
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
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm relative"
            >
              <FiBell className="h-4 w-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-blue-500" : "bg-gray-300"}`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TabNavigation />
      {renderTabContent()}
    </div>
  );
}