import React, { useState, useEffect } from 'react';
import HomeLayout from '../components/HomePage/HomeLayout';
import Spinner from '../components/reusable/Spinner'; 
import ReusableModal from '../components/reusable/ReusableModal'; 
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'; 
import { 
  setLoading, 
  setTestimonials, 
  addTestimonial, 
  updateTestimonial, 
  deleteTestimonials 
} from '../redux/slices/testimonialsSlice'; 
import useApiRequest from '../hooks/useApiRequest'; 
import { toast, Toaster } from 'react-hot-toast';

const Testimonials = () => {
  const dispatch = useDispatch();
  const testimonials = useSelector(state => state.testimonials.items);
  const loading = useSelector(state => state.testimonials.loading);
  const { makeRequest } = useApiRequest();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      dispatch(setLoading(true));
      const response = await makeRequest('/testimonials', 'GET');
      if (response) dispatch(setTestimonials(response));
      dispatch(setLoading(false));
    };
    fetchTestimonials();
  }, [dispatch, makeRequest]);

  const openEditModal = (testimonial) => {
    setNewTestimonial(testimonial);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewTestimonial({ name: '', title: '', description: '' });
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateTestimonial = async () => {
    const createdTestimonial = { ...newTestimonial };
    try {
      const response = await makeRequest('/testimonials', 'POST', newTestimonial);
      if (response) {
        dispatch(addTestimonial({ ...createdTestimonial, _id: response._id })); // Update with the ID from the server
        toast.success('Testimonial created successfully!'); // Success toast
        closeCreateModal();
      }
    } catch (error) {
      toast.error('Failed to create testimonial. Please try again.'); // Error toast
      console.error(error);
    }
  };

  const handleUpdateTestimonial = async () => {
    const updatedTestimonial = { ...newTestimonial };
    try {
      const response = await makeRequest(`/testimonials/${newTestimonial._id}`, 'PUT', newTestimonial);
      if (response) {
        dispatch(updateTestimonial(updatedTestimonial)); // Use the updated object instead of response
        toast.success('Testimonial updated successfully!'); // Success toast
        closeModal();
      }
    } catch (error) {
      toast.error('Failed to update testimonial. Please try again.'); // Error toast
      console.error(error);
    }
  };

  const handleDeleteTestimonials = async () => {
    const testimonialsToDelete = selectedTestimonials.map(testimonial => testimonial._id);
    try {
      await Promise.all(
        testimonialsToDelete.map(id => 
          makeRequest(`/testimonials/${id}`, 'DELETE')
        )
      );
      dispatch(deleteTestimonials(testimonialsToDelete)); // Update state after successful deletion
      toast.success('Selected testimonials deleted successfully!'); // Success toast
      setSelectedTestimonials([]);
    } catch (error) {
      toast.error('Failed to delete testimonials. Please try again.'); // Error toast
      console.error(error);
      // Optionally, you might want to re-fetch testimonials or update the state here
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    (testimonial.name && testimonial.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (testimonial.title && testimonial.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (testimonial.description && testimonial.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
   <HomeLayout roles={['admin','blogger']}>
    <div className="mx-4 py-10">
        <Toaster /> {/* Toaster for displaying notifications */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Client Testimonials</h1>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search testimonials..."
              className="border rounded-full py-2 px-4 w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute top-2 right-3 text-gray-500" />
          </div>
          <button
            onClick={openCreateModal}
            className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors duration-300"
          >
            Create New
          </button>
        </div>

        {loading ? (
          <Spinner size="large" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial._id} // Use testimonial ID instead of index for better performance
                className={`bg-white rounded-lg shadow-lg p-6 relative cursor-pointer hover:shadow-xl transition-shadow duration-300 ${selectedTestimonials.includes(testimonial) ? 'border border-blue-500' : ''}`}
                onClick={() => {
                  if (selectedTestimonials.includes(testimonial)) {
                    setSelectedTestimonials(prev => prev.filter(t => t !== testimonial));
                  } else {
                    setSelectedTestimonials(prev => [...prev, testimonial]);
                  }
                }}
              >
                <h2 className="text-xl font-semibold text-blue-900">{testimonial.name}</h2>
                <h3 className="text-gray-600">{testimonial.title}</h3>
                <p className="mt-2 text-gray-800">{testimonial.description}</p>

                {selectedTestimonials.includes(testimonial) && (
                  <button
                    className="absolute top-4 right-4 bg-blue-900 text-white py-1 px-2 rounded hover:bg-blue-800 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(testimonial);
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTestimonials.length > 0 && (
          <div className="fixed bottom-10 right-10">
            <button
              onClick={handleDeleteTestimonials}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300 w-full sm:w-auto"
            >
              Delete Selected Testimonials
            </button>
          </div>
        )}

      {/* Edit Modal */}
      <ReusableModal isOpen={isEditModalOpen} onClose={closeModal}>
        <div className='m-4'>
          <h2 className="text-2xl font-bold text-blue-900">Edit Testimonial</h2>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Name"
              className="border rounded py-2 px-4 w-full mt-2"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))} 
            />
            <input
              type="text"
              placeholder="Title"
              className="border rounded py-2 px-4 w-full mt-2"
              value={newTestimonial.title}
              onChange={(e) => setNewTestimonial(prev => ({ ...prev, title: e.target.value }))} 
            />
            <textarea
              placeholder="Description"
              className="border rounded py-2 px-4 w-full mt-2 resize-none min-h-[100px]"
              value={newTestimonial.description}
              onChange={(e) => setNewTestimonial(prev => ({ ...prev, description: e.target.value }))} 
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handleUpdateTestimonial}
              className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition-colors duration-300"
            >
              Update
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </ReusableModal>

      {/* Create Modal */}
      <ReusableModal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <div className='m-4'>
          <h2 className="text-2xl font-bold text-blue-900">Create New Testimonial</h2>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Name"
              className="border rounded py-2 px-4 w-full mt-2"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))} 
            />
            <input
              type="text"
              placeholder="Title"
              className="border rounded py-2 px-4 w-full mt-2"
              value={newTestimonial.title}
              onChange={(e) => setNewTestimonial(prev => ({ ...prev, title: e.target.value }))} 
            />
            <textarea
              placeholder="Description"
              className="border rounded py-2 px-4 w-full mt-2 resize-none min-h-[100px]"
              value={newTestimonial.description}
              onChange={(e) => setNewTestimonial(prev => ({ ...prev, description: e.target.value }))} 
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handleCreateTestimonial}
              className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-orange-500 transition-colors duration-300"
            >
              Create
            </button>
            <button
              onClick={closeCreateModal}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  </HomeLayout>
  );
};

export default Testimonials;
