import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../features/notifications/notificationsSlice";
import { BellIcon, CheckIcon, TrashIcon } from "@heroicons/react/outline";

function NotificationsDropdown({ notifications = [] }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Click outside to close handler would go here in a real app
    const handleClickOutside = (event) => {
      // Implementation
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const getNotificationLink = (notification) => {
    const { type, data } = notification;

    switch (type) {
      case "post":
        return `/r/${data.subredditName}/posts/${data.postId}`;
      case "comment":
      case "reply":
        return `/r/${data.subredditName}/posts/${data.postId}#comment-${data.commentId}`;
      case "follow":
        return `/user/${data.username}`;
      default:
        return "#";
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-3 border-b hover:bg-gray-50 ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between">
                  <Link
                    to={getNotificationLink(notification)}
                    className="flex-1 text-sm"
                    onClick={() =>
                      !notification.read && handleMarkAsRead(notification._id)
                    }
                  >
                    {notification.message}
                  </Link>

                  <div className="flex space-x-1 ml-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Mark as read"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsDropdown;
