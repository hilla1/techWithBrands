import React, { useState, useEffect, useRef } from 'react';
import {
  FaUserFriends,
  FaProjectDiagram,
  FaStethoscope,
  FaDollarSign,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import futuristicAnimation from '../../../assets/lotties/futuristic.json';

import ProjectCard from '../ProjectCard';
import UpcomingConsultationList from '../UpcomingConsultationList';
import ProjectOverview from '../ProjectOverview';
import ProjectDashboard from '../projectTabs/ProjectDashboard';
import RequirementsModal from '../projectTabs/RequirementsModal';

const DashboardTab = () => {
  const { backend, setActiveTab, user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consultationLoading, setConsultationLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Refs to simulate "previous" counts
  const prevConsultationsRef = useRef(0);
  const prevProjectsRef = useRef(0);
  const prevClientsRef = useRef(0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend}/project`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async () => {
    setConsultationLoading(true);
    try {
      const res = await axios.get(`${backend}/consultation/get-consultations`, {
        withCredentials: true,
      });
      if (res.data?.consultations) {
        setConsultations(res.data.consultations);
      }
    } catch (err) {
      console.error('Failed to fetch consultations:', err.message);
    } finally {
      setConsultationLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchConsultations();
  }, []);

  const activeProjects = projects.filter(
    (project) => project.progress > 0 && project.progress < 100
  );
  const completedProjects = projects.filter((p) => p.progress === 100);
  const totalConsultations = consultations.length;

  // Client calculation based on role
  let totalClients = 0;
  if (user?.role === 'admin') {
    const consultationUsers = consultations.map((c) => c.user?._id);
    const projectUsers = projects.map((p) => p.user?._id);
    const allUserIds = [...new Set([...consultationUsers, ...projectUsers])];
    totalClients = allUserIds.length;
  } else if (user?.role === 'consultant') {
    const clientIds = new Set();
    consultations.forEach((c) => {
      if (c.user?._id) clientIds.add(c.user._id);
    });
    totalClients = clientIds.size;
  }

  const scheduledCount = consultations.filter(
    (c) => c.status === 'scheduled'
  ).length;

  // Change calculations
  const calculateChange = (current, previous) => {
    if (previous === 0 && current > 0) return '+100%';
    if (previous === 0 && current === 0) return '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const consultationChange = calculateChange(
    totalConsultations,
    prevConsultationsRef.current
  );
  const projectChange = calculateChange(
    activeProjects.length,
    prevProjectsRef.current
  );
  const clientChange = calculateChange(totalClients, prevClientsRef.current);

  // Update refs with latest values
  useEffect(() => {
    prevConsultationsRef.current = totalConsultations;
    prevProjectsRef.current = activeProjects.length;
    prevClientsRef.current = totalClients;
  }, [totalConsultations, activeProjects.length, totalClients]);

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
    <div className="pb-2">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

      {/* Highlights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingConsultationList
          consultations={consultations}
          setConsultations={setConsultations}
          fetchConsultations={fetchConsultations}
          loading={consultationLoading}
        />
        <ProjectOverview
          projects={projects}
          loading={loading}
          animation={futuristicAnimation}
          onCreateClick={() => setIsModalOpen(true)}
          onViewMoreClick={() => setActiveTab('Projects')}
          onProjectClick={handleProjectClick}
        />
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
