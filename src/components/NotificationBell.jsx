import { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ FETCH NOTIFICATIONS
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id || !token) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/notifications?userId=${user.id}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) return;

        const data = await response.json();
        setNotifications(data);

        // Get unread count
        const countRes = await fetch(
          `http://localhost:5000/api/notifications/unread/count?userId=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (countRes.ok) {
          const countData = await countRes.json();
          setUnreadCount(countData.unreadCount || 0);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initially and then every 30 seconds
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [user?.id, token]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.ok) {
        setNotifications(notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: 1 } : n
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/user/read-all`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user?.id })
        }
      );

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: 1 })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(notifications.filter(n => n.id !== notificationId));
        if (!notification?.isRead) {
          setUnreadCount(Math.max(0, unreadCount - 1));
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'activity': return 'bg-blue-50 border-l-4 border-blue-500';
      case 'loan': return 'bg-purple-50 border-l-4 border-purple-500';
      case 'approval': return 'bg-green-50 border-l-4 border-green-500';
      case 'alert': return 'bg-red-50 border-l-4 border-red-500';
      case 'info': return 'bg-gray-50 border-l-4 border-gray-500';
      default: return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'activity': return '📋';
      case 'loan': return '💰';
      case 'approval': return '✅';
      case 'alert': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg">No notifications yet</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      notif.isRead ? '' : 'bg-indigo-50'
                    } ${getNotificationColor(notif.type)}`}
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notif.type)}
                      </span>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${notif.isRead ? 'text-gray-700' : 'font-bold text-gray-900'}`}>
                            {notif.message}
                          </p>
                          <button
                            onClick={() => handleDelete(notif.id)}
                            className="text-gray-400 hover:text-red-600 flex-shrink-0"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>

                          {!notif.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium ml-auto"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>

                        {notif.actionUrl && (
                          <a
                            href={notif.actionUrl}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block"
                          >
                            View Details →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
