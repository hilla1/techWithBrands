import React from 'react';
import { ClipLoader } from 'react-spinners';
import ReusableModal from '../reusable/ReusableModal';

const formatDateTime = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const RespondModal = ({ isOpen, onClose, currentContact, responseMessage, setResponseMessage, handleRespond, isSubmitting }) => {
  // Ensure currentContact is defined before processing messages and responses
  if (!currentContact) {
    return null; // Or render a loading state/message
  }

  // Combine messages and responses into a single array
  const combinedMessages = [];

  // Add messages
  if (currentContact.messages) {
    currentContact.messages.forEach((message) => {
      combinedMessages.push({
        type: 'message',
        content: message.content,
        createdAt: message.createdAt,
        avatar: currentContact.avatar || 'https://via.placeholder.com/50',
        name: currentContact.name,
      });
    });
  }

  // Add responses
  if (currentContact.responses) {
    currentContact.responses.forEach((response) => {
      combinedMessages.push({
        type: 'response',
        content: response.message,
        createdAt: response.respondedAt,
        avatar: response.respondedBy.avatar || 'https://via.placeholder.com/50',
        name: response.respondedBy.name,
      });
    });
  }

  // Sort combined messages based on createdAt timestamp
  combinedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-primary">Respond to Message</h2>
        <div className="bg-gray-100 p-3 rounded-md mb-4">
          <div className="flex items-center">
            <img 
              src={currentContact.avatar || 'https://via.placeholder.com/50'} 
              alt="Contact Avatar" 
              className="w-12 h-12 rounded-full mr-2" 
            />
            <div>
              <p className="font-semibold">{currentContact.name}</p>
              <p className="text-sm text-gray-600">{currentContact.email}</p>
            </div>
          </div>
        </div>

        {/* Display Combined Messages and Responses */}
        {combinedMessages.length > 0 ? (
          <div className="mb-4">
            {combinedMessages.map((item, index) => (
              <div key={index} className={`flex ${item.type === 'response' ? 'justify-end' : 'items-start'} space-x-2 mb-2`}>
                {item.type === 'response' ? (
                  <>
                    {/* Response Container */}
                    <div className="bg-gray-100 p-2 rounded-md max-w-[70%]">
                      <p className="font-semibold">{item.name}:</p>
                      <p className="text-gray-700">{item.content}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</p>
                    </div>
                    {/* Responder Avatar */}
                    <img 
                      src={item.avatar} 
                      alt="Responder Avatar" 
                      className="w-8 h-8 rounded-full ml-2" 
                    />
                  </>
                ) : (
                  <>
                    {/* Message Avatar and Message */}
                    <img 
                      src={item.avatar} 
                      alt="Message Avatar" 
                      className="w-8 h-8 rounded-full" 
                    />
                    <div className="bg-blue-100 p-2 rounded-md">
                      <p className="text-gray-700">{item.content}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No messages or responses available.</p>
        )}

        {/* Response Input */}
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          rows="5"
          placeholder="Your response..."
          value={responseMessage}
          onChange={(e) => setResponseMessage(e.target.value)}
        ></textarea>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleRespond}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <ClipLoader size={20} color="#fff" /> : 'Send Response'}
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default RespondModal;
