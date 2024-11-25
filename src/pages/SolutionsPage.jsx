import React, { useEffect, useState } from 'react';
import Wrapper from '../components/reusable/Wrapper';
import SolutionCard from '../components/Solutions/SolutionCard';
import useApiRequest from '../hooks/useApiRequest';
import Navbar from '../components/reusable/Navbar';
import Footer from '../components/reusable/Footer';

const SolutionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [solutions, setSolutions] = useState([]); // Local state for solutions
  const [loading, setLoading] = useState(true); // Local loading state
  const { makeRequest } = useApiRequest();

  // Fetch solutions on component mount
  const fetchSolutions = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const fetchedSolutions = await makeRequest('/solutions');
      setSolutions(fetchedSolutions); // Set the solutions to local state
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [makeRequest]);

  // Get unique categories from the solutions
  const categories = ['All', ...new Set(solutions.map((solution) => solution.category))];

  // Filter solutions based on search term and selected category
  const filteredSolutions = solutions
    .filter((solution) =>
      (solution.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((solution) => selectedCategory === 'All' || solution.category === selectedCategory);

  return (
    <>
      <Navbar />
      <Wrapper>
        <div className="p-4 mt-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--primary-color)]">Solutions Marketplace</h1>
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

          {/* Spinner while loading */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              {/* Gradient Spinner */}
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredSolutions.map((solution) => (
                <SolutionCard
                  key={solution._id}
                  images={solution.images}
                  title={solution.title}
                  description={solution.description}
                  cta={solution.cta}
                  onSelect={() => {}} // Disable selection since no actions are allowed
                  isSelected={false} // No selection allowed
                />
              ))}
            </div>
          )}
        </div>
      </Wrapper>
      <Footer />

      {/* Spinner CSS */}
      <style jsx>{`
        .loader {
          border: 8px solid transparent; /* Transparent border for the spinner */
          border-top: 8px solid #1e3a8a; /* Blue color */
          border-right: 8px solid #f97316; /* Orange color */
          border-radius: 50%; /* Circular shape */
          width: 50px; /* Width of the spinner */
          height: 50px; /* Height of the spinner */
          animation: spin 1s linear infinite; /* Spin animation */
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg); /* Start at 0 degrees */
          }
          100% {
            transform: rotate(360deg); /* Complete a full rotation */
          }
        }
      `}</style>
    </>
  );
};

export default SolutionsPage;
