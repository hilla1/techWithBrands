import { useState, useEffect, useRef, useCallback } from 'react';

const useDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTriggerRef = useRef(null);
  const closeDropdownTimeoutRef = useRef(null);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleMouseEnterDropdown = useCallback(() => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
    setIsDropdownHovered(true);
  }, []);

  const handleMouseLeaveDropdown = useCallback(() => {
    closeDropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setIsDropdownHovered(false);
    }, 300); // Adjust delay time as needed
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      dropdownTriggerRef.current && !dropdownTriggerRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
      setIsDropdownHovered(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    dropdownTriggerRef,
    handleDropdownToggle,
    handleMouseEnterDropdown,
    handleMouseLeaveDropdown,
  };
};

export default useDropdown;