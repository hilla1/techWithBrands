// src/components/ExpertList.jsx
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { FaEllipsisV } from 'react-icons/fa'; // Importing the vertical ellipsis icon

const ExpertList = ({ experts, displayedExperts, openEditModal, handleDelete, loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const handleMenuClick = (event, expert) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpert(expert);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedExpert(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        {/* Desktop Table View */}
        <table className="min-w-full bg-white shadow-md rounded hidden md:table">
          <thead>
            <tr className="bg-[var(--primary-color)] text-white">
              <th className="p-2">Email</th>
              <th className="p-2">Skill Set</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedExperts.map((expert) => (
              <tr key={expert._id} className="border-t">
                <td className="p-2 cursor-pointer text-blue-900 hover:underline" onClick={() => openEditModal(expert)}>
                  {expert.email}
                </td>
                <td className="p-2">{expert.skillSet.join(', ')}</td>
                <td className="p-2 space-x-4">
                  <button className="text-blue-500 hover:underline" onClick={() => openEditModal(expert)}>
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDelete(expert)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {/* Create Expert Button */}
          {displayedExperts.map((expert) => (
            <div key={expert._id} className="bg-white shadow-md rounded p-4 flex justify-between items-start relative transition-transform transform hover:scale-105 animate-shake">
              <div>
                <h3 className="text-lg font-semibold cursor-pointer text-blue-900 hover:underline" onClick={() => openEditModal(expert)}>
                  {expert.email}
                </h3>
                <p className="text-gray-600">{expert.skillSet.join(', ')}</p>
              </div>
              <div className="absolute top-2 right-2">
                <IconButton onClick={(e) => handleMenuClick(e, expert)}>
                  <FaEllipsisV /> {/* Using the vertical ellipsis icon from react-icons */}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedExpert === expert}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { handleClose(); openEditModal(expert); }}>Edit</MenuItem>
                  <MenuItem onClick={() => { handleClose(); handleDelete(expert); }}>Delete</MenuItem>
                </Menu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loader for fetching data */}
      {loading && (
        <div className="flex justify-center my-4">
          <ClipLoader color="var(--primary-color)" size={30} />
        </div>
      )}
    </>
  );
};

export default ExpertList;
