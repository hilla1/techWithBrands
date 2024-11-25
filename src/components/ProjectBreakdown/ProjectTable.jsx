import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import ConfirmActionModal from '../reusable/ConfirmActionModal';
import { format } from 'date-fns';
import { MdMoreVert } from 'react-icons/md';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ProjectTable = ({ modules, onUpdate, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleUpdateClick = () => {
    const selectedModule = modules[selectedIndex];
    onUpdate(selectedModule);
    handleClose();
  };

  const handleDeleteClick = () => {
    const selectedModuleId = modules[selectedIndex]._id;
    setSelectedModuleId(selectedModuleId); // Set the selected module ID for deletion
    setIsConfirmModalOpen(true); // Open confirmation modal
    handleClose();
  };

  const handleConfirmDelete = () => {
    if (selectedModuleId) {
      onDelete(selectedModuleId); // Call delete action
      setIsConfirmModalOpen(false); // Close the confirmation modal
      setSelectedModuleId(null); // Clear selected module ID
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Desktop Table View */}
      <table className="min-w-full bg-white border text-sm lg:text-base hidden lg:table">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left text-xs lg:text-sm uppercase font-bold">
            <th className="py-2 lg:py-3 px-2 lg:px-4 border">#</th>
            <th className="py-2 lg:py-3 px-2 lg:px-4 border">Module</th>
            <th className="py-2 lg:py-3 px-2 lg:px-4 border">Dates</th>
            <th className="py-2 lg:py-3 px-2 lg:px-4 border">Progress</th>
            <th className="py-2 lg:py-3 px-2 lg:px-4 border">Expert</th>
            <th className="py-2 lg:py-3 px-2 lg:px-4 border">Title</th>
            <th className="py-2 lg:py-3 px-2 lg:px-4 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module, index) => {
            const formattedStartTime = module.startTime
              ? format(new Date(module.startTime), 'MMM dd, yyyy')
              : 'N/A';
            const formattedDeadline = module.deadline
              ? format(new Date(module.deadline), 'MMM dd, yyyy')
              : 'N/A';

            return (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 lg:py-3 px-2 lg:px-4 border">{index + 1}</td>
                <td className="py-2 lg:py-3 px-2 lg:px-4 border">{module.title}</td>
                <td className="py-2 lg:py-3 px-2 lg:px-4 border">
                  {formattedStartTime} - {formattedDeadline}
                </td>
                <td className="py-2 lg:py-3 px-2 lg:px-4 border">
                  <ProgressBar progress={module.progress} />
                </td>
                <td className="py-2 lg:py-3 px-2 lg:px-4 border flex items-center">
                  <img
                    src={module.expertInfo?.avatar || 'default-avatar.png'}
                    alt={module.expertInfo?.name}
                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-full mr-2"
                  />
                  {module.expertInfo?.name}
                </td>
                <td className="py-2 lg:py-3 px-2 lg:px-4 border">{module.expertInfo?.title}</td>
                <td className="py-2 lg:py-3 px-2 lg:px-4 border text-center">
                  <div className="flex justify-center items-center h-full">
                    <MdMoreVert
                      className="cursor-pointer text-gray-600"
                      size={24}
                      onClick={(e) => handleMenuClick(e, index)}
                    />
                  </div>
                  {selectedIndex === index && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <MenuItem onClick={handleUpdateClick}>Update</MenuItem>
                      <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                    </Menu>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {modules.map((module, index) => {
          const formattedStartTime = module.startTime
            ? format(new Date(module.startTime), 'MMM dd, yyyy')
            : 'N/A';
          const formattedDeadline = module.deadline
            ? format(new Date(module.deadline), 'MMM dd, yyyy')
            : 'N/A';

          return (
            <div key={index} className="relative bg-white border rounded-lg shadow-md p-4 mb-6">
              <div className="absolute top-2 right-2">
                <MdMoreVert
                  className="cursor-pointer text-gray-600"
                  size={24}
                  onClick={(e) => handleMenuClick(e, index)}
                />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={module.expertInfo?.avatar || 'default-avatar.png'}
                    alt={module.expertInfo?.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{module.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {formattedStartTime} - {formattedDeadline}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <ProgressBar progress={module.progress} />
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-semibold text-gray-900">{module.expertInfo?.name}</p>
                <p className="text-xs text-gray-500 ml-2">{module.expertInfo?.title}</p>
              </div>

              {selectedIndex === index && (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleUpdateClick}>Update</MenuItem>
                  <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                </Menu>
              )}
            </div>
          );
        })}
      </div>

      {/* ConfirmActionModal for delete confirmation */}
      <ConfirmActionModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this module?"
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectTable;
