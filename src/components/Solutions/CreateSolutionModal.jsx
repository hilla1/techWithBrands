// src/components/modals/CreateSolutionModal.js
import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa'; 
import { useDispatch } from 'react-redux'; 
import { addSolution } from '../../redux/slices/solutionsSlice'; 
import PhotoUploadSection from '../reusable/PhotoUploadSection'; 
import useApiRequest from '../../hooks/useApiRequest'; 

const CreateSolutionModal = ({ isOpen, onClose }) => {
  const initialFormData = {
    title: '',
    description: '',
    category: '',
    images: [''], 
    cta: {
      text: '',
      href: ''
    }
  };

  const [formData, setFormData] = useState(initialFormData);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const dispatch = useDispatch();
  const { makeRequest, loading, error } = useApiRequest();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("cta.")) {
      setFormData((prev) => ({
        ...prev,
        cta: {
          ...prev.cta,
          [name.split('.')[1]]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoUpdate = (url, index) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData((prev) => ({
      ...prev,
      images: newImages
    }));
  };

  const handleAddImageField = () => {
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, '']
    }));
  };

  const handleRemoveImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: newImages
    }));
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSuccessMessage(''); // Clear success message on cancel
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newSolution = await makeRequest('/solutions', 'POST', formData);
      
      if (newSolution) {
        dispatch(addSolution(newSolution));
        setSuccessMessage('Created successfully!'); // Set success message
        setFormData(initialFormData);
        
        // Close the modal after a short delay
        setTimeout(() => {
          setSuccessMessage(''); // Clear success message before closing
          onClose();
        }, 2000); // 2 seconds delay before closing
      }
    } catch (err) {
      console.error('Failed to create solution:', err);
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <h2 className="text-xl font-bold mb-4">Create Solution</h2>
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <input
            type="text"
            name="title"
            placeholder="Solution Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
          {/* Description Input */}
          <textarea
            name="description"
            placeholder="Solution Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
          {/* Category Input */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
          {/* Image Uploads */}
          {formData.images.map((image, index) => (
            <div key={index} className="mb-4">
              <PhotoUploadSection
                label={`Image ${index + 1}`}
                currentPhoto={image}
                onPhotoUpdate={(url) => handlePhotoUpdate(url, index)}
              />
              {/* Remove Image Button */}
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveImageField(index)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  <FaMinus />
                </button>
              )}
            </div>
          ))}
          {/* Add Image Button */}
          {formData.images.length < 5 && (
            <button type="button" onClick={handleAddImageField} className="ml-2 text-blue-900 hover:text-orange-500">
              <FaPlus />
            </button>
          )}
          {/* Call-to-action Inputs */}
          <input
            type="text"
            name="cta.text"
            placeholder="Call-to-action Text"
            value={formData.cta.text}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
          <input
            type="text"
            name="cta.href"
            placeholder="Call-to-action Link"
            value={formData.cta.href}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
          {/* Action Buttons */}
          <div className="flex justify-end">
            <button type="button" className="bg-gray-300 p-2 rounded-md mr-2" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-900 text-white p-2 rounded-md hover:bg-orange-500" disabled={loading}>
              {loading ? 'Saving...' : 'Save Solution'}
            </button>
          </div>
          {/* Error Message Display */}
          {error && <p className="text-red-500 mt-2">{error}</p>} {/* Show error if exists */}
          {/* Success Message Display */}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>} {/* Show success message */}
        </form>
      </div>
    </div>
  );
};

export default CreateSolutionModal;
