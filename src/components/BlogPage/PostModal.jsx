import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'; // Import icons

const commentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required')
});

const PostModal = ({ isOpen, onClose, post }) => {
  const [comments, setComments] = useState(post?.comments || []);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [userLiked, setUserLiked] = useState(post?.userLiked || false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(commentSchema)
  });

  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
      setLikes(post.likes || 0);
      setUserLiked(post.userLiked || false);
    }
  }, [post]);

  const handleLike = async () => {
    try {
      if (userLiked) {
        // Unlike the post
        const updatedLikes = likes - 1;
        await fakeApiUpdateLikes(post.id, updatedLikes);
        setLikes(updatedLikes);
        setUserLiked(false);
        post.likes = updatedLikes; // Update the likes in the post object
        post.userLiked = false; // Update userLiked in the post object
      } else {
        // Like the post
        const updatedLikes = likes + 1;
        await fakeApiUpdateLikes(post.id, updatedLikes);
        setLikes(updatedLikes);
        setUserLiked(true);
        post.likes = updatedLikes; // Update the likes in the post object
        post.userLiked = true; // Update userLiked in the post object
      }
    } catch (error) {
      console.error("Failed to update likes", error);
    }
  };

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;

    const newComment = {
      name: data.name,
      email: data.email,
      message: data.message,
      postTitle: post.title,
      postId: post.id
    };

    try {
      // Mock API call to add a comment
      await fakeApiAddComment(post.id, newComment);
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      post.comments = updatedComments; // Update the comments in the post object

      reset();
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !post) return null;

  const shareUrl = window.location.href;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative flex flex-col h-full max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-[var(--primary-color)]">{post.title}</h2>
            <img src={post.image} alt={post.title} className="w-full h-64 object-cover mb-4 rounded-lg" />
            <p className="mb-4 text-gray-800">{post.description}</p>
            <p className="mb-4 text-gray-600">By {post.author} on {post.date}</p>
            
            <div className="flex items-center mb-4">
              <button
                className={`px-4 py-2 rounded-lg ${userLiked ? 'bg-gray-400' : 'bg-[var(--primary-color)]'} text-white hover:bg-[var(--primary-color)]`}
                onClick={handleLike}
                disabled={false}
              >
                {userLiked ? 'Unlike' : 'Like'} {likes}
              </button>
              
              <div className="ml-4 flex space-x-4">
                <FacebookShareButton url={shareUrl} quote={post.title}>
                  <FaFacebook className="text-blue-600 hover:text-blue-800 w-6 h-6" />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={post.title}>
                  <FaTwitter className="text-blue-400 hover:text-blue-600 w-6 h-6" />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={post.title}>
                  <FaLinkedin className="text-blue-700 hover:text-blue-900 w-6 h-6" />
                </LinkedinShareButton>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
              <h3 className="text-xl font-semibold mb-2 text-[var(--primary-color)]">Comments</h3>
              <div className="mb-4">
                <input
                  {...register('name')}
                  placeholder="Name"
                  className={`border border-gray-300 p-2 w-full rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <input
                  {...register('email')}
                  placeholder="Email"
                  className={`border border-gray-300 p-2 w-full rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <textarea
                  {...register('message')}
                  placeholder="Add a comment..."
                  className={`border border-gray-300 p-2 w-full rounded-lg ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color)]"
              >
                Add Comment
              </button>
            </form>

            <ul className="list-disc pl-5">
              {comments.map((comment, index) => (
                <li key={index} className="mb-2">
                  <strong>{comment.name}:</strong> {comment.message}
                  <br />
                  <small>{comment.email}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock API functions
const fakeApiUpdateLikes = async (postId, updatedLikes) => {
  // Simulate a network request delay
  return new Promise((resolve) => setTimeout(() => resolve({ postId, updatedLikes }), 1000));
};

const fakeApiAddComment = async (postId, comment) => {
  // Simulate a network request delay
  return new Promise((resolve) => setTimeout(() => resolve({ postId, comment }), 1000));
};

export default PostModal;
