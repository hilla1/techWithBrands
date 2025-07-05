import React from 'react';
import Wrapper from '../reusable/Wrapper';
import DashboardTab from './tabs/DashboardTab';
import ConsultationsTab from './tabs/ConsultationsTab';
import ProjectsTab from './tabs/ProjectsTab';
import ClientsTab from './tabs/ClientsTab';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

const ALL_TABS = ['Dashboard', 'Consultations', 'Projects', 'Clients'];

const Panel = () => {
  const { activeTab, setActiveTab, user } = useAuth();

  // Filter tabs based on user role
  const visibleTabs =
    user?.role === 'client'
      ? ALL_TABS.filter((tab) => tab !== 'Clients')
      : ALL_TABS;

  // Subtitle based on role
  const getSubtitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Create, edit, and oversee all consultations and projects.';
      case 'consultant':
        return 'Manage your assigned consultations and projects efficiently.';
      case 'client':
        return 'Create, edit and Track your consultations and projects.';
      default:
        return 'Access and manage your dashboard contents.';
    }
  };

  return (
    <section className="pt-12 md:pt-10 pb-6 bg-slate-50 min-h-screen">
      <Navbar />
      <Wrapper>
        {/* Title and Role-based Description */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#2E3191]">Dashboard</h2>
          <p className="text-gray-600 mt-1">{getSubtitle()}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold rounded-lg whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white'
                  : 'bg-white text-[#2E3191] border border-[#F89F2D]'
              } hover:shadow-md transition`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Dashboard' && <DashboardTab />}
        {activeTab === 'Consultations' && <ConsultationsTab />}
        {activeTab === 'Projects' && <ProjectsTab />}
        {activeTab === 'Clients' && user?.role !== 'client' && <ClientsTab />}
      </Wrapper>
    </section>
  );
};

export default Panel;
