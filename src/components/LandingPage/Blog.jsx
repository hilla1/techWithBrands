import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../reusable/Wrapper';
import BlogCard from '../reusable/BlogCard';
import PostModal from '../../components/BlogPage/PostModal';
import useApiRequest from '../../hooks/useApiRequest'; 

const Blog = () => {
  const [posts, setPosts] = useState([]); // All posts
  const [selectedPost, setSelectedPost] = useState(null); // Selected post for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const navigate = useNavigate(); // Router navigation hook

  const { data: fetchedPosts, loading, error, makeRequest } = useApiRequest();

  // Fetch posts from server
  const fetchPosts = useCallback(async () => {
    try {
      const response = await makeRequest('/articles', 'GET');
      // Limit the number of posts to 4
      setPosts(response.slice(0, 4));
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }, [makeRequest]);

  // Effect to fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle "Read More" click to open modal with selected post
  const handleReadMoreClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Navigate to the full blog page
  const handleNavigateToBlog = () => {
    navigate('/blog'); // Navigate to the blog page
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top
  };

  return (
    <div className="bg-gray-200">
      <Wrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--primary-color)] mb-4">From Our Blog</h1>
        </div>

        {/* Show loading state while fetching */}
        {loading && <p>Loading...</p>}
        
        {/* Handle API Error */}
        {error && <p>Error fetching posts: {error.message}</p>}

        {/* Display Blog Posts */}
        {!loading && !error && (
          <div className="flex flex-wrap -mx-4">
            {posts.map((post, index) => (
              <div className="w-full md:w-1/4 px-4 mb-4" key={index}>
                <BlogCard
                  image={post.image}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  author={post.author}
                  date={new Date(post.createdAt).toLocaleDateString()} // Use createdAt for date
                  onReadMore={() => handleReadMoreClick(post)} 
                />
              </div>
            ))}
          </div>
        )}

        {/* Button to navigate to all blog posts */}
        <div className="text-center mt-12">
          <button
            className="bg-[var(--secondary-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-color)]"
            onClick={handleNavigateToBlog}
          >
            Read More Articles
          </button>
        </div>

        {/* Post Modal for detailed view */}
        {isModalOpen && selectedPost && (
          <PostModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            post={selectedPost}
          />
        )}
      </Wrapper>
    </div>
  );
};

export default Blog;
