// LoginPromptModal.jsx
import React from 'react';
import ReusableModal from './ReusableModal';

const LoginPromptModal = ({ isOpen, onClose, openLoginModal }) => {
  const handleLoginClick = () => {
    onClose();         // Close this modal
    openLoginModal();  // Open the Login modal
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-4 p-6">
        <h3 className="text-xl font-bold text-[#2E3191]">Your Account already Exist</h3>
        <p className="text-sm text-gray-600">
          You already have an account with this email. Please log in to continue.
        </p>
        <button
          onClick={handleLoginClick}
          className="mt-4 px-4 py-2 text-sm text-white rounded bg-[#F89F2D] hover:bg-[#d78e4e]"
        >
          Go to Login
        </button>
      </div>
    </ReusableModal>
  );
};

export default LoginPromptModal;
