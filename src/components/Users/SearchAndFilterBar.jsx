import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SearchAndFilterBar = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  dateCreatedFilter,
  onDateCreatedFilterChange,
  dateUpdatedFilter,
  onDateUpdatedFilterChange,
  onCreateUser
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className="flex flex-wrap justify-between mb-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={onSearchChange}
        className={`mb-2 border border-gray-400 rounded-md text-blue-900 p-2 focus:outline-none focus:ring focus:ring-orange-200 focus:border-transparent ${isMobile ? 'w-full' : 'mr-4 w-auto'}`}
      />

      {/* Role Filter */}
      <select
        value={roleFilter}
        onChange={onRoleFilterChange}
        className={`mb-2 border border-gray-400 rounded-md text-blue-900 p-2 focus:outline-none focus:ring focus:ring-orange-200 focus:border-transparent ${isMobile ? 'w-full' : 'mr-4 w-auto'}`}
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="client">Client</option>
        <option value="business">Business</option>
        <option value="consultant">Consultant</option>
        <option value="freelancer">Freelancer</option>
      </select>

      {/* Date Created Filter */}
      <div className={`relative mb-2 ${isMobile ? 'hidden' : 'mr-4'}`}>
        <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all duration-150 transform -translate-y-3 pointer-events-none">
          Created At
        </label>
        <input
          type="date"
          value={dateCreatedFilter}
          onChange={onDateCreatedFilterChange}
          className="border border-gray-400 rounded-md p-2 text-blue-900 w-full focus:outline-none focus:ring focus:ring-orange-200 focus:border-transparent"
        />
      </div>

      {/* Date Updated Filter */}
      <div className={`relative mb-2 ${isMobile ? 'hidden' : 'mr-4'}`}>
        <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all duration-150 transform -translate-y-3 pointer-events-none">
          Updated At
        </label>
        <input
          type="date"
          value={dateUpdatedFilter}
          onChange={onDateUpdatedFilterChange}
          className="border border-gray-400 rounded-md p-2 text-blue-900 w-full focus:outline-none focus:ring focus:ring-orange-200 focus:border-transparent"
        />
      </div>

      {/* Create User Button */}
      <button
        onClick={onCreateUser}
        className={`flex items-center justify-center text-white font-semibold px-4 py-2 rounded mb-2 bg-gradient-to-r from-blue-900 to-orange-400 hover:from-blue-700 hover:to-orange-300 ${isMobile ? 'w-full' : 'w-auto'}`}
      >
        <FaPlus className="mr-2" />
        Create User
      </button>
    </div>
  );
};

export default SearchAndFilterBar;
