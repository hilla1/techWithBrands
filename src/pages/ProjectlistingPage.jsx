import React, { useState } from 'react';
import HomeLayout from '../components/HomePage/HomeLayout';
import ReusableModal from '../components/reusable/ReusableModal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useApiRequest from '../hooks/useApiRequest';
import Spinner from '../components/reusable/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import useAuth from '../hooks/useAuth';

// Define validation schemas using Zod
const projectSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }), 
  description: z.string().min(10, { message: 'Description is required' }),
  deadline: z.string().min(3, { message: 'Deadline is required' }),
});

const profileSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

const ProjectlistingPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [projectData, setProjectData] = useState(null); // New state for project data
  const { data, loading, error, makeRequest } = useApiRequest();
  const navigate = useNavigate(); 
  const { getUser } = useAuth();
  const user = getUser();

  // Use form for project submission
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
  });

  // Use form for profile update
  const { register: registerProfile, handleSubmit: handleProfileSubmit, setValue, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Fetch user profile when modal is opened
  const fetchProfile = async (userId) => {
    try {
      const response = await makeRequest(`/api/profiles/${userId}`, 'GET');
      console.log('Fetched Profile Data:', response); // 3. Log the fetched profile data
      setProfileData(response); // Save fetched data to state

      // Prefill form fields with existing data
      setValue('phoneNumber', response.phoneNumber || '');
      setValue('email', response.email || '');
      
      // Open modal after fetching profile data
      setModalOpen(true);
    } catch (err) {
      toast.error('Failed to fetch profile data.');
    }
  };

  // Handle project form submission
  const onSubmit = async (data) => {
    const userId = user?.id;

    // Save project data to state
    setProjectData(data);

    // Ensure that loading is complete before fetching profile data
    if (!loading && userId) {
      await fetchProfile(userId); // Fetch profile and open modal
    }
  };

  // Handle profile update submission
  const onProfileSubmit = async (profileData) => {
    const userId = user?.id;

    try {
      // Update the profile
      const updateResponse = await makeRequest(`/api/profiles/${userId}`, 'PUT', profileData);
      console.log('Profile Update Response:', updateResponse); // 4. Log the profile update response

      // Display success toast for profile update
      toast.success('Profile updated successfully!');

      // Prepare the project data from the state, changing `titleOrCompany` to `title`
      const projectDetails = {
        title: projectData.title, // Changed from titleOrCompany to title
        description: projectData.description,
        deadline: projectData.deadline,
      };

      const projectResponse = await makeRequest('/projects', 'POST', projectDetails); // Capture the response

      // Assuming the response contains the project ID
      const projectId = projectResponse?.project?._id; // Adjust based on your API's response structure

      if (projectId) {
        // Display success toast for project creation
        toast.success('Project created successfully!');

        // Redirect to the breakdown page with the project ID
        navigate(`/breakdown/${projectId}`);
      } else {
        // If project ID is not returned, handle accordingly
        toast.error('Project created but failed to retrieve project ID.');
      }

      // Close the modal after success
      setModalOpen(false);
    } catch (err) {
      console.error('Error updating profile or creating project:', err);
      toast.error('Failed! Something went wrong. Please try again.');
    }
  };

  return (
    <HomeLayout>
      <div className="p-4 bg-gray-100 flex flex-col justify-center items-center">
        <ToastContainer />

        {loading && <Spinner />} {/* Show spinner while loading */}
        {!loading && (
          <main className="flex-1 flex flex-col justify-center items-center px-4">
            <section className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Describe Your Project</h2>
              <p className="text-gray-700 mb-6">
                Provide detailed information about your idea, this will help us understand your project better.
              </p>
            </section>

            <form className="w-full max-w-4xl bg-white p-8 rounded shadow-md" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
                  Project Title or Company Name
                </label>
                <input
                  {...register('title')} // Changed to 'title'
                  type="text"
                  id="title"
                  className="w-full p-3 border rounded focus:outline-none focus:border-blue-900"
                  placeholder="Enter your project title or Company Name"
                />
                {errors.title && <p className="text-red-600">{errors.title.message}</p>} {/* Changed to title */}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
                  Project Description
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  className="w-full p-3 border rounded focus:outline-none focus:border-blue-900"
                  placeholder="Describe your project in detail"
                  rows="5"
                ></textarea>
                {errors.description && <p className="text-red-600">{errors.description.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="deadline">
                  Project Deadline
                </label>
                <input
                  {...register('deadline')}
                  type="date"
                  id="deadline"
                  className="w-full p-3 border rounded focus:outline-none focus:border-blue-900"
                />
                {errors.deadline && <p className="text-red-600">{errors.deadline.message}</p>}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </main>
        )}

        {/* Profile Confirmation Modal */}
        {!loading && ( // Show the modal only when not loading
          <ReusableModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            <h3 className="text-lg font-semibold mb-4">Confirm Your Profile</h3>
            <p>Please confirm or update your phone number and email before proceeding.</p>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  {...registerProfile('phoneNumber')}
                  type="text"
                  id="phoneNumber"
                  className="w-full p-3 border rounded focus:outline-none focus:border-blue-900"
                  placeholder="Enter phone number"
                />
                {profileErrors.phoneNumber && <p className="text-red-600">{profileErrors.phoneNumber.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                <input
                  {...registerProfile('email')}
                  type="email"
                  id="email"
                  className="w-full p-3 border rounded focus:outline-none focus:border-blue-900"
                  placeholder="Enter email"
                />
                {profileErrors.email && <p className="text-red-600">{profileErrors.email.message}</p>}
              </div>

              <div className="flex justify-center">
                <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition">
                  Confirm
                </button>
              </div>
            </form>
          </ReusableModal>
        )}
      </div>
    </HomeLayout>
  );
};

export default ProjectlistingPage;
