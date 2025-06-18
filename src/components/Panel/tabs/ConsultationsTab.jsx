import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import ConsultationModal from '../../reusable/ConsultationModal';
import ConsultationModalTabs from '../ConsultationModalTabs';

const ConsultationsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backend } = useAuth();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // Fetch consultations
  const fetchConsultations = async () => {
    try {
      const res = await axios.get(`${backend}/consultation/get-consultations`, {
        withCredentials: true,
      });
      setConsultations(res.data.consultations || []);
    } catch (error) {
      console.error('Error fetching consultations:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Filter and Search
  const filteredConsultations = consultations.filter((c) => {
    const clientName = c.user?.fullName || 'Unknown';
    return (
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus ? c.status === filterStatus.toLowerCase() : true)
    );
  });

  const statusBadge = {
    scheduled: 'bg-blue-100 text-blue-800',
    rescheduled: 'bg-blue-50 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const gradientTextClass = 'bg-gradient-to-r from-[#aab3ff] to-[#ffd6a1] bg-clip-text text-transparent font-medium';

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
            <option value="scheduled">Scheduled</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-gradient-to-r from-[#bfc9ff] to-[#ffe4c2] text-gray-800 px-6 py-2 rounded-md font-semibold hover:opacity-90 transition text-sm shadow-sm w-full md:w-auto"
        >
          + Add New Consultation
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-[#f1f3ff] to-[#fff4e6] text-gray-800">
              <th className="px-4 py-2 border-b text-left">Client</th>
              <th className="px-4 py-2 border-b text-left">Contact</th>
              <th className="px-4 py-2 border-b text-left">Time Slot</th>
              <th className="px-4 py-2 border-b text-left">Services</th>
              <th className="px-4 py-2 border-b text-left">Handlers</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">Loading...</td>
              </tr>
            ) : filteredConsultations.length > 0 ? (
              filteredConsultations.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b">{c.user?.name || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{c.user?.email || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{c.timeSlot || '—'}</td>
                  <td className="px-4 py-2 border-b">{(c.services || []).join(', ')}</td>
                  <td className="px-4 py-2 border-b">
                    {(c.handlers || []).map((h, idx) => (
                      <p key={idx} className="text-xs text-gray-700">{h.fullName || h.email || '—'}</p>
                    ))}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      onClick={() => setSelectedConsultation(c)}
                    >
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No consultations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View Cards */}
      <div className="block md:hidden space-y-4">
        {filteredConsultations.map((c) => (
          <div key={c._id} className="relative rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl bg-gradient-to-r from-[#aab3ff] to-[#ffd6a1]" />
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-[#2E3191]">{c.user?.name || 'N/A'}</h3>
              <button
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => setSelectedConsultation(c)}
              >
                <FiEdit />
              </button>
            </div>
            <p><span className={gradientTextClass}>Contact: </span>{c.user?.email}</p>
            <p><span className={gradientTextClass}>Time Slot: </span>{c.timeSlot}</p>
            <p><span className={gradientTextClass}>Services: </span>{(c.services || []).join(', ')}</p>
            <p><span className={gradientTextClass}>Handlers: </span>
              {(c.handlers || []).map((h, idx) => (
                <span key={idx} className="text-sm text-gray-700 block">{h.name || h.email}</span>
              ))}
            </p>
            <p>
              <span className={gradientTextClass}>Status: </span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[c.status]}`}>
                {c.status}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Create Consultation Modal */}
      <ConsultationModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Edit/View Modal with Delete Option inside */}
      {selectedConsultation && (
        <ConsultationModalTabs
          isOpen={true}
          onClose={() => setSelectedConsultation(null)}
          consultation={selectedConsultation}
          onUpdate={fetchConsultations}
          onDelete={fetchConsultations} // delete now triggered inside the modal
        />
      )}
    </div>
  );
};

export default ConsultationsTab;
