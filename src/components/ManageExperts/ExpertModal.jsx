// src/components/ExpertModal.jsx
import React from 'react';
import ReusableModal from '../reusable/ReusableModal';

const ExpertModal = ({ isOpen, closeModal, formData, handleInputChange, handleSubmit, isEditing, users }) => {
  return (
    <ReusableModal isOpen={isOpen} onClose={closeModal}>
      <h2 className="text-xl mb-4">{isEditing ? 'Edit Expert' : 'Create Expert'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <select
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
            required
          >
            <option value="">Select an email</option>
            {users.map((user) => (
              <option key={user._id} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Skill Set (comma-separated)</label>
          <input
            type="text"
            name="skillSet"
            value={formData.skillSet}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default ExpertModal;
