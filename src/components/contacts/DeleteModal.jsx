import React from 'react';
import ReusableModal from '../reusable/ReusableModal';

const DeleteModal = ({ isOpen, onClose, handleDelete }) => {
    return (
      <ReusableModal isOpen={isOpen} onClose={onClose}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Contact Message</h2>
          <p>Are you sure you want to delete this message?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500">
              Delete
            </button>
          </div>
        </div>
      </ReusableModal>
    );
  };
  
  export default DeleteModal;
  