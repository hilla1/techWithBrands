// NotificationButton.jsx
import { FiBell } from "react-icons/fi";

export default function NotificationButton({ notifications, show, toggle }) {
  const hasUnread = notifications.some((n) => n.unread);

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm relative"
      >
        <FiBell className="h-4 w-4" />
        {hasUnread && <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>}
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 border-b hover:bg-gray-50 ${
                  n.unread ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      n.unread ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm text-gray-900">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
