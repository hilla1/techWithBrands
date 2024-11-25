import React from 'react';
import ReusableModal from '../reusable/ReusableModal'; 

const ConfirmActionModal = ({ open, onClose, title, message, confirmText, onConfirm }) => {
  return (
    <ReusableModal isOpen={open} onClose={onClose}>
      <div>
        <h2 className="text-xl mb-4 text-blue-900">{title}</h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="ml-2 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default ConfirmActionModal;
