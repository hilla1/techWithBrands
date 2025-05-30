import React, { useState, useEffect } from 'react';
import { FaBell, FaCog, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import twbLogo1 from '../../assets/twbLogo1.png';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const firstName = 'John';

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('#avatar-menu')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="xl:mx-20 md:mx-2 flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={twbLogo1}
              alt="TWB Logo"
              className="h-8 sm:h-10 w-auto"
            />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">

            {/* Notification Icon */}
            <button className="relative group text-gray-600 hover:text-orange-400 transition">
              <FaBell className="text-lg sm:text-xl" />
              <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-[10px] sm:text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </button>

            {/* Settings Icon */}
            <button className="text-gray-600 hover:text-orange-400 transition">
              <FaCog className="text-lg sm:text-xl" />
            </button>

            {/* Avatar & Dropdown */}
            <div className="relative" id="avatar-menu">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition"
              >
                <span className="hidden md:block font-semibold text-sm sm:text-base">{firstName}</span>
                <FaUserCircle className="text-xl sm:text-2xl text-orange-400" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 z-50">
                  {Array.from({ length: 7 }).map((_, idx) => (
                    <a
                      href="#"
                      key={idx}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r from-[#aab3ff] to-[#ffd6a1] hover:text-white transition"
                    >
                      <FaUserCircle className="mr-2" />
                      Menu Item {idx + 1}
                    </a>
                  ))}
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={() => alert('Logging out...')}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gradient-to-r from-[#aab3ff] to-[#ffd6a1] hover:text-white transition"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
