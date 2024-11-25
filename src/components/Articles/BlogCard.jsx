import React from 'react';

// Card component to display each blog post
const BlogCard = ({ image, category, title, description, author, date, onReadMore, isSelected, onSelect }) => {
  // Function to trim text
  const trimText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
    <div
      onClick={onSelect} // Select card when clicked
      className={`relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105 mb-4 w-full cursor-pointer ${isSelected ? 'border-[var(--primary-color)]' : ''}`}
    >
      {/* Show small round checkbox on hover or when selected */}
      <div
        className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-opacity duration-300 ${
          isSelected || 'hover:opacity-100 opacity-0'
        } ${isSelected ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white' : 'border-gray-300 bg-white'}`}
      >
        {isSelected && <span className="text-sm font-bold">✔</span>}
      </div>

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
          onClick={(e) => {
            e.stopPropagation(); // Prevent selecting card when clicking the button
            onReadMore({ image, category, title, description, author, date });
          }}
          className="bg-[var(--secondary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-color)] w-full"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
