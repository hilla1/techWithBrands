// src/components/Panel.jsx
import React, { useState } from 'react';
import Wrapper from '../reusable/Wrapper';
import DashboardTab from './tabs/DashboardTab';
import ConsultationsTab from './tabs/ConsultationsTab';
import ProjectsTab from './tabs/ProjectsTab';
import ClientsTab from './tabs/ClientsTab';
import Navbar from './Navbar';

const TABS = ['Dashboard', 'Consultations', 'Projects', 'Clients'];

const Panel = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <section className="pt-6 pb-6 bg-slate-50 min-h-screen">
      <Navbar/>
      <Wrapper>
        {/* Title and Description */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#2E3191]">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Manage consultations, projects, and client workflows
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
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
        {activeTab === 'Clients' && <ClientsTab />}
      </Wrapper>
    </section>
  );
};

export default Panel;
