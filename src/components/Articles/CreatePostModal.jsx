// src/components/modals/CreatePostModal.jsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PhotoUploadSection from '../reusable/PhotoUploadSection'; 
import useApiRequest from '../../hooks/useApiRequest'; 

// Define the validation schema using Zod
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'), 
});

const CreatePostModal = ({ isOpen, onClose, onPostCreate }) => {
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // API request hooks
  const { makeRequest: createPost } = useApiRequest();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const newPost = {
        title: data.title,
        description: data.description,
        category: data.category, // Include category in the new post
        image,
        likes: 0, // Initialize likes
        userLiked: false, // Initialize userLiked
        author: 'Current User', // Replace with actual user data if available
        date: new Date().toISOString(),
      };

      // Replace with your actual API call
      const response = await createPost(`/articles`, 'POST', newPost, {
        'Content-Type': 'application/json',
      });

      // Assuming the API returns the created post
      if (response) {
        onPostCreate(response);
        reset();
        setImage('');
        onClose();
      }
    } catch (error) {
      console.error("Failed to create post", error);
      setErrorMessage('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpdate = (newImageUrl) => {
    setImage(newImageUrl);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      reset();
      setImage('');
      setErrorMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative flex flex-col h-full max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={() => { onClose(); reset(); setImage(''); setErrorMessage(''); }}
        >
          &times;
        </button>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Create New Post</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Title</label>
                <input
                  {...register('title')}
                  className={`border border-gray-300 p-2 w-full rounded-lg ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Enter post title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Description</label>
                <textarea
                  {...register('description')}
                  className={`border border-gray-300 p-2 w-full rounded-lg ${errors.description ? 'border-red-500' : ''}`}
                  rows="4"
                  placeholder="Enter post description"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Category</label>
                <input
                  {...register('category')}
                  className={`border border-gray-300 p-2 w-full rounded-lg ${errors.category ? 'border-red-500' : ''}`}
                  placeholder="Enter post category"
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>
              <PhotoUploadSection
                label="Post Image"
                currentPhoto={image}
                onPhotoUpdate={handleImageUpdate}
              />
              {errorMessage && (
                <div className="mb-4 text-red-500 text-sm">
                  {errorMessage}
                </div>
              )}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  onClick={() => { onClose(); reset(); setImage(''); setErrorMessage(''); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
