import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSolutions, addSolution, editSolution, deleteSolution } from '../redux/slices/solutionsSlice';
import HomeLayout from '../components/HomePage/HomeLayout';
import SolutionCard from '../components/Solutions/SolutionCard';
import CreateSolutionModal from '../components/Solutions/CreateSolutionModal';
import EditSolutionModal from '../components/Solutions/EditSolutionModal';
import useApiRequest from '../hooks/useApiRequest';

const Solutions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSolutions, setSelectedSolutions] = useState([]);
  const [solutionToEdit, setSolutionToEdit] = useState(null);
  const { makeRequest } = useApiRequest();
  const dispatch = useDispatch();

  const { solutions } = useSelector((state) => state.solutions);

  // Fetch solutions on component mount
  const fetchSolutions = async () => {
    try {
      const fetchedSolutions = await makeRequest('/solutions');
      dispatch(setSolutions(fetchedSolutions));
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [dispatch, makeRequest]);

  // Handle creating a new solution
  const handleCreateSolution = async (solutionData) => {
    try {
      const newSolution = await makeRequest('/solutions', 'POST', solutionData);
      dispatch(addSolution(newSolution)); // Dispatch to update the state
      setIsCreateModalOpen(false); // Close modal after success
      fetchSolutions(); // Refetch solutions after creating
    } catch (error) {
      console.error('Error creating solution:', error);
    }
  };

  // Handle editing an existing solution
  const handleEditSolution = async (solutionData) => {
    try {
      const updatedSolution = await makeRequest(`/solutions/${solutionToEdit?._id}`, 'PUT', solutionData);
      dispatch(editSolution(updatedSolution)); // Dispatch to update the state
      setSolutionToEdit(null); // Clear the edit target
      setIsEditModalOpen(false); // Close modal after success
      fetchSolutions(); // Refetch solutions after editing
    } catch (error) {
      console.error('Error updating solution:', error);
    }
  };

  // Handle solution selection for deletion
  const handleSolutionSelect = (solutionId) => {
    setSelectedSolutions((prev) =>
      prev.includes(solutionId) ? prev.filter((id) => id !== solutionId) : [...prev, solutionId]
    );
  };

  // Handle deleting selected solutions
  const handleDeleteSelected = async () => {
    if (selectedSolutions.length === 0) return;

    try {
      await Promise.all(selectedSolutions.map((id) => makeRequest(`/solutions/${id}`, 'DELETE')));
      selectedSolutions.forEach((id) => dispatch(deleteSolution(id))); // Dispatch to update the state
      setSelectedSolutions([]); // Clear selected solutions
      fetchSolutions(); // Refetch solutions after deletion
    } catch (error) {
      console.error('Error deleting solutions:', error);
    }
  };

  // Get unique categories from the solutions
  const categories = ['All', ...new Set(solutions.map((solution) => solution.category))];

  // Filter solutions based on search term and selected category
  const filteredSolutions = solutions
    .filter((solution) =>
      (solution.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.description?.toLowerCase().includes(searchTerm.toLowerCase())) // Use optional chaining
    )
    .filter((solution) => selectedCategory === 'All' || solution.category === selectedCategory);

  return (
    <HomeLayout roles={['admin']}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--primary-color)]">Solutions Marketplace</h1>
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded-lg"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Solution
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search solutions..."
              className="border p-2 w-full rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <select
              className="border p-2 rounded-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSolutions.map((solution) => (
              <SolutionCard
                key={solution._id}
                images={solution.images}
                title={solution.title}
                description={solution.description}
                cta={solution.cta}
                onSelect={() => handleSolutionSelect(solution._id)}
                isSelected={selectedSolutions.includes(solution._id)}
                onEdit={() => {
                  setSolutionToEdit(solution);
                  setIsEditModalOpen(true);
                }}
              />
            ))}
          </div>

          {selectedSolutions.length > 0 && (
            <div className="fixed bottom-4 right-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Create and Edit Modals */}
        <CreateSolutionModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            fetchSolutions(); // Refetch solutions when closing
          }}
          onSubmit={handleCreateSolution} // Pass the onSubmit prop
        />
        <EditSolutionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSolution} // Pass the onSubmit prop
          solution={solutionToEdit} // Pass the solution to edit
        />
    </HomeLayout>
  );
};

export default Solutions;
