// DashboardContainer.jsx
import { useState, useEffect } from "react";
import ProjectDashboard from "../ProjectDashboard";

// Replace or enhance this with real API fetch
const fetchProjectData = async (projectId) => {
  // mock delay
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        id: projectId,
        title: "Alpha Project",
        client: "Acme Corp",
        progress: 65,
      });
    }, 500)
  );
};

export default function DashboardContainer({ projectId, onBackToProjects }) {
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProjectData(projectId)
      .then(setProject)
      .catch((err) => console.error("Failed to load project:", err));
  }, [projectId]);

  if (!project) return <div>Loading project...</div>;

  return (
    <ProjectDashboard project={project} onBackToProjects={onBackToProjects} />
  );
}
