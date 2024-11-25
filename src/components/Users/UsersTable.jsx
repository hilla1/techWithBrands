import React, { useState } from 'react';
import { FaEllipsisV, FaEdit, FaLock, FaBan, FaTrashAlt } from 'react-icons/fa';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Menu, MenuItem } from '@mui/material';

const UsersTable = ({ users, onEdit, onChangePassword, onBlock, onDelete }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleActionClick = (action) => {
    if (selectedUser) {
      switch (action) {
        case 'edit':
          onEdit(selectedUser);
          break;
        case 'changePassword':
          onChangePassword(selectedUser);
          break;
        case 'block':
          onBlock(selectedUser);
          break;
        case 'delete':
          onDelete(selectedUser);
          break;
        default:
          break;
      }
      handleMenuClose();
    }
  };

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b font-bold">Avatar</th>
            <th className="py-2 px-4 border-b font-bold">Name</th>
            <th className="py-2 px-4 border-b font-bold">Email</th>
            <th className="py-2 px-4 border-b font-bold">Username</th>
            <th className="py-2 px-4 border-b font-bold">Role</th>
            <th className="py-2 px-4 border-b font-bold">Status</th>
            <th className="py-2 px-4 border-b font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">
                  <img
                    src={user?.profile?.profilePhoto || '/default-avatar.png'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">{truncateText(user?.name || 'No Name', 20)}</td>
                <td className="py-2 px-4 border-b">{truncateText(user?.email || 'No Email', 25)}</td>
                <td className="py-2 px-4 border-b">{truncateText(user?.profile?.username || 'Optional', 20)}</td>
                <td className="py-2 px-4 border-b">{truncateText(user?.role || 'No Role', 15)}</td>
                <td className="py-2 px-4 border-b">
                  {user?.blocked ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-500 font-semibold">Active</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <button onClick={(e) => handleMenuOpen(e, user)} className="text-gray-500">
                    <FaEllipsisV />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-4 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCards = () => (
    <div className="grid grid-cols-1 gap-4">
    {users.length > 0 ? (
      users.map((user) => (
        <div
          key={user._id}
          className="relative p-4 border border-gray-300 rounded-lg flex justify-between items-center"
        >
          <div className="flex items-center">
            <img
              src={user?.profile?.profilePhoto || '/default-avatar.png'}
              alt="avatar"
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg text-blue-900 font-semibold truncate">{truncateText(user?.name || 'No Name', 20)}</h3>
              <p className="text-sm text-gray-600 truncate">{truncateText(user?.email || 'No Email', 25)}</p>
              <p className="text-sm truncate text-gray-400">
                {truncateText(user?.profile?.username || 'Optional', 20)} - <span className='font-bold'>{user?.role || 'No Role'}</span>
              </p>
              <span className={`text-sm font-semibold ${user?.blocked ? 'text-red-500' : 'text-green-500'}`}>
                {user?.blocked ? 'Blocked' : 'Active'}
              </span>
            </div>
          </div>
          <button 
            onClick={(e) => handleMenuOpen(e, user)} 
            className="absolute top-2 right-2 text-gray-500" 
          >
            <FaEllipsisV />
          </button>
        </div>
      ))
    ) : (
      <div className="col-span-full text-center">
        <p>No users found.</p>
      </div>
    )}
  </div>
  );

  return (
    <>
      {isMobile ? renderCards() : renderTable()}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleActionClick('edit')}>
          <FaEdit style={{ marginRight: '8px', color: 'blue' }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('changePassword')}>
          <FaLock style={{ marginRight: '8px', color: 'black' }} /> Change Password
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('block')}>
          <FaBan style={{ marginRight: '8px', color: selectedUser?.blocked ? 'red' : 'orange' }} />
          {selectedUser?.blocked ? 'Unblock' : 'Block'}
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('delete')}>
          <FaTrashAlt style={{ marginRight: '8px', color: 'red' }} /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default UsersTable;
