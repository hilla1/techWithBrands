import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiEdit } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import ConsultationModalTabs from './ConsultationModalTabs';
import ConsultationModal from '../reusable/ConsultationModal';
import EmptyConsultation from './EmptyConsultation';

const UpcomingConsultationList = ({
  consultations = [],
  setConsultations = () => {},
  fetchConsultations = async () => {},
  loading = false,
}) => {
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { setActiveTab } = useAuth();

  const statusBadge = {
    scheduled: 'bg-blue-100/30 text-blue-700 border border-blue-300',
    rescheduled: 'bg-blue-50/30 text-blue-700 border border-blue-200',
    completed: 'bg-green-100/30 text-green-700 border border-green-300',
    canceled: 'bg-red-100/30 text-red-700 border border-red-300',
    pending: 'bg-yellow-100/30 text-yellow-700 border border-yellow-300',
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow min-h-[300px] relative">
      {consultations.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#2E3191]">
            Upcoming Consultations
          </h3>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#2E3191] to-[#F89F2D] hover:underline transition"
          >
            + New
          </button>
        </div>
      )}

      {/* Spinner */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[150px]">
          <FaSpinner className="animate-spin text-2xl text-[#2E3191]" />
        </div>
      ) : consultations.length === 0 ? (
        <EmptyConsultation onCreated={fetchConsultations} />
      ) : (
        <>
          <ul className="space-y-4">
            {consultations.slice(0, 3).map((item) => {
              const user = item.user || {};
              const fullName = user.name || 'Unnamed User';
              const avatar = user.avatar || '';
              const timeSlot = item.timeSlot || 'No time set';
              const status = item.status || 'pending';

              return (
                <li
                  key={item._id}
                  className="relative flex items-center gap-4 p-3 bg-gradient-to-r from-white to-slate-100 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <button
                    onClick={() => setSelectedConsultation(item)}
                    className="absolute top-2 right-2 text-[#2E3191] hover:text-[#F89F2D] transition"
                    title="Edit"
                  >
                    <FiEdit size={16} />
                  </button>

                  {avatar ? (
                    <img
                      src={avatar}
                      alt={fullName}
                      className="w-12 h-12 rounded-full object-cover border border-white shadow"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2E3191] to-[#F89F2D] text-white flex items-center justify-center font-bold text-lg">
                      {fullName.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{fullName}</p>
                    <p className="text-sm text-gray-500">{timeSlot}</p>
                  </div>

                  <span
                    className={`absolute bottom-2 right-2 px-3 py-0.5 text-xs rounded-full font-medium shadow-sm backdrop-blur-sm ${
                      statusBadge[status] ||
                      'bg-gray-100/30 text-gray-700 border border-gray-300'
                    }`}
                  >
                    {status}
                  </span>
                </li>
              );
            })}
          </ul>

          {consultations.length > 3 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setActiveTab('Consultations')}
                className="text-sm text-[#2E3191] font-medium hover:underline"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}

      {selectedConsultation && (
        <ConsultationModalTabs
          isOpen={true}
          onClose={() => setSelectedConsultation(null)}
          consultation={selectedConsultation}
          onUpdate={fetchConsultations}
          onDelete={fetchConsultations}
        />
      )}

      {isNewModalOpen && (
        <ConsultationModal
          isOpen={true}
          onClose={() => setIsNewModalOpen(false)}
          onSubmit={async () => {
            await fetchConsultations();
            setIsNewModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UpcomingConsultationList;
