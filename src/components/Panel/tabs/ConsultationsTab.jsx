import React, { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

const ConsultationsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      client: 'John Doe',
      contact: 'john@example.com',
      datetime: '2025-06-02 10:00 AM',
      services: 'Logo Design',
      status: 'Scheduled',
    },
    {
      id: 2,
      client: 'Jane Smith',
      contact: 'jane@example.com',
      datetime: '2025-06-05 02:00 PM',
      services: 'Brand Strategy',
      status: 'Completed',
    },
    {
      id: 3,
      client: 'Bob Johnson',
      contact: 'bob@example.com',
      datetime: '2025-06-10 11:00 AM',
      services: 'Website UI/UX Consultation',
      status: 'Cancelled',
    },
    {
      id: 4,
      client: 'Alice Williams',
      contact: 'alice@example.com',
      datetime: '2025-06-12 03:00 PM',
      services: 'Mobile App Planning',
      status: 'Scheduled',
    },
    {
      id: 5,
      client: 'Michael Brown',
      contact: 'michael@example.com',
      datetime: '2025-06-15 09:00 AM',
      services: 'Digital Marketing Strategy',
      status: 'Completed',
    },
  ]);

  const filteredConsultations = consultations.filter((consultation) => {
    return (
      consultation.client.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus ? consultation.status === filterStatus : true)
    );
  });

  const gradientTextClass = "bg-gradient-to-r from-[#aab3ff] to-[#ffd6a1] bg-clip-text text-transparent font-medium";
  const statusBadge = {
    Scheduled: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div>
      {/* Header: Search, Filter & Add New */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search consultations..."
            className="rounded-md px-4 py-2 text-sm bg-gradient-to-r from-[#f1f1f1] to-[#e4e4ff] text-gray-700 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E3191] w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded-md px-4 py-2 text-sm bg-gradient-to-r from-[#f1f1f1] to-[#e4e4ff] text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Add New Button */}
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-gradient-to-r from-[#bfc9ff] to-[#ffe4c2] text-gray-800 px-6 py-2 rounded-md font-semibold hover:opacity-90 transition text-sm shadow-sm">
            + Add New Consultation
          </button>
        </div>
      </div>

      {/* Table View (Desktop) */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-[#f1f3ff] to-[#fff4e6] text-gray-800">
              <th className="px-4 py-2 border-b text-left">Client</th>
              <th className="px-4 py-2 border-b text-left">Contact</th>
              <th className="px-4 py-2 border-b text-left">Dateline</th>
              <th className="px-4 py-2 border-b text-left">Services</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultations.length > 0 ? (
              filteredConsultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b">{consultation.client}</td>
                  <td className="px-4 py-2 border-b">{consultation.contact}</td>
                  <td className="px-4 py-2 border-b">{consultation.datetime}</td>
                  <td className="px-4 py-2 border-b">{consultation.services}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[consultation.status]}`}>
                      {consultation.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button className="inline-flex justify-center w-full px-2 py-1 text-sm text-gray-600 hover:text-gray-900">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No consultations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View (Mobile) */}
      <div className="block md:hidden space-y-4">
        {filteredConsultations.length > 0 ? (
          filteredConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="relative rounded-xl border border-gray-200 bg-white shadow-sm p-4"
            >
              {/* Accent bar */}
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl bg-gradient-to-r from-[#aab3ff] to-[#ffd6a1]" />
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[#2E3191]">
                  {consultation.client}
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreVertical />
                </button>
              </div>
              <p>
                <span className={gradientTextClass}>Contact: </span>
                {consultation.contact}
              </p>
              <p>
                <span className={gradientTextClass}>Date & Time: </span>
                {consultation.datetime}
              </p>
              <p>
                <span className={gradientTextClass}>Services: </span>
                {consultation.services}
              </p>
              <p>
                <span className={gradientTextClass}>Status: </span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[consultation.status]}`}>
                  {consultation.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No consultations found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConsultationsTab;
