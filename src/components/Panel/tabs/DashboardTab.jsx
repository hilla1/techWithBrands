// src/components/tabs/DashboardTab.jsx
import React from 'react';
import {
  FaUserFriends,
  FaProjectDiagram,
  FaStethoscope,
  FaDollarSign,
} from 'react-icons/fa';

const DashboardTab = () => {
  const cardData = [
    {
      title: 'Total Consultations',
      value: 124,
      icon: <FaStethoscope className="text-3xl text-[#2E3191]" />,
      change: '+12%',
    },
    {
      title: 'Active Projects',
      value: 34,
      icon: <FaProjectDiagram className="text-3xl text-[#2E3191]" />,
      change: '+5%',
    },
    {
      title: 'Total Clients',
      value: 89,
      icon: <FaUserFriends className="text-3xl text-[#2E3191]" />,
      change: '-3%',
    },
    {
      title: 'Revenue',
      value: '$12,400',
      icon: <FaDollarSign className="text-3xl text-[#2E3191]" />,
      change: '+20%',
    },
  ];

  const upcomingConsultations = [
    { name: 'John Doe', date: '2025-06-02', time: '10:00 AM' },
    { name: 'Jane Smith', date: '2025-06-03', time: '3:00 PM' },
  ];

  const activeProjects = [
    { title: 'Mobile App Redesign', client: 'ABC Corp', progress: 80 },
    { title: 'E-commerce Setup', client: 'XYZ Ltd', progress: 45 },
    { title: 'Analytics Dashboard', client: 'Mega Inc', progress: 65 },
  ];

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>{card.icon}</div>
              <div
                className={`text-sm font-medium ${
                  card.change.startsWith('+') ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {card.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <p className="text-2xl font-bold text-[#2E3191]">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Consultations */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-[#2E3191] mb-4">
            Upcoming Consultations
          </h3>
          <ul className="space-y-4">
            {upcomingConsultations.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-white to-slate-100 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white flex items-center justify-center font-bold text-lg">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.date} at {item.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-[#2E3191] mb-4">Active Projects</h3>
          <ul className="divide-y divide-gray-200">
            {activeProjects.map((project, idx) => (
              <li
                key={idx}
                className="py-4 px-2 hover:bg-slate-50 hover:shadow-sm rounded-lg transition cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium text-gray-700">{project.title}</span>
                  <span className="text-gray-500">{project.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2E3191] to-[#F89F2D]"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Client: {project.client}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashboardTab;
