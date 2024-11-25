import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const SaveChangesButton = ({ onClick, loading, error, unsavedChanges }) => {
  const truncateError = (errorMessage) => {
    const maxLength = 20; // Set a maximum length for truncation
    return errorMessage.length > maxLength ? `${errorMessage.substring(0, maxLength)}...` : errorMessage;
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={loading}
        className={`w-full py-2 px-4 text-white rounded ${
          loading ? 'bg-gray-400' : unsavedChanges ? 'bg-orange-400 hover:bg-orange-500' : 'bg-blue-900 hover:bg-blue-950'
        }`}
        style={{ position: 'fixed', bottom: '20px', right: '20px', width: '200px' }} // Position button at bottom right
      >
        {loading ? (
          <div className="flex justify-center items-center" style={{ height: '100%' }}>
            <ClipLoader size={24} color={"#FFFFFF"} />
          </div>
        ) : unsavedChanges ? (
          'Changes not saved'
        ) : (
          'Changes Saved'
        )}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-right">
          {truncateError(error)} {/* Display truncated error message */}
        </p>
      )}
    </div>
  );
};

export default SaveChangesButton;
