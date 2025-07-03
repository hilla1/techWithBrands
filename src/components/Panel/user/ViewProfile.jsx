import React from 'react';

const ViewProfile = ({ user, handleSendOtp }) => (
  <div className="space-y-4">
    {/* Avatar + Basic Info */}
    <div className="flex items-center space-x-4">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover border"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold text-xl">
          {user.name?.charAt(0)}
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        {user.phone && (
          <p className="text-sm text-gray-500">📞 {user.phone}</p>
        )}
      </div>
    </div>

    {/* Grid Details */}
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Role</p>
        <p className="font-medium capitalize">{user.role}</p>
      </div>
      <div>
        <p className="text-gray-500">Verified</p>
        <p className="font-medium">
          {user.isAccountVerified ? 'Yes ✅' : (
            <button onClick={handleSendOtp} className="text-orange-500 underline">
              Verify Now
            </button>
          )}
        </p>
      </div>
    </div>
  </div>
);

export default ViewProfile;
