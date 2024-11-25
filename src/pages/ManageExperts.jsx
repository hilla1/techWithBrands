import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import the lens icon
import ExpertList from '../components/ManageExperts/ExpertList';
import ExpertModal from '../components/ManageExperts/ExpertModal';
import ConfirmDeleteModal from '../components/ManageExperts/ConfirmDeleteModal';
import useApiRequest from '../hooks/useApiRequest';
import HomeLayout from '../components/HomePage/HomeLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useInView } from 'react-intersection-observer';

const ManageExperts = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [expertToDelete, setExpertToDelete] = useState(null);
  const [formData, setFormData] = useState({ email: '', skillSet: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const [displayCount, setDisplayCount] = useState(20);
  const increment = 20;

  const { data, loading, error, makeRequest } = useApiRequest();
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expertsResponse = await makeRequest('/experts');
        setExperts(expertsResponse);
        setFilteredExperts(expertsResponse); // Set filteredExperts initially to all experts
        const usersResponse = await makeRequest('/users?role=consultant,freelancer,admin,blogger');
        setUsers(usersResponse);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to fetch data. Please try again.');
      }
    };
    fetchData();
  }, [makeRequest]);

  useEffect(() => {
    if (inView && displayCount < filteredExperts.length) {
      setDisplayCount((prev) => Math.min(prev + increment, filteredExperts.length));
    }
  }, [inView, displayCount, filteredExperts.length]);

  useEffect(() => {
    // Filter experts based on search term
    if (searchTerm) {
      setFilteredExperts(
        experts.filter((expert) =>
          expert.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredExperts(experts);
    }
  }, [searchTerm, experts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedExpert) {
        await makeRequest(`/experts/${selectedExpert._id}`, 'PUT', formData);
        toast.success('Expert updated successfully!');
      } else {
        await makeRequest('/experts', 'POST', formData);
        toast.success('Expert created successfully!');
      }
      closeModal();
      await refreshExperts();
    } catch (err) {
      console.error('Error submitting expert:', err);
      toast.error('Failed to submit expert. Please try again.');
    }
  };

  const handleDelete = (expert) => {
    setExpertToDelete(expert);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!expertToDelete) return;
    try {
      await makeRequest(`/experts/${expertToDelete._id}`, 'DELETE');
      toast.success('Expert deleted successfully!');
      setIsConfirmOpen(false);
      setExpertToDelete(null);
      await refreshExperts();
    } catch (err) {
      console.error('Error deleting expert:', err);
      toast.error('Failed to delete expert. Please try again.');
    }
  };

  const openEditModal = (expert) => {
    setSelectedExpert(expert);
    setFormData({ email: expert.email, skillSet: expert.skillSet.join(', ') });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedExpert(null);
    setFormData({ email: '', skillSet: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpert(null);
    setFormData({ email: '', skillSet: '' });
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setExpertToDelete(null);
  };

  const refreshExperts = async () => {
    const expertsResponse = await makeRequest('/experts');
    setExperts(expertsResponse);
    setFilteredExperts(expertsResponse); // Reset filtered experts on refresh
  };

  return (
    <HomeLayout roles={['admin']}>
        <ToastContainer />
        <div className="my-4 text-center">
          <h1 className="md:text-3xl text-3xl text-blue-900 font-bold mb-4">Manage Experts</h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <button
              onClick={openCreateModal}
              className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hover:bg-opacity-90 mb-4 md:mb-0 md:mr-4"
            >
              Create Expert
            </button>
            <div className="relative md:w-1/2">
              <input
                type="text"
                placeholder="Search by email..."
                className="border rounded p-2 w-full focus:border-blue-900 focus:outline-none pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" /> {/* Search icon */}
            </div>
          </div>
        </div>

        <ExpertList
          experts={filteredExperts}
          displayedExperts={filteredExperts.slice(0, displayCount)}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
          loading={loading}
        />
        <div ref={ref} className="h-10"></div>

        <ExpertModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          users={users}
        />

        <ConfirmDeleteModal
          isOpen={isConfirmOpen}
          closeConfirm={closeConfirm}
          expertToDelete={expertToDelete}
          confirmDelete={confirmDelete}
        />
    </HomeLayout>
  );
};

export default ManageExperts;
