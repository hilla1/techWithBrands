import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReusableModal from '../reusable/ReusableModal';

const CreateUserModal = ({ open, onClose, onCreate }) => {
  const [loading, setLoading] = useState(false);

  const createUserSchema = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    username: z.string().nonempty('Username is required'),
    role: z.enum(['admin', 'client', 'consultant', 'business', 'freelancer'], 'Role is required'),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    profilePhoto: z.string().optional(),
    coverPhoto: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      username: '',
      role: 'client',
      fullName: '',
      phoneNumber: '',
      bio: '',
      profilePhoto: '',
      coverPhoto: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await onCreate(data);
    reset();
    setLoading(false);
  };

  return (
    <ReusableModal isOpen={open} onClose={() => { onClose(); reset(); }}>
      <div>
        <h2 className="text-xl mb-4 text-blue-900">Create New User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name')}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200 ${errors.name ? 'border-red-500' : ''}`}
              aria-label="Name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200 ${errors.email ? 'border-red-500' : ''}`}
              aria-label="Email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password')}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200 ${errors.password ? 'border-red-500' : ''}`}
              aria-label="Password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
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
              aria-label="Role"
            >
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="consultant">Consultant</option>
              <option value="business">Business</option>
              <option value="freelancer">Freelancer</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {/* Optional Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              {...register('fullName')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Full Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              {...register('phoneNumber')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Phone Number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register('bio')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              rows={3}
              aria-label="Bio"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Profile Photo URL</label>
            <input
              type="text"
              {...register('profilePhoto')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Profile Photo URL"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cover Photo URL</label>
            <input
              type="text"
              {...register('coverPhoto')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
              aria-label="Cover Photo URL"
            />
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
              {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </ReusableModal>
  );
};

export default CreateUserModal;
