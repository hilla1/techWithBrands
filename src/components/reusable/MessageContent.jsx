import React from 'react';

const MessageContent = ({ messages, onItemClick }) => {
  return (
    <ul className="text-gray-700 max-h-60 overflow-y-auto">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <li
            key={index}
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onItemClick(message)}
            role="menuitem"
          >
            <span>{message}</span>
          </li>
        ))
      ) : (
        <li className="px-4 py-2 text-gray-500">No messages</li>
      )}
    </ul>
  );
};

export default MessageContent;
