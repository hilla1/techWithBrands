import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import HomeLayout from '../components/HomePage/HomeLayout';
import useApiRequest from '../hooks/useApiRequest';
import ContactTable from '../components/contacts/ContactTable';
import RespondModal from '../components/contacts/RespondModal';
import DeleteModal from '../components/contacts/DeleteModal';

const Contacts = () => {
  const { makeRequest } = useApiRequest();
  const queryClient = useQueryClient();

  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: contacts = [], isLoading, isError } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const fetchedContacts = await makeRequest('/contact', 'GET');
      return fetchedContacts;
    },
    onError: () => toast.error('Failed to fetch contacts.'),
  });

  const fetchContactDetails = async (contactId) => {
    const contactDetails = await makeRequest(`/contact/${contactId}`, 'GET');
    return contactDetails;
  };

  const respondMutation = useMutation({
    mutationFn: async (data) => {
      await makeRequest(`/contact/${currentContact._id}/respond`, 'POST', { response: data.response });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      toast.success('Response sent!');
    },
    onError: () => {
      toast.error('Failed to send response.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await makeRequest(`/contact/${currentContact._id}`, 'DELETE');
    },
    onMutate: async () => {
      // Optimistically remove the contact from the cache
      await queryClient.cancelQueries(['contacts']);
      const previousContacts = queryClient.getQueryData(['contacts']);

      queryClient.setQueryData(['contacts'], (oldContacts) =>
        oldContacts.filter((contact) => contact._id !== currentContact._id)
      );

      return { previousContacts };
    },
    onError: (error, variables, context) => {
      // Rollback to the previous contacts in case of error
      queryClient.setQueryData(['contacts'], context.previousContacts);
      toast.error('Failed to delete contact.');
    },
    onSuccess: () => {
      toast.success('Contact message deleted!');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contacts']);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (contactId) => {
      await makeRequest(`/contact/${contactId}/read`, 'PUT');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      toast.success('Contact marked as read!');
    },
    onError: () => {
      toast.error('Failed to mark contact as read.');
    },
  });

  const handleRespond = () => {
    setIsSubmitting(true);
    respondMutation.mutate({ response: responseMessage }, {
      onSuccess: () => {
        setIsRespondModalOpen(false);
        setResponseMessage('');
        setIsSubmitting(false);
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({}, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  const handleMarkAsRead = (contact) => {
    markAsReadMutation.mutate(contact._id);
  };

  const openRespondModal = async (contact) => {
    setCurrentContact(contact);
    setResponseMessage(''); // Reset the response message
    setIsRespondModalOpen(true);

    const contactDetails = await fetchContactDetails(contact._id);
    setCurrentContact(contactDetails);
  };

  return (
      <HomeLayout roles={['admin', 'blogger', 'consultant']}>
        <ToastContainer />
        <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#4A90E2" loading={isLoading} size={50} />
          </div>
        ) : isError ? (
          <p>Error loading contacts. Please try again later.</p>
        ) : contacts.length === 0 ? (
          <p>No contacts found.</p>
        ) : (
          <ContactTable
            contacts={contacts}
            onRespond={openRespondModal}
            onDelete={(contact) => {
              setCurrentContact(contact);
              setIsDeleteModalOpen(true);
            }}
            onMarkAsRead={handleMarkAsRead}
          />
        )}

        <RespondModal
          isOpen={isRespondModalOpen}
          onClose={() => setIsRespondModalOpen(false)}
          currentContact={currentContact}
          responseMessage={responseMessage}
          setResponseMessage={setResponseMessage}
          handleRespond={handleRespond}
          isSubmitting={isSubmitting}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          handleDelete={handleDelete}
        />
      </HomeLayout>
  );
};

export default Contacts;
