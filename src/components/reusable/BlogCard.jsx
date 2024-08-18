import React from 'react';

// Card component to display each blog post
const BlogCard = ({ image, category, title, description, author, date, onReadMore }) => {
  // Function to trim text
  const trimText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105 mb-4 w-full">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <p className="text-sm text-[var(--secondary-color)] font-semibold mb-2">{category}</p>
        <h3 className="text-xl font-bold text-center text-[var(--primary-color)] mb-2">
          {trimText(title, 50)}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Posted by {author} on {date}
        </p>
        <p className="text-gray-700 mb-4">
          {trimText(description, 100)}
        </p>
        <button
          onClick={() => onReadMore({ image, category, title, description, author, date })}
          className="bg-[var(--secondary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-color)] w-full"
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
