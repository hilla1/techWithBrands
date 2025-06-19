// ProjectDashboard.jsx
import { useState } from "react";
import Header from "./project/Header";
import TabNavigation from "./project/TabNavigation";
import OverviewTab from "./project/OverviewTab";
import CollaborationTab from "./CollaborationHub";
import ApprovalTab from "./FinalApproval";

export default function ProjectDashboard({ project, onBackToProjects }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: "update", message: "New design mockups uploaded", time: "2 hours ago", unread: true },
    { id: 2, type: "milestone", message: "Authentication milestone completed", time: "1 day ago", unread: true },
    { id: 3, type: "comment", message: "Client feedback on dashboard design", time: "2 days ago", unread: false },
    { id: 4, type: "deadline", message: "Payment integration due in 3 days", time: "3 days ago", unread: false },
  ];

  return (
    <div className="space-y-6">
      <Header
        project={project}
        onBackToProjects={onBackToProjects}
        showNotifications={showNotifications}
        toggleNotifications={() => setShowNotifications((v) => !v)}
        notifications={notifications}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "overview" && <OverviewTab project={project} />}
      {activeTab === "collaboration" && <CollaborationTab />}
      {activeTab === "approval" && <ApprovalTab project={project} />}
    </div>
  );
}
