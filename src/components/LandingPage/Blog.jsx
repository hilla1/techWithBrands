import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../reusable/Wrapper';
import BlogCard from '../reusable/BlogCard';
import PostModal from '../../components/BlogPage/PostModal';
import useApi from '../../hooks/useApi';

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { useApiQuery } = useApi();

  // Use React Query to fetch posts
  const {
    data: posts = [], // default to empty array
    isLoading,
    isError,
    error,
  } = useApiQuery('/articles');

  // Limit to first 4 posts
  const displayedPosts = posts.slice(0, 4);

  const handleReadMoreClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleNavigateToBlog = () => {
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-200">
      <Wrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--primary-color)] mb-4">From Our Blog</h1>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center text-lg text-gray-700">Loading...</div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center text-red-500">
            Error fetching posts: {error?.message || 'Something went wrong.'}
          </div>
        )}

        {/* Blog posts */}
        {!isLoading && !isError && (
          <div className="flex flex-wrap -mx-4">
            {displayedPosts.map((post, index) => (
              <div className="w-full md:w-1/4 px-4 mb-4" key={index}>
                <BlogCard
                  image={post.image}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  author={post.author}
                  date={new Date(post.createdAt).toLocaleDateString()}
                  onReadMore={() => handleReadMoreClick(post)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Button to navigate to full blog */}
        <div className="text-center mt-12">
          <button
            className="bg-[var(--secondary-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-color)]"
            onClick={handleNavigateToBlog}
          >
            Read More Articles
          </button>
        </div>

        {/* Modal view */}
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
