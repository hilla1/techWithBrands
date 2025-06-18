import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';
import ConfirmActionModal from '../../../reusable/ConfirmActionModal';

export default function TeamMembers({ teamMembers, setInviteOpen }) {
  const [editMode, setEditMode] = useState(false);
  const [editedMembers, setEditedMembers] = useState(teamMembers);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  const handleDesignationChange = (index, newValue) => {
    const updated = [...editedMembers];
    updated[index].designation = newValue;
    setEditedMembers(updated);
  };

  const confirmRemoveMember = (index) => {
    setMemberToRemove(index);
    setConfirmOpen(true);
  };

  const removeMember = () => {
    if (memberToRemove !== null) {
      const updated = editedMembers.filter((_, i) => i !== memberToRemove);
      setEditedMembers(updated);
      setMemberToRemove(null);
      setConfirmOpen(false);
    }
  };

  const saveChanges = () => {
    setEditMode(false);
    // You can optionally propagate updatedMembers to the server or context
  };

  return (
    <div className="w-full border rounded shadow p-4 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">Team Members</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            title={editMode ? 'Finish Editing' : 'Edit'}
            className="text-gray-600 hover:text-blue-600"
          >
            <FiEdit className="w-4 h-4" />
          </button>
        </div>

        {!editMode && (
          <button
            onClick={() => setInviteOpen(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            + Invite
          </button>
        )}
      </div>

      {/* Member List */}
      <div className="space-y-3">
        {editedMembers.map((member, index) => (
          <div key={index} className="flex items-center gap-3">
            <img
              src={member.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{member.name}</p>
              {editMode ? (
                <input
                  type="text"
                  value={member.designation}
                  onChange={(e) => handleDesignationChange(index, e.target.value)}
                  className="text-xs text-gray-600 border rounded px-1 py-0.5 mt-0.5 w-full"
                />
              ) : (
                <p className="text-xs text-gray-500">{member.designation}</p>
              )}
            </div>
            <span
              className={`text-xs font-semibold ${
                member.status === 'online' ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              {member.status}
            </span>
            {editMode && (
              <button
                onClick={() => confirmRemoveMember(index)}
                className="text-red-500 hover:text-red-700 ml-2"
                title="Remove"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      {editMode && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Save
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmActionModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Remove Team Member"
        message="Are you sure you want to remove this team member?"
        confirmText="Remove"
        onConfirm={removeMember}
      />
    </div>
  );
}
