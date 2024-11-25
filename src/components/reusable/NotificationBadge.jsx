import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaBell, FaEnvelope } from 'react-icons/fa';

const NotificationBadge = ({ icon, count, items, onItemClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      iconRef.current && !iconRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Render icon based on the 'icon' prop
  const renderIcon = () => {
    switch (icon) {
      case 'bell':
        return <FaBell className="text-gray-300 text-lg sm:text-xl" />;
      case 'envelope':
        return <FaEnvelope className="text-gray-300 text-lg sm:text-xl" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center">
      <div
        ref={iconRef}
        className="relative cursor-pointer"
        onClick={handleDropdownToggle}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        {renderIcon()}
        {count > 0 && (
          <span
            className={`absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center 
                       rounded-full text-white text-xs font-semibold bg-[#F89F2D] 
                       text-center`}
            style={{ fontSize: '0.75rem' }} // Adjust font size for smaller badge
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-56 bg-white shadow-lg z-50 border border-gray-200"
          style={{ top: '100%' }}
          role="menu"
          aria-orientation="vertical"
        >
          <ul className="text-gray-700 max-h-60 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onItemClick(item)}
                  role="menuitem"
                >
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No items</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;
