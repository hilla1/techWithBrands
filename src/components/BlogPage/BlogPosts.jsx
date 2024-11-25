import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BlogCard from '../../components/reusable/BlogCard';
import Wrapper from '../../components/reusable/Wrapper';
import { useInView } from 'react-intersection-observer';
import ReusableModal from '../../components/BlogPage/PostModal';
import { debounce } from 'lodash';
import useApiRequest from '../../hooks/useApiRequest'; // Use your custom hook to fetch data

const BlogPosts = () => {
  const { data: articles, loading, error, makeRequest } = useApiRequest();
  const [posts, setPosts] = useState([]); // All posts from API
  const [displayedPosts, setDisplayedPosts] = useState([]); // Posts displayed on screen
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalPost, setModalPost] = useState(null);
  const { ref, inView } = useInView();
  const [visibleCount, setVisibleCount] = useState(6); // Control how many posts to show initially

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPosts = await makeRequest('/articles'); // Call your API
        setPosts(fetchedPosts); // Store all fetched posts
        setDisplayedPosts(fetchedPosts.slice(0, visibleCount)); // Initialize with the first few posts
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchData();
  }, [makeRequest]);

  // Filter posts based on category and search query
  const filterPosts = useCallback(() => {
    let filteredPosts = posts;

    if (selectedCategory !== 'All') {
      filteredPosts = filteredPosts.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredPosts;
  }, [selectedCategory, searchQuery, posts]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView) {
      setVisibleCount((prev) => prev + 6); // Load 6 more posts when the user scrolls into view
    }
  }, [inView]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setDisplayedPosts(filterPosts().slice(0, visibleCount)); // Re-filter and limit the displayed posts
  };

  // Handle search input change with debounce
  const handleSearchChange = debounce((event) => {
    setSearchQuery(event.target.value);
    setDisplayedPosts(filterPosts().slice(0, visibleCount));
  }, 300);

  // Show the modal for detailed view
  const handleReadMoreClick = (post) => {
    setModalPost(post);
  };

  // Update displayed posts when posts, category, or search query changes
  useEffect(() => {
    setDisplayedPosts(filterPosts().slice(0, visibleCount));
  }, [filterPosts, visibleCount]);

  // Memoized category buttons
  const categoryButtons = useMemo(
    () =>
      [...new Set(posts.map((post) => post.category))].map((category) => (
        <button
          key={category}
          className={`px-4 py-2 mx-2 ${
            selectedCategory === category
              ? 'bg-[var(--primary-color)] text-white'
              : 'bg-white text-[var(--primary-color)]'
          } border border-[var(--primary-color)] rounded-lg`}
          onClick={() => handleCategoryChange(category)}
        >
          {category}
        </button>
      )),
    [posts, selectedCategory]
  );

  return (
    <Wrapper>
      <div className="mt-16 min-h-screen">
        {/* Categories and Search Bar */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--primary-color)] mb-4">Blog Posts</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-lg w-full max-w-md mx-auto"
            />
          </div>
          <div className="flex flex-wrap justify-center mb-4">
            <button
              className={`px-4 py-2 mx-2 ${
                selectedCategory === 'All' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)]'
              } border border-[var(--primary-color)] rounded-lg`}
              onClick={() => handleCategoryChange('All')}
            >
              All
            </button>
            {categoryButtons}
          </div>
        </div>

        {/* Display Blog Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post, index) => (
              <BlogCard
                key={index}
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={new Date(post.createdAt).toLocaleDateString()}
                onReadMore={() => handleReadMoreClick(post)}
              />
            ))
          ) : (
            !loading && <p className="text-center py-4">No posts found.</p>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && <p className="text-center py-4">Loading...</p>}
        {error && <p className="text-center py-4 text-red-500">Error loading articles.</p>}

        {/* Infinite scroll trigger */}
        <div ref={ref} className="text-center py-4" />

        {/* Modal for Detailed Post View */}
        <ReusableModal isOpen={!!modalPost} onClose={() => setModalPost(null)} post={modalPost} />
      </div>
    </Wrapper>
  );
};

export default BlogPosts;
