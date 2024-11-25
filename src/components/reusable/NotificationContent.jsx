import React from 'react';

const NotificationContent = ({ notifications, onItemClick }) => {
  return (
    <ul className="text-gray-700 max-h-60 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <li
            key={index}
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onItemClick(notification)}
            role="menuitem"
          >
            <span>{notification}</span>
          </li>
        ))
      ) : (
        <li className="px-4 py-2 text-gray-500">No notifications</li>
      )}
    </ul>
  );
};

export default NotificationContent;
