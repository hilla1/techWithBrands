// src/components/Solutions/EditSolutionModal.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { editSolution } from '../../redux/slices/solutionsSlice';
import PhotoUploadSection from '../reusable/PhotoUploadSection';
import useApiRequest from '../../hooks/useApiRequest';

const EditSolutionModal = ({ isOpen, onClose, onSubmit, solution }) => {
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
  const dispatch = useDispatch();
  const { makeRequest, loading, error } = useApiRequest();

  useEffect(() => {
    if (solution) {
      setFormData({
        title: solution.title,
        description: solution.description,
        category: solution.category,
        images: solution.images || [''],
        cta: {
          text: solution.cta.text,
          href: solution.cta.href
        }
      });
    }
  }, [solution]);

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
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await makeRequest(`/solutions/${solution._id}`, 'PUT', formData);
      dispatch(editSolution({ ...solution, ...formData }));
      onClose();
    } catch (err) {
      console.error('Failed to edit solution:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <h2 className="text-xl font-bold mb-4">Edit Solution</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Solution Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
          <textarea
            name="description"
            placeholder="Solution Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
          {formData.images.map((image, index) => (
            <div key={index} className="mb-4">
              <PhotoUploadSection
                label={`Image ${index + 1}`}
                currentPhoto={image}
                onPhotoUpdate={(url) => handlePhotoUpdate(url, index)}
              />
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
          {formData.images.length < 5 && (
            <button type="button" onClick={handleAddImageField} className="ml-2 text-blue-900 hover:text-orange-500">
              <FaPlus />
            </button>
          )}
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
          <div className="flex justify-end">
            <button type="button" className="bg-gray-300 p-2 rounded-md mr-2" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-900 text-white p-2 rounded-md hover:bg-orange-500" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditSolutionModal;
