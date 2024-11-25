// src/components/modals/PostModal.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PhotoUploadSection from '../reusable/PhotoUploadSection'; 
import useApiRequest from '../../hooks/useApiRequest'; 

// Define the validation schema using Zod
const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
});

const PostModal = ({ isOpen, onClose, post, onPostUpdate }) => {
  const [image, setImage] = useState(post?.image || '');
  const [errorMessage, setErrorMessage] = useState('');

  // API request hooks
  const { makeRequest: updatePost, loading: updatingPost } = useApiRequest();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      description: post?.description || '',
      category: post?.category || '',
    },
  });

  useEffect(() => {
    if (post) {
      setImage(post.image || '');
      reset({
        title: post.title || '',
        description: post.description || '',
        category: post.category || '',
      });
    }
  }, [post, reset]);

  const onSubmit = async (data) => {
    if (!post._id) {
      console.error('Post ID is undefined. Cannot update the post.');
      return;
    }

    try {
      const updatedPost = {
        ...post,
        title: data.title,
        description: data.description,
        category: data.category,
        image,
      };
      
      const response = await updatePost(`/articles/${post._id}`, 'PUT', updatedPost, {
        'Content-Type': 'application/json',
      });

      if (response) {
        onPostUpdate(response);
        onClose(); // Close the modal after saving
      }
    } catch (error) {
      console.error("Failed to update post", error);
      setErrorMessage('Failed to update post. Please try again.');
    }
  };

  const handleImageUpdate = (newImageUrl) => {
    setImage(newImageUrl);
    onPostUpdate({ ...post, image: newImageUrl });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setErrorMessage('');
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative flex flex-col h-full max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={() => { onClose(); setErrorMessage(''); }}
        >
          &times;
        </button>
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
              onClick={() => { onClose(); reset(); setErrorMessage(''); }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              disabled={updatingPost}
            >
              {updatingPost ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
