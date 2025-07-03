import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import EditProfileImage from './EditProfileImage';

// Regex for basic phone validation
const phoneRegex = /^[+\d]?[()\d\s-]{9,}$/;

const editProfileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(phoneRegex, 'Invalid phone number'),
});

const EditProfileForm = () => {
  const { user, backend, refetch } = useAuth();
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const editForm = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      editForm.reset({
        name: user.name,
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (modalData?.success) {
      const timer = setTimeout(() => setModalData(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [modalData]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name.trim(),
        phone: data.phone, // no formatting, use as is
      };

      const res = await axios.patch(`${backend}/user/update-profile`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        setModalData({ success: true, message: 'Profile updated successfully!' });
        refetch();
      } else {
        setModalData({ success: false, message: res.data.message || 'Update failed' });
      }
    } catch (err) {
      setModalData({ success: false, message: err.message || 'Something went wrong' });
    }
    setLoading(false);
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <form onSubmit={editForm.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Profile Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">Profile Image</label>
        <EditProfileImage setUploading={setImageUploading} onChange={() => {}} />
      </div>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          {...editForm.register('name')}
          placeholder="Enter full name"
          className="w-full border rounded px-3 py-2 mt-1"
          disabled={loading || imageUploading}
        />
        {editForm.formState.errors.name && (
          <p className="text-red-500 text-sm">{editForm.formState.errors.name.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="text"
          {...editForm.register('phone')}
          placeholder="+254 712 345678"
          className="w-full border rounded px-3 py-2 mt-1"
          disabled={loading || imageUploading}
        />
        {editForm.formState.errors.phone && (
          <p className="text-red-500 text-sm">{editForm.formState.errors.phone.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded shadow flex items-center gap-2"
          disabled={loading || imageUploading}
        >
          {(loading || imageUploading) && <FaSpinner className="animate-spin" />}
          {imageUploading
            ? 'Uploading...'
            : loading
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </div>

      {/* Feedback Modal */}
      {modalData && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg p-6 w-80 text-center">
            <div
              className={`text-4xl mb-2 mx-auto ${
                modalData.success ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {modalData.success ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <p className="text-lg font-semibold mb-4">{modalData.message}</p>
            <button
              onClick={() => setModalData(null)}
              className={`${
                modalData.success
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              } text-white px-4 py-2 rounded`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default EditProfileForm;
