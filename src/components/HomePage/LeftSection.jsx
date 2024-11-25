import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import twbLogo from '../../assets/twbLogo.png';
import { menuItems, roleBasedMenuItems } from '../../assets/data/homeData';
import { setActiveItem } from '../../redux/slices/dashboardSlice';
import useAuth from '../../hooks/useAuth';

const LeftSection = () => {
  const { isAuthenticated } = useAuth(); // Accessing authentication state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeItem, role } = useSelector((state) => state.dashboard);
  
  const [isInteracting, setIsInteracting] = useState(false);

  const handleItemClick = (key) => {
    dispatch(setActiveItem(key));
    const { link } = menuItems[key] || {}; // Handle undefined menuItems[key]
    if (link) {
      navigate(link);
    }
    setIsInteracting(true); // Keep scrollbar visible after clicking
  };

  const activeClass = 'bg-gradient-to-r from-[#1d2356] to-[#F89F2D] text-white font-bold';
  const inactiveClass = 'text-gray-300';

  const roleItems = roleBasedMenuItems[role] || [];

  // Render nothing if the user is not authenticated
  if (!isAuthenticated) {
    return null; // You could also redirect to a login page here if needed
  }

  return (
    <div
      className={`bg-[#1d2356] text-white lg:w-1/6 sm:w-1/3 w-1/3 flex flex-col h-screen hidden lg:flex ${
        isInteracting ? 'overflow-y-auto' : 'overflow-hidden'
      }`}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setTimeout(() => setIsInteracting(false), 300)} // Delay to allow click
      onTouchStart={() => setIsInteracting(true)} // Show scrollbar on touch start
      onTouchEnd={() => setTimeout(() => setIsInteracting(false), 300)} // Hide scrollbar after touch ends
    >
      <header className="sticky top-0 flex items-center mb-4 px-2 pt-5 pb-4 border-b-2 border-[#2d336f] bg-[#1d2356] z-10">
        <img src={twbLogo} alt="Logo" className="w-48 h-auto mr-4" />
      </header>

      <nav className="flex flex-col flex-grow">
        {roleItems.map((key) => {
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
              role="button" // Adding role for better accessibility
              onTouchStart={() => setIsInteracting(true)} // Ensure scrollbar shows on touch interaction
            >
              <IconComponent className="mr-3 text-xl" aria-hidden="true" /> {/* Ensure icons are appropriately sized */}
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default LeftSection;
