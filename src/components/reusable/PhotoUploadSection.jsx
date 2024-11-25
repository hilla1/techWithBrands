import React, { useState, useEffect, useRef } from 'react';
import { FaPen, FaArrowUp } from 'react-icons/fa';
import useApiRequest from '../../hooks/useApiRequest';
import Spinner from './Spinner';

const PhotoUploadSection = ({ label, currentPhoto, onPhotoUpdate }) => {
  const [preview, setPreview] = useState(currentPhoto);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showUploadIcon, setShowUploadIcon] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const containerRef = useRef(null);

  // Updated hook for API request
  const { makeRequest: uploadImage, loading: uploading } = useApiRequest();

  // Update preview image when currentPhoto changes
  useEffect(() => {
    setPreview(currentPhoto);
  }, [currentPhoto]);

  // Handle clicks outside of the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu if not hovered
  useEffect(() => {
    if (!isHovered) {
      setShowMenu(false);
    }
  }, [isHovered]);

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setShowUploadIcon(true);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    const fileInput = document.getElementById(`${label}-fileInput`);
    const file = fileInput.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await uploadImage('/upload', 'POST', formData, { 'Content-Type': 'multipart/form-data' });

        // Log the response to check its structure
       //console.log('Response from server:', response);

        // Access the imageUrl based on the server's response structure
        if (response?.imageUrl) {
          const uploadedImageUrl = response.imageUrl;
          setShowUploadIcon(false);
          setShowSaveMessage(true);
          setTimeout(() => setShowSaveMessage(false), 3000);
          onPhotoUpdate(uploadedImageUrl);
          setErrorMessage(''); // Clear any previous error
        } else {
          console.error('Unexpected response structure:', response);
          setErrorMessage('Image upload failed: Invalid response from the server.');
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        setErrorMessage('Image upload failed: ' + error.message);
      }
    }
  };

  // Handle removing the uploaded photo
  const handleRemoveClick = () => {
    setPreview('https://via.placeholder.com/150');
    onPhotoUpdate(null);
    setShowUploadIcon(false);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
    setShowMenu(false);
  };

  // Toggle edit menu visibility
  const handleEditClick = () => {
    setShowMenu((prev) => !prev);
  };

  // Trigger file input click
  const handleChangeImageClick = () => {
    document.getElementById(`${label}-fileInput`).click();
    setShowMenu(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="block text-gray-600 mb-2">{label}</label>
      <div className="relative mb-4">
        {uploading ? (
          <div className="flex justify-center items-center w-full h-40 bg-gray-200 rounded-md">
            <Spinner size="medium" />
          </div>
        ) : (
          <img
            src={preview || 'https://via.placeholder.com/150'}
            alt={label}
            className="w-full h-40 object-cover rounded-md"
          />
        )}

        {showUploadIcon && (
          <div className="absolute top-2 right-2 flex flex-col items-center">
            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
            >
              <FaArrowUp className="text-blue-900" size={24} />
            </button>
            <span className="text-blue-900 text-sm">Upload Now</span>
          </div>
        )}

        {showSaveMessage && (
          <div className="absolute top-14 right-2 bg-white border border-gray-200 rounded-md p-2 shadow-lg">
            <span className="text-green-500">Click Save Changes</span>
          </div>
        )}

        {errorMessage && (
          <div className="absolute top-14 right-2 bg-white border border-red-500 rounded-md p-2 shadow-lg">
            <span className="text-red-500">{errorMessage}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleEditClick}
          className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 ${isHovered && !showUploadIcon ? 'block' : 'hidden'}`}
        >
          <FaPen className="text-gray-500" size={20} />
        </button>

        {showMenu && (
          <div className="absolute top-12 right-2 bg-white border border-gray-200 shadow-lg rounded-md p-2">
            <button
              type="button"
              onClick={handleChangeImageClick}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleRemoveClick}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
            >
              Remove Image
            </button>
          </div>
        )}
      </div>
      <input
        type="file"
        id={`${label}-fileInput`}
        className="sr-only"
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
};

export default PhotoUploadSection;
