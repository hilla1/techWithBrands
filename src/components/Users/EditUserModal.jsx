import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReusableModal from '../reusable/ReusableModal';

const EditUserModal = ({ open, onClose, selectUser, onSave }) => {
  const [loading, setLoading] = useState(false);

  const editUserSchema = z.object({
    id: z.string(),
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
    username: z.string().optional(),
    role: z.enum(['admin', 'client', 'consultant', 'business', 'freelancer'], 'Role is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: selectUser._id,
      name: selectUser.name,
      email: selectUser.email,
      username: selectUser.profile?.username || '',
      role: selectUser.role,
    },
  });

  useEffect(() => {
    reset({
      id: selectUser._id,
      name: selectUser.name,
      email: selectUser.email,
      username: selectUser.profile?.username || '',
      role: selectUser.role,
    });
  }, [selectUser, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    await onSave(data);
    setLoading(false);
  };

  return (
    <ReusableModal isOpen={open} onClose={() => { onClose(); reset(); }}>
      <div className="rounded-lg">
        <h2 className="text-xl mb-4 text-blue-900">Edit User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('id')} />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name')}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200 ${errors.name ? 'border-red-500' : ''}`}
              aria-label="User Name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200 ${errors.email ? 'border-red-500' : ''}`}
              aria-label="User Email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username (Optional)</label>
            <input
              type="text"
              {...register('username')}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200 ${errors.username ? 'border-red-500' : ''}`}
              aria-label="Username"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              {...register('role')}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200 ${errors.role ? 'border-red-500' : ''}`}
              aria-label="User Role"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="consultant">Consultant</option>
              <option value="business">Business</option>
              <option value="freelancer">Freelancer</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => { onClose(); reset(); }}
              className="mr-2 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="relative ml-2 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </ReusableModal>
  );
};

export default EditUserModal;
