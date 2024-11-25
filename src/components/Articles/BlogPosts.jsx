import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BlogCard from './BlogCard';
import { useInView } from 'react-intersection-observer';
import PostModal from './PostModal'; 
import CreatePostModal from './CreatePostModal'; 
import { debounce } from 'lodash';
import useApiRequest from '../../hooks/useApiRequest';

const BlogPosts = () => {
  const { data: fetchedPosts, loading, error, makeRequest } = useApiRequest();
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalPost, setModalPost] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
  const { ref, inView } = useInView();

  // Fetch posts from server
  const fetchPosts = useCallback(async () => {
    try {
      const response = await makeRequest('/articles', 'GET');
      setPosts(response);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }, [makeRequest]);

  // Filter posts
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

  // Load more posts (pagination or infinite scroll logic)
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    const start = posts.length;
    const limit = 6;
    const newPosts = fetchedPosts.slice(start, start + limit);
    if (newPosts.length > 0) {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    } else {
      setHasMore(false);
    }
  }, [loading, hasMore, posts, fetchedPosts]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setDisplayedPosts(filterPosts(posts));
  };

  // Handle search change with debounce
  const handleSearchChange = debounce((event) => {
    setSearchQuery(event.target.value);
    setDisplayedPosts(filterPosts(posts));
  }, 300);

  // Display post in modal
  const handleReadMoreClick = (post) => {
    setModalPost(post); // Passing post object with ID for editing
  };

  // Select or deselect a post
  const handleSelectPost = (post) => {
    setSelectedPosts((prevSelected) => {
      if (prevSelected.includes(post)) {
        return prevSelected.filter((p) => p !== post);
      } else {
        return [...prevSelected, post];
      }
    });
  };

  // Delete selected posts
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedPosts.map((post) => makeRequest(`/articles/${post._id}`, 'DELETE'))
      );
      setPosts((prevPosts) => prevPosts.filter(post => !selectedPosts.includes(post)));
      setSelectedPosts([]);
    } catch (err) {
      console.error('Error deleting posts:', err);
    }
  };

  // Handle creation of a new post
  const handlePostCreate = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Handle updating a post (from PostModal)
  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  // Initialize posts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Load more posts on scroll
  useEffect(() => {
    if (inView) {
      loadMorePosts();
    }
  }, [inView, loadMorePosts]);

  // Update displayed posts when `posts` change
  useEffect(() => {
    setDisplayedPosts(filterPosts(posts));
  }, [posts, filterPosts]);

  // Memoized category buttons
  const categoryButtons = useMemo(() => {
    const categories = [...new Set(posts.map(post => post.category))];
    return categories.map(category => (
      <button
        key={category}
        className={`px-4 py-2 mx-2 ${selectedCategory === category ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)]'} border border-[var(--primary-color)] rounded-lg`}
        onClick={() => handleCategoryChange(category)}
      >
        {category}
      </button>
    ));
  }, [posts, selectedCategory, handleCategoryChange]);

  return (
    <div className="mt-4 min-h-screen px-4">
      {/* Header with Create Post and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 relative">
        <h1 className="text-4xl font-bold text-center w-full text-[var(--primary-color)]">
          Blog Posts
        </h1>
        <button
          className="mt-4 sm:mt-0 bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)]"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create
        </button>
      </div>

      {/* Search Bar */}
      <div className="text-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 rounded-lg w-full max-w-md mx-auto"
        />
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center mb-4">
        <button
          className={`px-4 py-2 mx-2 ${selectedCategory === 'All' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)]'} border border-[var(--primary-color)] rounded-lg`}
          onClick={() => handleCategoryChange('All')}
        >
          All
        </button>
        {categoryButtons}
      </div>

      {/* Delete Button for selected posts */}
      {selectedPosts.length > 0 && (
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
             >
             Delete Selected Posts
            </button>
          </div>
        )}
 

      {/* Display Blog Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedPosts.length > 0 ? (
          displayedPosts.map((post) => (
            <BlogCard
              key={post._id} // Use _id as key
              id={post._id}  // Pass post ID to BlogCard for editing purposes
              image={post.image}
              category={post.category}
              title={post.title}
              description={post.description}
              author={post.author}
              date={new Date(post.createdAt).toLocaleDateString()} 
              onReadMore={() => handleReadMoreClick(post)}
              onSelect={() => handleSelectPost(post)}
              isSelected={selectedPosts.includes(post)}
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
      <PostModal
        isOpen={!!modalPost}
        onClose={() => setModalPost(null)}
        post={modalPost}
        onPostUpdate={handlePostUpdate}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreate={handlePostCreate}
      />
    </div>
  );
};

export default BlogPosts;
