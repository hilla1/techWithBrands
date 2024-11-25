import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReusableModal from '../reusable/ReusableModal';

// Define the Zod schema for module validation
const moduleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  difficulty: z.number().min(1, 'Difficulty must be at least 1'),
  expertAssigned: z.string().optional(),
  progress: z.number().min(0).max(100, 'Progress must be between 0 and 100'),
  milestones: z.array(z.string()).optional(), // Assuming milestones are strings, modify as needed
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
  price: z.number().min(0, 'Price must be a positive number'),
  status: z.enum(['pending', 'in_progress', 'completed']),
  unassigned: z.boolean().optional(),
  expertAccepted: z.boolean().optional(),
  startTime: z.string().optional(), // Optional, but in string format
  deadline: z.string().optional(), // Optional, but in string format
});

const EditModuleModal = ({ open, onClose, selectedModule, onSave }) => {
  const [loading, setLoading] = useState(false);

  // Initialize useForm with Zod validation
  const { register, reset, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      id: selectedModule?._id || '',
      title: selectedModule?.title || '',
      description: selectedModule?.description || '',
      difficulty: selectedModule?.difficulty || 1,
      expertAssigned: selectedModule?.expertAssigned?.email || '',
      progress: selectedModule?.progress || 0,
      milestones: selectedModule?.milestones || [],
      percentage: selectedModule?.percentage || 0,
      price: selectedModule?.price || 0,
      status: selectedModule?.status || 'pending',
      unassigned: selectedModule?.unassigned || true,
      expertAccepted: selectedModule?.expertAccepted || false,
      startTime: selectedModule?.startTime ? new Date(selectedModule.startTime).toISOString().split('T')[0] : '',
      deadline: selectedModule?.deadline ? new Date(selectedModule.deadline).toISOString().split('T')[0] : '',
    },
  });

  useEffect(() => {
    if (selectedModule) {
      reset({
        id: selectedModule._id,
        title: selectedModule.title,
        description: selectedModule.description,
        difficulty: selectedModule.difficulty || 1,
        expertAssigned: selectedModule?.expertAssigned?.email || '', 
        progress: selectedModule.progress || 0,
        milestones: selectedModule.milestones || [],
        percentage: selectedModule.percentage || 0,
        price: selectedModule.price || 0,
        status: selectedModule.status || 'pending',
        unassigned: selectedModule?.unassigned || true,
        expertAccepted: selectedModule.expertAccepted || false,
        startTime: selectedModule.startTime ? new Date(selectedModule.startTime).toISOString().split('T')[0] : '',
        deadline: selectedModule.deadline ? new Date(selectedModule.deadline).toISOString().split('T')[0] : '',
      });
    }
  }, [selectedModule, reset]);

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await onSave(data); // Save data
      onClose(); // Close modal after saving
    } catch (error) {
      console.error('Error saving data:', error); // Log any save errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal isOpen={open} onClose={() => { onClose(); reset(); }}>
      <div className="rounded-lg">
        <h2 className="text-xl mb-4 text-blue-900">Edit Module</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <input type="hidden" {...register('id')} />

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Module Title"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Module Description"
              rows="3"
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          {/* Difficulty Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <input
              type="number"
              {...register('difficulty', { valueAsNumber: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Module Difficulty"
            />
            {errors.difficulty && <p className="text-red-500 text-xs">{errors.difficulty.message}</p>}
          </div>

          {/* Expert Assigned Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Expert Email</label>
            <input
              type="text"
              {...register('expertAssigned')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Expert Assigned"
            />
          </div>

          {/* Progress Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Progress in %</label>
            <input
              type="number"
              {...register('progress', { valueAsNumber: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Module Progress"
            />
            {errors.progress && <p className="text-red-500 text-xs">{errors.progress.message}</p>}
          </div>

          {/* Percentage Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price Share in %</label>
            <input
              type="number"
              {...register('percentage', { valueAsNumber: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Module Percentage"
            />
            {errors.percentage && <p className="text-red-500 text-xs">{errors.percentage.message}</p>}
          </div>

          {/* Price Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Module Price"
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
          </div>

          {/* Status Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select {...register('status')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Unassigned Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('unassigned')}
                className="mr-2 leading-tight"
              />
              <span className="text-gray-700">Unassigned</span>
            </label>
          </div>

          {/* Expert Accepted Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('expertAccepted')}
                className="mr-2 leading-tight"
              />
              <span className="text-gray-700">Expert Accepted</span>
            </label>
          </div>

          {/* Start Time Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="date"
              {...register('startTime')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Start Time"
            />
          </div>

          {/* Deadline Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              {...register('deadline')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Deadline"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-900 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </ReusableModal>
  );
};

export default EditModuleModal;
