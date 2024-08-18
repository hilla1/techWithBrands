import React, { useState } from 'react';
import { useNavbar } from '../../hooks/useNavbar';
import { navbarItems } from '../../assets/data/navbarData';
import twbLogo from '../../assets/twbLogo.png';
import twbLogo1 from '../../assets/twbLogo1.png';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Navbar = () => {
  // Custom hook to manage navbar states like scrolling and mobile menu toggle
  const { isMobileMenuOpen, toggleMobileMenu, isScrolled, visible } = useNavbar();

  // Dynamic classes for background color and text color based on scroll state
  const navbarBgColor = isScrolled ? 'bg-white' : 'bg-[#111236]';
  const textColor = isScrolled ? 'text-black' : 'text-white';
  const hoverBgColor = isScrolled ? 'hover:bg-gray-200' : 'hover:bg-[#2E3191]';
  const iconColor = isScrolled ? 'text-primary' : 'text-white';

  // State to manage which dropdown is open in the navbar
  const [openDropdown, setOpenDropdown] = useState(null);

  // State to manage which submenu is open inside a dropdown
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // Toggle function for opening and closing dropdowns
  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Toggle function for opening and closing submenus within dropdowns
  const handleSubmenuToggle = (dropdownIndex, submenuIndex) => {
    setActiveSubmenu(activeSubmenu === `${dropdownIndex}-${submenuIndex}` ? null : `${dropdownIndex}-${submenuIndex}`);
  };

  return (
    <nav
      // Navbar is fixed at the top and visible based on scroll state
      className={`fixed w-full top-0 left-0 z-50 transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'} ${navbarBgColor}`}
    >
      <div className={`flex items-center py-4 px-4 xl:mx-20 ${navbarBgColor}`}>
        {/* Navbar logo changes based on scroll state */}
        <img
          src={isScrolled ? twbLogo1 : twbLogo}
          alt="TWB Logo"
          className={`w-[100px] h-[16px] sm:w-[120px] sm:h-[20px] md:w-[140px] md:h-[24px] lg:w-[180px] lg:h-[30px] xl:w-[240px] xl:h-[40px] transition-all duration-300`}
        />
        
        <div className="flex-grow flex justify-center items-center mx-4">
          {/* Navbar items (links and dropdowns) */}
          <ul
            className={`${
              isMobileMenuOpen ? 'block' : 'hidden'
            } absolute md:static top-full left-0 w-full md:w-auto md:flex md:justify-center space-x-2 ${navbarBgColor} md:bg-transparent px-6 py-4 md:px-0 md:py-0`}
          >
            {/* Mapping over navbar items from data */}
            {navbarItems.map((item, index) => (
              <li
                key={item.name}
                className={`group relative ${item.mobileOnly ? 'md:hidden' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  {/* Main menu link; opens dropdown if applicable */}
                  <a
                    href={item.href}
                    className={`block w-full py-2 px-4 ${textColor} ${hoverBgColor} transition-colors text-left md:hover:bg-transparent`}
                    onClick={(e) => {
                      if (item.hasDropdown) {
                        e.preventDefault(); // Prevent default if the item has a dropdown
                        handleDropdownToggle(index);
                      }
                    }}
                  >
                    {item.name}
                  </a>
                  {/* Dropdown toggle button for mobile */}
                  {item.hasDropdown && (
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className={`ml-auto md:hidden ${iconColor} p-4`}
                    >
                      {openDropdown === index ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  )}
                  {/* Chevron icon for dropdown indication on desktop */}
                  {item.hasDropdown && (
                    <FaChevronDown className={`ml-2 hidden md:block ${iconColor}`} />
                  )}
                </div>
                
                {/* Dropdown menu (visible on mobile when opened) */}
                {item.hasDropdown && openDropdown === index && (
                  <div className={`md:hidden block ${navbarBgColor} ${textColor}`}>
                    {/* Mapping over dropdown items */}
                    {item.dropdownItems.map((dropdownItem, submenuIndex) => (
                      <div key={dropdownItem.name}>
                        <div className="flex items-center justify-between">
                          {/* Dropdown item link */}
                          <a
                            href={dropdownItem.href || '#'}
                            className={`block w-full py-2 pl-4 pr-4 ${textColor} ${hoverBgColor} transition-colors text-left`}
                            onClick={() => {
                              if (dropdownItem.items) {
                                handleSubmenuToggle(index, submenuIndex);
                              }
                            }}
                          >
                            {dropdownItem.name}
                          </a>
                          {/* Submenu toggle button (for mobile) */}
                          {dropdownItem.items && (
                            <button
                              onClick={() => handleSubmenuToggle(index, submenuIndex)}
                              className="ml-2 text-lg"
                            >
                              {activeSubmenu === `${index}-${submenuIndex}` ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                          )}
                        </div>

                        {/* Submenu (visible on mobile when opened) */}
                        {dropdownItem.items && activeSubmenu === `${index}-${submenuIndex}` && (
                          <div className={`pl-6`}>
                            {dropdownItem.items.map((submenuItem) => (
                              <a
                                key={submenuItem.name}
                                href={submenuItem.href}
                                className={`block w-full py-2 pl-4 pr-4 ${textColor} ${hoverBgColor} transition-colors text-left`}
                              >
                                {submenuItem.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Dropdown menu (visible on desktop when hovered) */}
                {item.hasDropdown && (
                  <div className="hidden md:group-hover:block absolute top-full left-0 bg-white shadow-lg text-black grid grid-cols-2 gap-4 p-4 min-w-[400px]">
                    {/* Mapping over dropdown items */}
                    {item.dropdownItems.map((dropdownItem) => (
                      <div key={dropdownItem.name} className="group">
                        <a
                          href={dropdownItem.href || '#'}
                          className="block px-2 py-1 hover:bg-gray-200 transition-colors"
                        >
                          {dropdownItem.name}
                        </a>
                        {/* Submenu items for desktop */}
                        <div className="space-y-2 pl-4">
                          {dropdownItem.items && dropdownItem.items.map((submenuItem) => (
                            <a
                              key={submenuItem.name}
                              href={submenuItem.href}
                              className="block py-1 px-2 hover:bg-gray-200 transition-colors"
                            >
                              {submenuItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}

            {/* Login and Register buttons for mobile dropdown menu */}
            <li className="md:hidden flex flex-col space-y-4 mt-4">
              <button
                className={`py-2 px-4 text-left font-bold ${textColor} hover:text-[#F89F2D] transition-colors`}
              >
                Login
              </button>
              <button className="py-2 px-4 text-left border border-[#F89F2D] text-[#F89F2D] font-bold rounded-lg transition-colors hover:bg-[#F89F2D] hover:text-white">
                Register
              </button>
            </li>
          </ul>
        </div>
        
        {/* Mobile menu toggle button (hamburger and close icons) */}
        <button
          className={`text-2xl md:hidden ${iconColor} ml-auto`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Desktop-only Login and Register buttons */}
        <div className="hidden md:flex space-x-2">
          <button
            className={`py-1 px-2 font-bold transition-colors ${textColor} hover:text-[#F89F2D]`}
          >
            Login
          </button>
          <button className="py-1 px-2 border border-[#F89F2D] text-[#F89F2D] font-bold rounded-lg transition-colors hover:bg-[#F89F2D] hover:text-white">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
