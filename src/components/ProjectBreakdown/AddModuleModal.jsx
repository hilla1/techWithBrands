import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReusableModal from '../reusable/ReusableModal';

// Define the Zod schema for module validation
const moduleSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  difficulty: z.number().min(1, 'Difficulty must be at least 1'),
  expertAssigned: z.string().optional(),
  progress: z.number().min(0).max(100, 'Progress must be between 0 and 100'),
  milestones: z.array(z.string()).optional(),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
  price: z.number().min(0, 'Price must be a positive number'),
  status: z.enum(['pending', 'in_progress', 'completed']),
  unassigned: z.boolean().optional(),
  expertAccepted: z.boolean().optional(),
  startTime: z.string().optional(),
  deadline: z.string().optional(),
});

const AddModuleModal = ({ open, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);

  // Initialize useForm with Zod validation
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 1,
      expertAssigned: '',
      progress: 0,
      milestones: [],
      percentage: 0,
      price: 0,
      status: 'pending',
      unassigned: true,
      expertAccepted: false,
      startTime: '',
      deadline: '',
    },
  });

  const handleAdd = async (data) => {
    setLoading(true);
    try {
      await onSave(data); // Save new module data
      onClose(); // Close modal after saving
      reset(); // Reset form after closing
    } catch (error) {
      console.error('Error saving data:', error); // Log any save errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal isOpen={open} onClose={() => { onClose(); reset(); }}>
      <div className="rounded-lg">
        <h2 className="text-xl mb-4 text-blue-900">Add New Module</h2>
        <form onSubmit={handleSubmit(handleAdd)}>
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

          {/* Other Fields (similar to the Edit form) */}
          {/* ... include other fields similarly as needed */}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={() => { onClose(); reset(); }}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-900 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </ReusableModal>
  );
};

export default AddModuleModal;
