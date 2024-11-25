import React from 'react';
import BlogPosts from '../components/Articles/BlogPosts';
import HomeLayout from '../components/HomePage/HomeLayout';

const Articles = () => {
  return (
      <HomeLayout roles={['admin']}>
       <BlogPosts/>
       </HomeLayout>
  );
};

export default Articles;