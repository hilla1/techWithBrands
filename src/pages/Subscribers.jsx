// src/pages/Subscribers.jsx
import React, { useState, useRef } from 'react';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEnvelope,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
} from 'react-icons/fa';
import HomeLayout from '../components/HomePage/HomeLayout';
import ReusableModal from '../components/reusable/ReusableModal';
import { ClipLoader } from 'react-spinners';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import debounce from 'lodash/debounce';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import useApiRequest from '../hooks/useApiRequest';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Zod Schemas for Form Validation
const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

const massEmailSchema = z.object({
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
  mediaUrls: z.array(z.string().url({ message: 'Invalid URL' })).optional(),
});

const Subscribers = () => {
  const { makeRequest } = useApiRequest();
  const queryClient = useQueryClient();

  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const subscribersPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMassEmailModalOpen, setIsMassEmailModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState(null);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const longPressTimeout = useRef(null);
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch Subscribers using React Query with useApiRequest
  const { data: subscribers = [], isLoading: isQueryLoading, error } = useQuery({
    queryKey: ['subscribers', currentPage, searchQuery],
    queryFn: async () => {
      setLoading(true); // Set loading state on fetch
      try {
        const response = await makeRequest('/subscribe', 'GET');
        return Array.isArray(response) ? response : response.subscribers || [];
      } finally {
        setLoading(false); // Reset loading state regardless of success or error
      }
    },
    onError: () => {
      toast.error('Failed to fetch subscribers.');
    }
  });

  // Mutations
  const addSubscriber = useMutation({
    mutationFn: async (data) => {
      setLoading(true); // Set loading state during mutation
      try {
        await makeRequest('/subscribe', 'POST', { email: data.email });
      } finally {
        setLoading(false); // Reset loading state regardless of success or error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers']);
      setIsAddModalOpen(false);
      toast.success('Subscriber added successfully!');
    },
    onError: () => {
      toast.error('Failed to add subscriber.');
    }
  });

  const updateSubscriber = useMutation({
    mutationFn: async (data) => {
      setLoading(true); // Set loading state during mutation
      try {
        await makeRequest(`/subscribe/${currentSubscriber._id}`, 'PUT', { email: data.email });
      } finally {
        setLoading(false); // Reset loading state regardless of success or error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers']);
      setIsUpdateModalOpen(false);
      setCurrentSubscriber(null);
      toast.success('Subscriber updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update subscriber.');
    }
  });

  const deleteSubscriber = useMutation({
    mutationFn: async () => {
      setLoading(true); // Set loading state during mutation
      try {
        await makeRequest(`/subscribe/${currentSubscriber._id}`, 'DELETE');
      } finally {
        setLoading(false); // Reset loading state regardless of success or error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers']);
      setIsDeleteModalOpen(false);
      setCurrentSubscriber(null);
      toast.success('Subscriber deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete subscriber.');
    }
  });

  const bulkDeleteSubscribers = useMutation({
    mutationFn: async () => {
      setLoading(true); // Set loading state during mutation
      const deletePromises = selectedSubscribers.map((id) => makeRequest(`/subscribe/${id}`, 'DELETE'));
      await Promise.all(deletePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers']);
      setIsBulkDeleteModalOpen(false);
      setSelectedSubscribers([]);
      toast.success('Selected subscribers deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete selected subscribers.');
    }
  });

  const sendMassEmail = useMutation({
    mutationFn: async (data) => {
      setLoading(true); // Set loading state during mutation
      const payload = {
        subject: data.subject,
        message: data.message,
        mediaUrls: data.mediaUrls ? data.mediaUrls.filter(url => url.trim() !== '') : [], // Optional media URLs
      };
      await makeRequest('/subscribe/send-mass-email', 'POST', payload);
    },
    onSuccess: () => {
      setIsMassEmailModalOpen(false);
      toast.success('Mass email sent successfully!');
    },
    onError: () => {
      toast.error('Failed to send mass email.');
    },
    onSettled: () => {
      setLoading(false); // Ensure loading state is reset when the mutation is settled
    }
  });

  // Handlers
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, 300);

  const onAddSubmit = (data) => addSubscriber.mutate(data);
  const onUpdateSubmit = (data) => updateSubscriber.mutate(data);
  const handleDelete = () => deleteSubscriber.mutate();
  const handleBulkDelete = () => bulkDeleteSubscribers.mutate();
  const onMassEmailSubmit = (data) => sendMassEmail.mutate(data);

  // Use React Hook Form for managing forms
  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd }, reset: resetAdd } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, formState: { errors: errorsUpdate }, reset: resetUpdate } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const { register: registerMassEmail, control: controlMassEmail, handleSubmit: handleSubmitMassEmail, formState: { errors: errorsMassEmail }, reset: resetMassEmail } = useForm({
    resolver: zodResolver(massEmailSchema),
    defaultValues: { mediaUrls: [''] },
  });

  const { fields, append, remove } = useFieldArray({
    control: controlMassEmail,
    name: 'mediaUrls',
  });

  const filteredSubscribers = subscribers.filter(subscriber =>
    (subscriber.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastSubscriber = currentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(filteredSubscribers.length / subscribersPerPage)) return;
    setCurrentPage(pageNumber);
  };

  const toggleSubscriberSelection = (id) => {
    setSelectedSubscribers(prev =>
      prev.includes(id) ? prev.filter(subId => subId !== id) : [...prev, id]
    );
  };

  const handleLongPress = (subscriber) => {
    setIsSelecting(true);
    toggleSubscriberSelection(subscriber._id);
  };

  const handleTouchStart = (subscriber) => {
    longPressTimeout.current = setTimeout(() => handleLongPress(subscriber), 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout.current);
  };

  return (
      <HomeLayout roles={['admin', 'blogger', 'consultant']}>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Subscribers</h1>
              <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
                {/* Search Bar */}
                <div className="flex items-center bg-white rounded-lg shadow-md p-2 w-full md:w-64">
                  <FaSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by email"
                    className="w-full focus:outline-none"
                  />
                </div>
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button onClick={() => setIsAddModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950 transition">
                    <FaPlus className="mr-2" /> Add Subscriber
                  </button>
                  <button onClick={() => setIsMassEmailModalOpen(true)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    <FaEnvelope className="mr-2" /> Send Mass Email
                  </button>
                  {selectedSubscribers.length > 0 && (
                    <button onClick={() => setIsBulkDeleteModalOpen(true)} className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                      <FaTrash className="mr-2" /> Delete Selected
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {typeof error === 'string' ? error : 'An error occurred.'}
              </div>
            )}

            {/* Subscribers Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.length === currentSubscribers.length && currentSubscribers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers(currentSubscribers.map(sub => sub._id));
                          } else {
                            setSelectedSubscribers([]);
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-blue-900"
                        aria-label="Select All Subscribers"
                      />
                    </th>
                    <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Lead</th>
                    <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Client</th>
                    <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Handler</th>
                    <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Comments</th>
                    <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isQueryLoading || loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <ClipLoader size={35} color="#3B82F6" />
                      </td>
                    </tr>
                  ) : currentSubscribers.length > 0 ? (
                    currentSubscribers.map((subscriber) => (
                      <tr
                        key={subscriber._id || subscriber.email}
                        className={`border-t ${selectedSubscribers.includes(subscriber._id) ? 'bg-gray-100' : ''}`}
                        onTouchStart={() => handleTouchStart(subscriber)}
                        onTouchEnd={handleTouchEnd}
                      >
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.includes(subscriber._id)}
                            onChange={() => toggleSubscriberSelection(subscriber._id)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                            aria-label={`Select subscriber ${subscriber.email}`}
                          />
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700">{subscriber.email}</td>
                        <td className="py-4 px-6 text-sm text-center">
                          {subscriber.subscribed ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Subscribed</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Unsubscribed</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-center">
                          {subscriber.lead ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Yes</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-center">
                          {subscriber.client ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Yes</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-center">{subscriber.handler || 'N/A'}</td>
                        <td className="py-4 px-6 text-sm text-center">
                          {subscriber.comments && subscriber.comments.length > 0 ? (
                            <span className="text-gray-700 cursor-pointer" title="View Comments">{subscriber.comments.length} Comment(s)</span>
                          ) : (
                            'None'
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Menu menuButton={<MenuButton><FaEllipsisV /></MenuButton>}>
                            <MenuItem onClick={() => {
                              setCurrentSubscriber(subscriber);
                              resetUpdate({ email: subscriber.email });
                              setIsUpdateModalOpen(true);
                            }}>
                              <FaEdit className="inline mr-2" /> Edit
                            </MenuItem>
                            <MenuItem onClick={() => {
                              setCurrentSubscriber(subscriber);
                              setIsDeleteModalOpen(true);
                            }}>
                              <FaTrash className="inline mr-2" /> Delete
                            </MenuItem>
                          </Menu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">No subscribers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredSubscribers.length > subscribersPerPage && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-950'}`}
                    aria-label="Previous Page"
                  >
                    <FaChevronLeft />
                  </button>
                  {[...Array(Math.ceil(filteredSubscribers.length / subscribersPerPage))].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-900 text-white' : 'bg-blue-900 text-white hover:bg-blue-950'}`}
                      aria-label={`Page ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredSubscribers.length / subscribersPerPage)}
                    className={`px-3 py-1 rounded ${currentPage === Math.ceil(filteredSubscribers.length / subscribersPerPage) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-950'}`}
                    aria-label="Next Page"
                  >
                    <FaChevronRight />
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Add Subscriber Modal */}
          <ReusableModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetAdd(); }}>
            <h2 className="text-2xl mb-4">Add New Subscriber</h2>
            <form onSubmit={handleSubmitAdd(onAddSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  {...registerAdd('email')}
                  className={`w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 ${
                    errorsAdd.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter subscriber email"
                />
                {errorsAdd.email && (
                  <p className="text-red-500 text-sm mt-1">{errorsAdd.email.message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => { setIsAddModalOpen(false); resetAdd(); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-300 transition flex items-center justify-center">
                  {addSubscriber.isLoading ? <ClipLoader size={20} color="#fff" /> : 'Add'}
                </button>
              </div>
            </form>
          </ReusableModal>

          {/* Update Subscriber Modal */}
          <ReusableModal isOpen={isUpdateModalOpen} onClose={() => { setIsUpdateModalOpen(false); setCurrentSubscriber(null); resetUpdate(); }}>
            <h2 className="text-2xl mb-4">Update Subscriber</h2>
            <form onSubmit={handleSubmitUpdate(onUpdateSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  {...registerUpdate('email')}
                  className={`w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 ${
                    errorsUpdate.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter new email"
                />
                {errorsUpdate.email && (
                  <p className="text-red-500 text-sm mt-1">{errorsUpdate.email.message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => { setIsUpdateModalOpen(false); setCurrentSubscriber(null); resetUpdate(); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-300 transition flex items-center justify-center">
                  {updateSubscriber.isLoading ? <ClipLoader size={20} color="#fff" /> : 'Update'}
                </button>
              </div>
            </form>
          </ReusableModal>

          {/* Delete Subscriber Modal */}
          <ReusableModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setCurrentSubscriber(null); }}>
            <h2 className="text-2xl mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete <strong>{currentSubscriber?.email}</strong> from subscribers?</p>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => { setIsDeleteModalOpen(false); setCurrentSubscriber(null); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center">
                {deleteSubscriber.isLoading ? <ClipLoader size={20} color="#fff" /> : 'Delete'}
              </button>
            </div>
          </ReusableModal>

          {/* Bulk Delete Modal */}
          <ReusableModal isOpen={isBulkDeleteModalOpen} onClose={() => { setIsBulkDeleteModalOpen(false); }}>
            <h2 className="text-2xl mb-4">Confirm Bulk Deletion</h2>
            <p className="mb-6">Are you sure you want to delete {selectedSubscribers.length} selected subscriber(s)?</p>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => { setIsBulkDeleteModalOpen(false); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
                Cancel
              </button>
              <button type="button" onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center">
                {bulkDeleteSubscribers.isLoading ? <ClipLoader size={20} color="#fff" /> : 'Delete'}
              </button>
            </div>
          </ReusableModal>

          {/* Mass Email Modal */}
          <ReusableModal isOpen={isMassEmailModalOpen} onClose={() => { setIsMassEmailModalOpen(false); resetMassEmail(); }}>
            <h2 className="text-2xl mb-4">Send Mass Email</h2>
            <form onSubmit={handleSubmitMassEmail(onMassEmailSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700">Subject</label>
                <input
                  type="text"
                  {...registerMassEmail('subject')}
                  className={`w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 ${
                    errorsMassEmail.subject ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter email subject"
                />
                {errorsMassEmail.subject && (
                  <p className="text-red-500 text-sm mt-1">{errorsMassEmail.subject.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Message</label>
                <textarea
                  {...registerMassEmail('message')}
                  className={`w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 ${
                    errorsMassEmail.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter email message"
                  rows="4"
                ></textarea>
                {errorsMassEmail.message && (
                  <p className="text-red-500 text-sm mt-1">{errorsMassEmail.message.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Media URLs (Optional)</label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <input
                      type="text"
                      {...registerMassEmail(`mediaUrls.${index}`)}
                      className={`flex-1 mt-1 p-2 border rounded focus:outline-none focus:ring-2 ${
                        errorsMassEmail.mediaUrls?.[index] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                      }`}
                      placeholder={`Enter media URL ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      aria-label={`Remove media URL ${index + 1}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append('')}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Add Another URL
                </button>
                {errorsMassEmail.mediaUrls && errorsMassEmail.mediaUrls.map((err, index) => (
                  err && <p key={`mediaUrl-${index}`} className="text-red-500 text-sm mt-1">URL {index + 1}: {err.message}</p>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsMassEmailModalOpen(false); resetMassEmail(); }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center justify-center"
                >
                  {sendMassEmail.isLoading ? <ClipLoader size={20} color="#fff" /> : 'Send'}
                </button>
              </div>
            </form>
          </ReusableModal>
        </div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </HomeLayout>
  );
};

export default Subscribers;
