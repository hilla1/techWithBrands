import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BlogCard from '../../components/reusable/BlogCard';
import Wrapper from '../../components/reusable/Wrapper';
import { useInView } from 'react-intersection-observer';
import ReusableModal from '../../components/BlogPage/PostModal';
import { debounce } from 'lodash';
import blogPosts from '/src/assets/data/blogPosts.json'; // Import the JSON data

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalPost, setModalPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  // Fetch and filter posts based on category and search query
  const filterPosts = useCallback(
    (allPosts) => {
      let filteredPosts = allPosts;

      if (selectedCategory !== 'All') {
        filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
      }

      if (searchQuery) {
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return filteredPosts;
    },
    [selectedCategory, searchQuery]
  );

  // Load more posts when user scrolls
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const start = posts.length;
    const limit = 6;
    const newPosts = blogPosts.slice(start, start + limit); // Load posts from the JSON data
    if (newPosts.length > 0) {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, posts]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setDisplayedPosts(filterPosts(posts));
  };

  // Handle search input change with debounce
  const handleSearchChange = debounce((event) => {
    setSearchQuery(event.target.value);
    setDisplayedPosts(filterPosts(posts));
  }, 300);

  // Display post in modal
  const handleReadMoreClick = (post) => {
    setModalPost(post);
  };

  // Initialize posts from the imported JSON data
  useEffect(() => {
    const initialPosts = blogPosts.slice(0, 6); // Load the initial posts
    setPosts(initialPosts);
    setDisplayedPosts(initialPosts);
  }, []);

  // Load more posts when user scrolls into view
  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView, loadMorePosts]);

  // Update displayed posts when `posts` changes
  useEffect(() => {
    setDisplayedPosts(filterPosts(posts));
  }, [posts, filterPosts]);

  // Memoized category buttons
  const categoryButtons = useMemo(() => (
    [...new Set(posts.map(post => post.category))].map(category => (
      <button
        key={category}
        className={`px-4 py-2 mx-2 ${selectedCategory === category ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)]'} border border-[var(--primary-color)] rounded-lg`}
        onClick={() => handleCategoryChange(category)}
      >
        {category}
      </button>
    ))
  ), [posts, selectedCategory]);

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
              className={`px-4 py-2 mx-2 ${selectedCategory === 'All' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)]'} border border-[var(--primary-color)] rounded-lg`}
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
                date={post.date}
                onReadMore={() => handleReadMoreClick(post)}
              />
            ))
          ) : (
            !loading && <p className="text-center py-4">No posts found.</p>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && <p className="text-center py-4">Loading...</p>}

        {/* Intersection Observer for infinite scroll */}
        <div ref={ref} className="text-center py-4" />

        {/* Modal for Detailed Post View */}
        <ReusableModal
          isOpen={!!modalPost}
          onClose={() => setModalPost(null)}
          post={modalPost}
        />
      </div>
    </Wrapper>
  );
};

export default BlogPosts;
