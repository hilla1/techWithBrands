import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { FaTrash, FaEnvelope, FaCheck, FaEllipsisV } from 'react-icons/fa';
import { Menu, MenuItem } from '@mui/material';

const ContactTable = ({ contacts = [], isLoading, isError, onRespond, onDelete, onMarkAsRead }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentContact, setCurrentContact] = React.useState(null);

  const handleMenuOpen = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setCurrentContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentContact(null);
  };

  const handleRespond = () => {
    if (currentContact) {
      onRespond(currentContact);
    }
    handleMenuClose();
  };

  const handleMarkAsRead = () => {
    if (currentContact) {
      onMarkAsRead(currentContact);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (currentContact) {
      onDelete(currentContact);
    }
    handleMenuClose();
  };

  if (isLoading) {
    return <ClipLoader size={35} color="#3B82F6" />;
  }

  if (isError) {
    return <p className="text-center text-red-500">An error occurred while fetching contacts.</p>;
  }

  return (
    <div>
      {/* Mobile View: Cards */}
      <div className="block md:hidden">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className={`border rounded-lg p-4 mb-4 bg-white shadow-md relative ${!contact.isRead ? 'bg-orange-200' : ''}`}
          >
            <button
              onClick={(e) => handleMenuOpen(e, contact)}
              className="absolute top-2 right-2 text-gray-600"
              aria-label="More Options"
            >
              <FaEllipsisV />
            </button>
            <div>
              {/* Contact Name with Color Change */}
              <h6 className={`text-lg font-semibold ${contact.isRead ? 'text-blue-900' : 'text-blue-900'}`}>
                {contact.name}
              </h6>
              <p>{contact.email}</p>
              <p className='text-orange-600 text-xl'>{contact.phone}</p>
              {/* Display the last message */}
              <p>{contact.messages.length > 0 ? contact.messages[contact.messages.length - 1].content : 'No messages'}</p>
              <p className={`font-semibold ${contact.isRead ? 'text-green-600' : 'text-red-600'}`}>
                {contact.isRead ? 'Read' : 'Unread'}
              </p>
              {/* Show "Mark as Read" button only if unread */}
              {!contact.isRead && (
                <button
                  onClick={() => onMarkAsRead(contact)}
                  className="mt-2 bg-blue-900 text-white p-2 rounded"
                  aria-label="Mark as Read"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleRespond}>Respond</MenuItem>
          {!currentContact?.isRead && (
            <MenuItem onClick={handleMarkAsRead}>Mark as Read</MenuItem>
          )}
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Last Message</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(contacts) && contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact._id} className={`border-b ${contact.isRead ? 'bg-white' : 'bg-orange-100'}`}>
                  <td className="py-4 px-6">{contact.name}</td>
                  <td className="py-4 px-6">{contact.email}</td>
                  <td className="py-4 px-6">{contact.phone}</td>
                  {/* Display the last message */}
                  <td className="py-4 px-6">{contact.messages.length > 0 ? contact.messages[contact.messages.length - 1].content : 'No messages'}</td>
                  <td className="py-4 px-6 text-center">
                    {contact.isRead ? (
                      <span className="text-green-600 font-semibold">Read</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Unread</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onRespond(contact)}
                        className="text-blue-900 border-blue-900 border hover:bg-blue-900 hover:text-white p-2 rounded-full"
                        aria-label="Respond"
                      >
                        <FaEnvelope />
                      </button>
                      {!contact.isRead && (
                        <button
                          onClick={() => onMarkAsRead(contact)}
                          className="text-blue-900 border-blue-900 border hover:bg-blue-900 hover:text-white p-2 rounded-full"
                          aria-label="Mark as Read"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(contact)}
                        className="text-orange-600 border-orange-600 border hover:bg-orange-600 hover:text-white p-2 rounded-full"
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No contacts available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;
