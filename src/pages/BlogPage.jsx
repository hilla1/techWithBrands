import React from 'react';
import Navbar from '../components/reusable/Navbar';
import Footer from '../components/reusable/Footer';
import BlogPosts from '../components/BlogPage/BlogPosts';
 

const BlogPage = () => {
  return (
    <>
      <Navbar />
      <BlogPosts/>
      <Footer />
    </>
  );
};

export default BlogPage;