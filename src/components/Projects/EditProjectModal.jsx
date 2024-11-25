import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReusableModal from '../reusable/ReusableModal';

// Define the Zod schema for validation
const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  deadline: z.string().optional(), // Optional, but if provided, should be in string format
  totalPrice: z.number().min(0, 'Total price must be a positive number'),
  approved: z.boolean(),
  cashReady: z.boolean(),
  managerEmail: z.string().email('Invalid manager email').optional(),
  clientEmail: z.string().email('Invalid client email').optional(),
  clientNumber: z.string().optional(),
});

const EditProjectModal = ({ open, onClose, selectedProject, onSave }) => {
  const [loading, setLoading] = useState(false);

  // Initialize useForm with Zod validation
  const { register, reset, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: selectedProject?._id || '',
      title: selectedProject?.title || '',
      description: selectedProject?.description || '',
      deadline: selectedProject?.deadline ? new Date(selectedProject.deadline).toISOString().split('T')[0] : '',
      totalPrice: selectedProject?.totalPrice || 0,
      approved: selectedProject?.approved || false,
      cashReady: selectedProject?.cashReady || false,
      managerEmail: selectedProject?.manager?.email || '',
      clientEmail: selectedProject?.client?.email || '',
      clientNumber: selectedProject?.clientNumber || '',
    },
  });

  useEffect(() => {
    if (selectedProject) {
      reset({
        id: selectedProject._id,
        title: selectedProject.title,
        description: selectedProject.description,
        deadline: selectedProject.deadline ? new Date(selectedProject.deadline).toISOString().split('T')[0] : '',
        totalPrice: selectedProject.totalPrice || 0,
        approved: selectedProject.approved,
        cashReady: selectedProject.cashReady,
        managerEmail: selectedProject.manager?.email || '',
        clientEmail: selectedProject.client?.email || '',
        clientNumber: selectedProject?.clientNumber || '',
      });
    }
  }, [selectedProject, reset]);

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
        <h2 className="text-xl mb-4 text-blue-900">Edit Project</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <input type="hidden" {...register('id')} />

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Project Title"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Project Description"
              rows="3"
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          {/* Deadline Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              {...register('deadline')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Project Deadline"
            />
          </div>

          {/* Number of Modules */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Number of Modules</label>
            <input
              type="number"
              value={selectedProject ? selectedProject.modules.length : 0}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
              aria-label="Number of Modules"
            />
          </div>

          {/* Manager Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Manager Email</label>
            <input
              type="email"
              {...register('managerEmail')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Manager Email"
            />
            {errors.managerEmail && <p className="text-red-500 text-xs">{errors.managerEmail.message}</p>}
          </div>

          {/* Client Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Client Email</label>
            <input
              type="email"
              {...register('clientEmail')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Client Email"
            />
            {errors.clientEmail && <p className="text-red-500 text-xs">{errors.clientEmail.message}</p>}
          </div>

          {/* Client Phone Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Client Number</label>
            <input
              type="text"
              {...register('clientNumber')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Client Number"
            />
          </div>

          {/* Total Price Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Price</label>
            <input
              type="number"
              {...register('totalPrice', { valueAsNumber: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Total Price"
            />
            {errors.totalPrice && <p className="text-red-500 text-xs">{errors.totalPrice.message}</p>}
          </div>

          {/* Approved Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('approved')}
                className="mr-2 leading-tight"
              />
              <span className="text-gray-700">Approved</span>
            </label>
          </div>

          {/* Cash Ready Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('cashReady')}
                className="mr-2 leading-tight"
              />
              <span className="text-gray-700">Cash Ready</span>
            </label>
          </div>

          {/* Progress Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Progress</label>
            <input
              type="number"
              value={selectedProject ? selectedProject.progress : 0}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
              aria-label="Project Progress"
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

export default EditProjectModal;
