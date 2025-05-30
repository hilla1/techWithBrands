// src/components/tabs/ClientsTab.jsx
import React, { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

const ClientsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [clients] = useState([
    {
      id: 1,
      name: 'John Doe',
      contact: 'john@example.com',
      email: 'john@example.com',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      contact: 'jane@example.com',
      email: 'jane@example.com',
      status: 'Inactive',
    },
    {
      id: 3,
      name: 'Alex Johnson',
      contact: 'alex@example.com',
      email: 'alex@example.com',
      status: 'Active',
    },
  ]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow w-full overflow-hidden">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search clients..."
            className="rounded-md px-4 py-2 text-sm bg-gradient-to-r from-[#f1f1f1] to-[#e4e4ff] text-gray-700 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E3191] w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded-md px-4 py-2 text-sm bg-gradient-to-r from-[#f1f1f1] to-[#e4e4ff] text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Add New Client Button */}
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-gradient-to-r from-[#bfc9ff] to-[#ffe4c2] text-gray-800 px-6 py-2 rounded-md font-semibold hover:opacity-90 transition text-sm shadow-sm">
            + Add New Client
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[#f1f3ff] to-[#fff4e6] text-gray-800">
              <th className="px-4 py-2 border-b text-left">Client</th>
              <th className="px-4 py-2 border-b text-left">Contact</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-t border-gray-200 hover:bg-slate-50 transition">
                  <td className="px-4 py-2">{client.name}</td>
                  <td className="px-4 py-2">{client.contact}</td>
                  <td className="px-4 py-2">{client.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                        client.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button className="text-gray-500 hover:text-[#2E3191]">
                      <FiMoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-xl shadow-md bg-gradient-to-r from-white to-slate-50 p-4 flex flex-col gap-2 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[#2E3191]">{client.name}</h3>
                <button className="text-gray-500 hover:text-[#2E3191]">
                  <FiMoreVertical />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                📧 <span className="font-medium">{client.email}</span>
              </p>
              <p className="text-sm text-gray-600">
                📱 <span className="font-medium">{client.contact}</span>
              </p>
              <span
                className={`w-fit px-2 py-1 mt-2 text-xs rounded-full font-semibold ${
                  client.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {client.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-gray-500">No clients found.</p>
        )}
      </div>
    </div>
  );
};

export default ClientsTab;
