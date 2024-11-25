import React, { useState } from 'react';
import { format } from 'date-fns';
import ReusableModal from '../reusable/ReusableModal';
import useApiRequestWithReactQuery from '../../hooks/useApiRequestWithReactQuery';

const MilestoneSection = ({ modules }) => {
  const { useApiQuery, useApiCreate, useApiUpdate, useApiDelete } = useApiRequestWithReactQuery();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [currentModuleId, setCurrentModuleId] = useState(null);

  // Fetch milestones for each module individually and store both data and refetch
  const milestonesData = modules.reduce((acc, module) => {
    acc[module._id] = useApiQuery(`/milestones/${module._id}`);
    return acc;
  }, {});

  const addMilestone = useApiCreate(`/milestones`, {
    onSuccess: () => {
      refetchModuleMilestones(currentModuleId);
      closeModal();
    },
  });

  const updateMilestone = useApiUpdate(`/milestones`, {
    onSuccess: () => {
      refetchModuleMilestones(currentModuleId);
      closeModal();
    },
  });

  const deleteMilestone = useApiDelete(`/milestones`, {
    onSuccess: () => {
      refetchModuleMilestones(currentModuleId); // Refetch after delete
      closeModal(); // Optionally close modal after delete
    },
  });

  const openModal = (milestone = null, moduleId) => {
    setCurrentModuleId(moduleId);
    setSelectedMilestone(milestone);
    setMilestoneDescription(milestone ? milestone.description : '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMilestone(null);
    setMilestoneDescription('');
    setModalOpen(false);
  };

  const handleSave = () => {
    if (selectedMilestone) {
      updateMilestone.mutate({
        milestoneId: selectedMilestone._id,
        moduleId: currentModuleId,
        description: milestoneDescription,
        complete: selectedMilestone.complete,
      });
    } else {
      addMilestone.mutate({ moduleId: currentModuleId, description: milestoneDescription });
    }
  };

  const handleDelete = (milestoneId, moduleId) => {
    const deleteUrl = `/milestones/${moduleId}/${milestoneId}`;
    deleteMilestone.mutate(deleteUrl);
  };

  const refetchModuleMilestones = (moduleId) => {
    milestonesData[moduleId]?.refetch();
  };

  return (
    <div className="mt-8">
      {modules.map((module) => (
        <div key={module._id} className="mb-6">
          <h3 className="text-lg lg:text-xl font-bold mb-2">{module.title} - Milestones</h3>
          <ul className="list-disc list-inside">
            {milestonesData[module._id]?.data && milestonesData[module._id].data.length > 0 ? (
              milestonesData[module._id].data.map((milestone) => (
                <li key={milestone._id} className="text-sm lg:text-base flex items-center justify-between">
                  <span>
                    {format(new Date(milestone.createdAt), 'MMM dd, yyyy')}: {milestone.description}
                  </span>
                  <div>
                    <button onClick={() => openModal(milestone, module._id)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(milestone._id, module._id)} className="ml-2 text-red-600">Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm lg:text-base">No milestones yet</li>
            )}
          </ul>
          <div className="mt-4">
            <button onClick={() => openModal(null, module._id)} className="text-sm text-blue-900 hover:underline">
              + Add New Milestone
            </button>
          </div>
        </div>
      ))}

      {/* Reusable Modal for Adding/Editing Milestones */}
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl mb-4">{selectedMilestone ? 'Edit Milestone' : 'Add Milestone'}</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Milestone description"
          value={milestoneDescription}
          onChange={(e) => setMilestoneDescription(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="px-4 py-2 border text-gray-700 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="ml-2 px-4 py-2 bg-blue-900 text-white rounded">
            Save
          </button>
        </div>
      </ReusableModal>
    </div>
  );
};

export default MilestoneSection;
