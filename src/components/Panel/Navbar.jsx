import React, { useState, useEffect } from 'react';
import {
  FaBell,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import twbLogo1 from '../../assets/twbLogo1.png';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReusableModal from '../reusable/ReusableModal';
import UserProfileModal from './UserProfileModal';
import RequirementsModal from '../Panel/projectTabs/RequirementsModal';
import OtpModal from './user/OtpModal';
import LogoutOverlay from './LogoutOverlay';
import ResponseModal from './ResponseModal';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [requirementsModalOpen, setRequirementsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const { user, refetch, fetchUserData, isAuthenticated, backend } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name ? user.name.split(' ')[0].substring(0, 10) : 'Guest';

  useEffect(() => {
    fetchUserData();

    const closeDropdown = (e) => {
      if (!e.target.closest('#avatar-menu')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(`${backend}/auth/logout`, {}, { withCredentials: true });
      await refetch();
      navigate('/');
    } catch (err) {
      setLogoutError({
        success: false,
        message: err.response?.data?.message || 'Logout failed. Please try again.',
      });
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const sessionKey = `sessionData_${user.email}`;
      const stored = sessionStorage.getItem(sessionKey);
      if (stored) {
        setRequirementsModalOpen(true);
      }
    }
  }, [isAuthenticated, user]);

  const handleOpenOtp = () => {
    setIsProfileModalOpen(false);
    setIsOtpModalOpen(true);
  };

  const handleCloseOtpAndReopenProfile = () => {
    setIsOtpModalOpen(false);
    setIsProfileModalOpen(true);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="xl:mx-20 md:mx-2 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={twbLogo1} alt="TWB Logo" className="h-8 sm:h-10 w-auto" />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            <button className="relative group text-gray-600 hover:text-orange-400 transition">
              <FaBell className="text-lg sm:text-xl" />
              <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-[10px] sm:text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </button>

            <button className="text-gray-600 hover:text-orange-400 transition">
              <FaCog className="text-lg sm:text-xl" />
            </button>

            {/* Avatar & Dropdown */}
            <div className="relative" id="avatar-menu">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition"
              >
                <span className="hidden md:block font-semibold text-sm sm:text-base">
                  {firstName}
                </span>

                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <FaUserCircle className="text-xl sm:text-2xl text-orange-400" />
                )}
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 z-50">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsDropdownOpen(false); // ✅ closes dropdown
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r from-[#aab3ff] to-[#ffd6a1] hover:text-white transition"
                  >
                    <FaUser className="mr-2" />
                    View Profile
                  </button>

                  <div className="border-t border-gray-200"></div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false); // ✅ closes dropdown
                      handleLogout();
                    }}
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

      {/* Profile Modal */}
      <ReusableModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
        <UserProfileModal
          onClose={() => setIsProfileModalOpen(false)}
          onOtpOpen={handleOpenOtp}
        />
      </ReusableModal>

      {/* OTP Modal */}
      <ReusableModal isOpen={isOtpModalOpen} onClose={handleCloseOtpAndReopenProfile}>
        <OtpModal
          onClose={() => setIsOtpModalOpen(false)}
          reopenProfile={handleCloseOtpAndReopenProfile}
        />
      </ReusableModal>

      {/* Requirements Modal */}
      <RequirementsModal
        isOpen={requirementsModalOpen}
        onClose={() => setRequirementsModalOpen(false)}
      />

      {/* Logout Overlay */}
      {isLoggingOut && <LogoutOverlay />}

      {/* Logout Error Modal */}
      {logoutError && (
        <ResponseModal
          response={logoutError}
          onClose={() => setLogoutError(null)}
        />
      )}
    </nav>
  );
};

export default Navbar;
