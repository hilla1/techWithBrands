// components/collaboration/InviteModal.jsx
import React from 'react';
import ReusableModal from '../../../reusable/ReusableModal';

export default function InviteModal({ isOpen, onClose, register }) {
  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form className="space-y-3 mt-10">
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          {...register('designation')}
          type="text"
          placeholder="Designation"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Send Invite
        </button>
      </form>
    </ReusableModal>
  );
}
