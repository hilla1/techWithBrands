import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveItem } from '../../redux/slices/dashboardSlice';
import twbLogo from '../../assets/twbLogo.png';
import { menuItems, roleBasedMenuItems } from '../../assets/data/homeData';
import useAuth from '../../hooks/useAuth'; 

const SidebarSheet = ({ isSidebarOpen, toggleSidebar }) => {
  const { isAuthenticated } = useAuth(); // Accessing authentication state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeItem, role } = useSelector((state) => state.dashboard);

  const handleItemClick = (key) => {
    dispatch(setActiveItem(key));
    const { link } = menuItems[key] || {}; // Handle undefined menuItems[key]
    if (link) {
      navigate(link);
    }
    if (toggleSidebar) toggleSidebar(false);
  };

  const activeClass = 'bg-gradient-to-r from-[#1d2356] to-[#F89F2D] text-white font-bold';
  const inactiveClass = 'text-gray-300';

  // Retrieve the menu items based on the current role
  const menuItemsToDisplay = roleBasedMenuItems[role] || [];

  // Render nothing if the user is not authenticated
  if (!isAuthenticated) {
    return null; // You could also redirect to a login page here if needed
  }

  return (
    <div
      className={`fixed top-0 left-0 h-full w-2/3 sm:w-1/2 bg-[#1d2356] text-white z-50 transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden`}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        <img src={twbLogo} alt="Logo" className="h-7 sm:h-10 w-auto" />
        <FaTimes
          className="text-white text-2xl cursor-pointer"
          onClick={() => toggleSidebar(false)}
        />
      </div>

      <nav className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto mt-4">
        {menuItemsToDisplay.map((key) => {
          const menuItem = menuItems[key]; // Get the menu item
          if (!menuItem) {
            return null; // Skip if menu item is undefined
          }
          const { label, icon: IconComponent, ariaLabel } = menuItem;

          return (
            <button
              key={key}
              className={`flex items-center p-2 w-full text-left hover:bg-gradient-to-r from-orange-500 to-blue-800 hover:text-white ${
                activeItem === key ? activeClass : inactiveClass
              } transition-colors duration-300`}
              onClick={() => handleItemClick(key)}
              aria-label={ariaLabel}
            >
              <IconComponent className="mr-3" /> {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarSheet;
