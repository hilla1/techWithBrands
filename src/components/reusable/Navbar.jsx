import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavbar } from '../../hooks/useNavbar';
import { navbarItems } from '../../assets/data/navbarData';
import twbLogo from '../../assets/twbLogo1.png';
import twbLogo1 from '../../assets/twbLogo1.png';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import LoginModal from '../../components/Auth/LoginModal'; 
import RegisterModal from '../../components/Auth/RegisterModal'; 
import Cookies from 'js-cookie';

const Navbar = () => { 
  const navigate = useNavigate(); 
  useEffect(() => {Cookies.get('twb') === 'session' && navigate('/settings'); }, [navigate]);
  const { isMobileMenuOpen, toggleMobileMenu, isScrolled, visible } = useNavbar();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false); 
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  // Static colors for white background
  const navbarBgColor = 'bg-white';
  const textColor = 'text-black';
  const hoverBgColor = 'hover:bg-gray-200';
  const iconColor = 'text-primary';

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleSubmenuToggle = (dropdownIndex, submenuIndex) => {
    setActiveSubmenu(activeSubmenu === `${dropdownIndex}-${submenuIndex}` ? null : `${dropdownIndex}-${submenuIndex}`);
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 left-0 shadow-sm z-50 transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'} ${navbarBgColor}`}
      >
        <div className={`flex items-center py-4 px-4 xl:mx-20 ${navbarBgColor}`}>
          <a href="/" className="block"> 
            <img
              src={isScrolled ? twbLogo1 : twbLogo}
              alt="TWB Logo"
              className={`w-[200px] h-[30px] xl:w-[240px] xl:h-[40px] transition-all duration-300`}
            />
          </a>
          
          <div className="flex-grow flex justify-center items-center mx-4">
            <ul
              className={`${
                isMobileMenuOpen ? 'block' : 'hidden'
              } absolute md:static top-full left-0 w-full md:w-auto md:flex md:justify-center space-x-2 ${navbarBgColor} md:bg-transparent px-6 py-4 md:px-0 md:py-0`}
            >
              {navbarItems.map((item, index) => (
                <li
                  key={item.name}
                  className={`group relative ${item.mobileOnly ? 'md:hidden' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <a
                      href={item.href}
                      className={`block w-full py-2 px-4 ${textColor} ${hoverBgColor} transition-colors text-left md:hover:bg-transparent`}
                      onClick={(e) => {
                        if (item.hasDropdown) {
                          e.preventDefault();
                          handleDropdownToggle(index);
                        }
                      }}
                    >
                      {item.name}
                    </a>
                    {item.hasDropdown && (
                      <button
                        onClick={() => handleDropdownToggle(index)}
                        className={`ml-auto md:hidden ${iconColor} p-4`}
                      >
                        {openDropdown === index ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    )}
                    {item.hasDropdown && (
                      <FaChevronDown className={`ml-2 hidden md:block ${iconColor}`} />
                    )}
                  </div>
                  
                  {item.hasDropdown && openDropdown === index && (
                    <div className={`md:hidden block ${navbarBgColor} ${textColor}`}>
                      {item.dropdownItems.map((dropdownItem, submenuIndex) => (
                        <div key={dropdownItem.name}>
                          <div className="flex items-center justify-between">
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
                            {dropdownItem.items && (
                              <button
                                onClick={() => handleSubmenuToggle(index, submenuIndex)}
                                className="ml-2 text-lg"
                              >
                                {activeSubmenu === `${index}-${submenuIndex}` ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            )}
                          </div>

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
                  
                  {item.hasDropdown && (
                    <div className="hidden md:group-hover:block absolute top-full left-0 bg-white shadow-lg text-black grid grid-cols-2 gap-4 p-4 min-w-[400px]">
                      {item.dropdownItems.map((dropdownItem) => (
                        <div key={dropdownItem.name} className="group">
                          <a
                            href={dropdownItem.href || '#'}
                            className="block px-2 py-1 hover:bg-gray-200 transition-colors"
                          >
                            {dropdownItem.name}
                          </a>
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

              <li className="md:hidden flex flex-col space-y-4 mt-4">
                <button
                  className={`py-2 px-4 text-left font-bold ${textColor} hover:text-[#F89F2D] transition-colors`}
                  onClick={() => setLoginModalOpen(true)} // Open LoginModal
                >
                  Login
                </button>
                <button
                  className="py-2 px-4 text-left border border-[#F89F2D] text-[#F89F2D] font-bold rounded-lg transition-colors hover:bg-[#F89F2D] hover:text-white"
                  onClick={() => setRegisterModalOpen(true)} // Open RegisterModal
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
          
          <button
            className={`text-2xl md:hidden ${iconColor} ml-auto`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          <div className="hidden md:flex space-x-2">
            <button
              className={`py-1 px-2 font-bold transition-colors ${textColor} hover:text-[#F89F2D]`}
              onClick={() => setLoginModalOpen(true)} // Open LoginModal
            >
              Login
            </button>
            <button
              className="py-1 px-2 border border-[#F89F2D] text-[#F89F2D] font-bold rounded-lg transition-colors hover:bg-[#F89F2D] hover:text-white"
              onClick={() => setRegisterModalOpen(true)} // Open RegisterModal
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} />
    </>
  );
};

export default Navbar;
