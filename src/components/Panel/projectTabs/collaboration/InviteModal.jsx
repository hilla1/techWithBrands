// components/collaboration/InviteModal.jsx
import React from 'react';
import ReusableModal from '../../../reusable/ReusableModal';

export default function InviteModal({ isOpen, onClose, register }) {
  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form className="space-y-4 mt-8">
        {/* Email Input */}
        <input
          {...register('email')}
          type="email"
          placeholder="Email address"
          className="w-full border border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Designation Input */}
        <input
          {...register('designation')}
          type="text"
          placeholder="Designation"
          className="w-full border border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 rounded text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 transition font-semibold text-sm"
        >
          Send Invite
        </button>
      </form>
    </ReusableModal>
  );
}
