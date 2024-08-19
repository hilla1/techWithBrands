import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../reusable/Wrapper'; 
import BlogCard from '../reusable/BlogCard'; 
import PostModal from '../../components/BlogPage/PostModal'; 
import blogPosts from '/src/assets/data/blogPosts.json'; 

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(blogPosts.slice(0, 4)); // Show only the first 4 posts
  }, []);

  const handleReadMoreClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleNavigateToBlog = () => {
    navigate('/blog'); // Navigate to the blog page
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top smoothly
  };

  return (
    <div className="bg-gray-200">
      <Wrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--primary-color)] mb-4">From Our Blog</h1>
        </div>
        <div className="flex flex-wrap -mx-4">
          {posts.map((post, index) => (
            <div className="w-full md:w-1/4 px-4 mb-4" key={index}>
              <BlogCard
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={post.date}
                onReadMore={() => handleReadMoreClick(post)} // Pass the post to the handler
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            className="bg-[var(--secondary-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-color)]"
            onClick={handleNavigateToBlog} // Use the handler function
          >
            Read More Articles
          </button>
        </div>
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
