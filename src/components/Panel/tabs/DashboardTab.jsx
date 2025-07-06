import React, { useEffect, useState } from 'react';
import {
  FaUserFriends,
  FaProjectDiagram,
  FaStethoscope,
  FaDollarSign,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import futuristicAnimation from '../../../assets/lotties/futuristic.json';

import ProjectCard from '../ProjectCard';
import UpcomingConsultationList from '../UpcomingConsultationList';
import ProjectOverview from '../ProjectOverview';
import ProjectDashboard from '../projectTabs/ProjectDashboard';
import RequirementsModal from '../projectTabs/RequirementsModal';

const DashboardTab = () => {
  const {
    user,
    consultations,
    fetchConsultations,
    consultationsLoading,
    projects,
    fetchProjects,
    projectsLoading,
    setActiveTab,
  } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchConsultations?.();
    fetchProjects?.();
  }, []);

  const activeProjects = projects.filter(
    (p) => p.progress > 0 && p.progress < 100
  );
  const completedProjects = projects.filter((p) => p.progress === 100);

  const scheduledConsultations = consultations.filter((c) =>
    ['scheduled', 'rescheduled'].includes(c.status?.toLowerCase())
  );
  const totalConsultations = consultations.length;

  // Correct Total Clients from consultations.user._id & projects.client._id
  let totalClients = 0;
  if (user?.role === 'admin' || user?.role === 'consultant') {
    const consultationUserIds = consultations.map((c) => c.user?._id?.toString());
    const projectClientIds = projects.map((p) => p.client?._id?.toString());
    const allUserIds = new Set([...consultationUserIds, ...projectClientIds].filter(Boolean));
    totalClients = allUserIds.size;
  }

  const getWeekRanges = () => {
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - 7);

    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(now.getDate() - 14);

    const lastWeekEnd = new Date(now);
    lastWeekEnd.setDate(now.getDate() - 7);

    return { thisWeekStart, lastWeekStart, lastWeekEnd };
  };

  const { thisWeekStart, lastWeekStart, lastWeekEnd } = getWeekRanges();

  const consultationsThisWeek = consultations.filter(
    (c) => new Date(c.createdAt) >= thisWeekStart
  );
  const consultationsLastWeek = consultations.filter(
    (c) =>
      new Date(c.createdAt) >= lastWeekStart &&
      new Date(c.createdAt) < lastWeekEnd
  );

  const projectsThisWeek = activeProjects.filter(
    (p) => new Date(p.createdAt) >= thisWeekStart
  );
  const projectsLastWeek = activeProjects.filter(
    (p) =>
      new Date(p.createdAt) >= lastWeekStart &&
      new Date(p.createdAt) < lastWeekEnd
  );

  const uniqueUsersThisWeek = new Set([
    ...consultationsThisWeek.map((c) => c.user?._id?.toString()),
    ...projectsThisWeek.map((p) => p.client?._id?.toString()),
  ]);

  const uniqueUsersLastWeek = new Set([
    ...consultationsLastWeek.map((c) => c.user?._id?.toString()),
    ...projectsLastWeek.map((p) => p.client?._id?.toString()),
  ]);

  const calculateChange = (current, previous) => {
    if (previous === 0 && current > 0) return '+100%';
    if (previous === 0 && current === 0) return '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const consultationChange = calculateChange(
    consultationsThisWeek.length,
    consultationsLastWeek.length
  );
  const projectChange = calculateChange(
    projectsThisWeek.length,
    projectsLastWeek.length
  );
  const clientChange = calculateChange(
    uniqueUsersThisWeek.size,
    uniqueUsersLastWeek.size
  );

  const scheduledCount = scheduledConsultations.length;
  const role = user?.role;

  const baseCards = [
    {
      title: 'Total Consultations',
      value: totalConsultations,
      icon: <FaStethoscope className="text-3xl text-[#2E3191]" />,
      change: consultationChange,
    },
    {
      title: 'Active Projects',
      value: activeProjects.length,
      icon: <FaProjectDiagram className="text-3xl text-[#2E3191]" />,
      change: projectChange,
    },
  ];

  const roleSpecificCards = {
    admin: [
      {
        title: 'Total Clients',
        value: totalClients,
        icon: <FaUserFriends className="text-3xl text-[#2E3191]" />,
        change: clientChange,
      },
      {
        title: 'Revenue',
        value: '$12,400',
        icon: <FaDollarSign className="text-3xl text-[#2E3191]" />,
        change: '+20%',
      },
    ],
    consultant: [
      {
        title: 'Total Clients',
        value: totalClients,
        icon: <FaUserFriends className="text-3xl text-[#2E3191]" />,
        change: clientChange,
      },
      {
        title: 'Revenue',
        value: '$12,400',
        icon: <FaDollarSign className="text-3xl text-[#2E3191]" />,
        change: '+20%',
      },
    ],
    client: [
      {
        title: 'Scheduled Consultations',
        value: scheduledCount,
        icon: <FaCalendarAlt className="text-3xl text-[#2E3191]" />,
        change: '0%',
      },
      {
        title: 'Completed Projects',
        value: completedProjects.length,
        icon: <FaCheckCircle className="text-3xl text-[#2E3191]" />,
        change: '0%',
      },
    ],
  };

  const cardData = [...baseCards, ...(roleSpecificCards[role] || [])];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <ProjectDashboard
        project={selectedProject}
        onBackToProjects={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="pb-2 flex flex-col">
      {/* Highlights Section */}
      <div className="order-1 md:order-2 grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <UpcomingConsultationList
          consultations={consultations}
          setConsultations={() => {}}
          fetchConsultations={fetchConsultations}
          loading={consultationsLoading}
        />
        <div className="overflow-hidden">
          <ProjectOverview
            projects={projects} 
            loading={projectsLoading}
            animation={futuristicAnimation}
            onCreateClick={() => setIsModalOpen(true)}
            onViewMoreClick={() => setActiveTab('Projects')}
            onProjectClick={handleProjectClick}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="order-2 md:order-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        {cardData.map((card, index) => (
          <ProjectCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            change={card.change}
          />
        ))}
      </div>

      {/* Create Project Modal */}
      <RequirementsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchProjects();
        }}
      />
    </div>
  );
};

export default DashboardTab;
