// components/ProjectDashboard/OverviewTab.jsx
import ProjectSummary from "./ProjectSummary";
import ProjectTimeline from "./ProjectTimeline";
import ProjectInsights from "./ProjectInsights";

export default function OverviewTab({ project }) {
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
      progress: project.progress || 0,
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
    {
      id: 1,
      title: "User Authentication System",
      progress: 100,
      dueDate: "2024-02-15",
      status: "completed",
    },
    {
      id: 2,
      title: "Dashboard UI Components",
      progress: 85,
      dueDate: "2024-03-01",
      status: "active",
    },
    {
      id: 3,
      title: "Payment Integration",
      progress: 40,
      dueDate: "2024-03-15",
      status: "active",
    },
    {
      id: 4,
      title: "Admin Panel",
      progress: 0,
      dueDate: "2024-04-01",
      status: "pending",
    },
  ];

  const recentFiles = [
    {
      name: "Dashboard_Mockup_v2.fig",
      type: "Figma",
      time: "2 hours ago",
      size: "2.4 MB",
    },
    {
      name: "API_Documentation.pdf",
      type: "PDF",
      time: "1 day ago",
      size: "1.8 MB",
    },
    {
      name: "User_Flow_Diagram.png",
      type: "Image",
      time: "2 days ago",
      size: "856 KB",
    },
    {
      name: "Database_Schema.sql",
      type: "SQL",
      time: "3 days ago",
      size: "12 KB",
    },
  ];

  const teamActivity = [
    {
      user: "Sarah Chen",
      action: "completed task",
      item: "User authentication",
      time: "2 hours ago",
    },
    {
      user: "Mike Johnson",
      action: "uploaded file",
      item: "Dashboard mockup v2",
      time: "4 hours ago",
    },
    {
      user: "Emily Davis",
      action: "commented on",
      item: "Payment integration",
      time: "1 day ago",
    },
  ];

  return (
    <>
      <ProjectSummary progress={project.progress} />
      <ProjectTimeline projectPhases={projectPhases} milestones={milestones} />
      <ProjectInsights recentFiles={recentFiles} teamActivity={teamActivity} />
    </>
  );
}
