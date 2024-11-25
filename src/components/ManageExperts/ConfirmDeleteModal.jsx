// src/components/ConfirmDeleteModal.jsx
import React from 'react';
import ReusableModal from '../reusable/ReusableModal';

const ConfirmDeleteModal = ({ isOpen, closeConfirm, expertToDelete, confirmDelete }) => {
  return (
    <ReusableModal isOpen={isOpen} onClose={closeConfirm}>
      <h2 className="text-xl mb-4">Confirm Deletion</h2>
      <p className="mb-6">
        Are you sure you want to delete{' '}
        <span className="font-semibold">{expertToDelete?.email}</span>?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 text-gray-500 hover:text-gray-700"
          onClick={closeConfirm}
        >
          Cancel
        </button>
        <button
          type="button"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={confirmDelete}
        >
          Delete
        </button>
      </div>
    </ReusableModal>
  );
};

export default ConfirmDeleteModal;
