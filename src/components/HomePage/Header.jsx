import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaEnvelope, FaBell, FaBars, FaChevronDown, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveItem, setSearchQuery } from '../../redux/slices/dashboardSlice';
import twbLogo from '../../assets/twbLogo.png';
import SidebarSheet from './SidebarSheet';
import useLogout from '../../hooks/useLogout';
import NotificationBadge from '../../components/reusable/NotificationBadge'; 
import useAuth from '../../hooks/useAuth';

const Header = ({ role }) => {
  const { isAuthenticated, getUser } = useAuth(); // Destructure isAuthenticated from useAuth
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTriggerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useLogout();
  const user = getUser();
  const imgUrl = 'https://res.cloudinary.com/df2gqucru/image/upload/v1729011789/twx92k9adtcjpdeyuehk.png';

  // Sample data for notifications and messages
  const notifications = ['Notification 1', 'Notification 2', 'Notification 3'];
  const messages = ['Message 1', 'Message 2', 'Message 3'];

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Handle notification dropdown toggle
  const handleNotificationDropdownToggle = () => {
    setIsNotificationDropdownOpen((prevState) => !prevState);
  };

  // Handle message dropdown toggle
  const handleMessageDropdownToggle = () => {
    setIsMessageDropdownOpen((prevState) => !prevState);
  };

  // Handle clicks outside the dropdown to close it
  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      dropdownTriggerRef.current && !dropdownTriggerRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
      setIsNotificationDropdownOpen(false);
      setIsMessageDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handle search input change and dispatch search query to Redux
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    dispatch(setSearchQuery(value));
  };

  // Handle dropdown item clicks
  const handleDropdownItemClick = (itemKey, link) => {
    dispatch(setActiveItem(itemKey));
    navigate(link);
    setIsDropdownOpen(false);
  };

  // Utility function to truncate the name
  const truncateName = (name) => {
    return name.length > 7 ? `${name.slice(0, 7)}...` : name;
  };

  // Render nothing if the user is not authenticated
  if (!isAuthenticated) {
    return null; // Or you could return a loading spinner or redirect to login
  }

  return (
    <>
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-[#1d2356] text-white md:p-3 p-4 flex items-center justify-between border-r border-l">
        {/* Hamburger Menu and Logo for Medium Screens and Below */}
        <div className="flex items-center lg:hidden">
          <FaBars className="text-white text-2xl mr-2 md:mr-4 cursor-pointer" onClick={toggleSidebar} />
          <img
            src={twbLogo}
            alt="Logo"
            className="h-7 sm:h-10 w-auto"
          />
        </div>

        {/* Search Bar - Hidden on Medium Screens and Below */}
        <div className="flex-grow hidden lg:flex">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 py-2 rounded-full text-white w-full 
                         bg-[#1d2356] focus:outline-none 
                         focus:ring-0"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Message and Notification Icons */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="relative flex items-center">
            <NotificationBadge
              icon="envelope"
              count={messages.length}
              items={messages}
              onItemClick={(item) => console.log('Message clicked:', item)}
              onDropdownToggle={handleMessageDropdownToggle}
              isDropdownOpen={isMessageDropdownOpen}
            />
          </div>
          <div className="relative flex items-center">
            <NotificationBadge
              icon="bell"
              count={notifications.length}
              items={notifications}
              onItemClick={(item) => console.log('Notification clicked:', item)}
              onDropdownToggle={handleNotificationDropdownToggle}
              isDropdownOpen={isNotificationDropdownOpen}
            />
          </div>

          {/* User Info */}
          <div className="relative flex items-center">
            <div
              ref={dropdownTriggerRef}
              className="flex items-center cursor-pointer"
              onClick={handleDropdownToggle}
            >
              <img
                src={user?.avatar || imgUrl }
                alt="User Avatar"
                className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover"
              />
              <div className="hidden md:flex flex-col ml-2 md:mr-4 justify-center items-center">
                <div
                  className="font-semibold bg-clip-text text-transparent 
                             bg-gradient-to-r from-[var(--secondary-color)] to-white 
                             text-xs sm:text-sm md:text-base leading-tight text-center"
                >
                  {truncateName(user?.name || 'Unknown')}
                </div>
                <FaChevronDown className="text-white mt-1" />
              </div>
            </div>

            {/* User Dropdown Menu */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg z-50 border border-gray-200"
                style={{ top: '100%' }}
              >
                <ul className="text-gray-700">
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDropdownItemClick('profile', '/profile')}
                  >
                    <FaUser className="mr-2 text-[#2E3191]" />
                    <span>User Profile</span>
                  </li>
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDropdownItemClick('settings', '/settings')}
                  >
                    <FaCog className="mr-2 text-[#2E3191]" />
                    <span>Account Settings</span>
                  </li>
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      logout();
                    }}
                  >
                    <FaSignOutAlt className="mr-2 text-[#2E3191]" />
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SidebarSheet Component */}
      <SidebarSheet isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={role} />

      {/* Overlay - Only visible when SidebarSheet is open and on Medium Screens and Below */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Header;
