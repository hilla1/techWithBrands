import React, { useRef, useState } from 'react';
import { FiX, FiArrowUpRight } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// Check if the image is from Cloudinary
const isCloudinaryUrl = (url) =>
  url?.includes('res.cloudinary.com') && /\/([^/]+)\.\w+$/.test(url);

// Extract publicId from Cloudinary image URL
const extractPublicId = (url) => {
  if (!isCloudinaryUrl(url)) return null;
  const match = url.match(/\/([^/]+)\.\w+$/); // extract filename before extension
  return match ? match[1] : null;
};

const EditProfileImage = ({ onChange, setUploading }) => {
  const { backend, user, refetch } = useAuth();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [uploading, localSetUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({
    type: 'info',
    text: 'Click the image or avatar to change',
  });

  const syncUploading = (val) => {
    localSetUploading(val);
    setUploading?.(val);
  };

  // Deletes image from Cloudinary using extracted publicId
  const deleteFromCloud = async (url) => {
    if (!isCloudinaryUrl(url)) return;
    const publicId = extractPublicId(url);
    if (!publicId) return;
    try {
      await axios.post(
        `${backend}/file/delete`,
        { publicId },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (err) {
      console.error('Delete error:', err.response?.data?.message || err.message);
    }
  };

  // Updates the user's avatar in the database
  const updateUserAvatar = async (avatarUrl) => {
    try {
      await axios.patch(
        `${backend}/user/update-profile`,
        { avatar: avatarUrl },
        { withCredentials: true }
      );
      refetch?.(); // refresh user context
    } catch (err) {
      console.error('Update DB error:', err.response?.data?.message || err.message);
    }
  };

  // Handles uploading a new file
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showMessage('error', '❌ File exceeds 20MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      syncUploading(true);
      const res = await axios.post(`${backend}/file/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        },
      });

      const data = res.data;
      if (!data.success) throw new Error(data.message || 'Upload failed');

      await deleteFromCloud(preview); // delete old image if from Cloudinary

      setPreview(data.url);
      await updateUserAvatar(data.url);
      onChange?.(data.url);
      showMessage('success', '✅ Profile image updated!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      syncUploading(false);
    }
  };

  // Handles removing the current avatar
  const handleRemove = async () => {
    try {
      await deleteFromCloud(preview);
      setPreview('');
      await updateUserAvatar('');
      onChange?.(null);
      showMessage('success', '✅ Profile image removed!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || err.message || 'Delete failed');
    }
  };

  // Shows feedback message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: 'info', text: 'Click the image or avatar to change' });
    }, 4000);
  };

  return (
    <div className="text-center space-y-4">
      {/* Image or Avatar */}
      <div
        className="relative inline-block group cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow transition duration-300 group-hover:scale-105"
          />
        ) : (
          <FaUserCircle className="text-7xl text-gray-400 hover:text-orange-500 transition duration-300" />
        )}

        {/* Remove Button */}
        {preview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="absolute -top-1 -right-1 bg-white border border-gray-300 text-red-500 hover:text-red-700 rounded-full p-[2px] shadow"
            aria-label="Remove"
          >
            <FiX size={14} />
          </button>
        )}

        {/* Hover Arrow */}
        {preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300 rounded-full">
            <FiArrowUpRight className="text-white text-2xl opacity-0 group-hover:opacity-100 transition duration-300" />
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Progress */}
      {uploading && (
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-blue-500 mt-1">Uploading... {progress}%</p>
        </div>
      )}

      {/* Feedback Message */}
      {message?.text && (
        <p
          className={`text-sm font-medium ${
            message.type === 'success'
              ? 'text-green-600'
              : message.type === 'error'
              ? 'text-red-600'
              : 'text-gray-500'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default EditProfileImage;
