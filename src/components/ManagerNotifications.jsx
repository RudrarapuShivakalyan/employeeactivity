import { useState, useEffect } from "react";

export default function ManagerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    activityApprovals: true,
    teamUpdates: true,
    systemAlerts: true,
  });

  useEffect(() => {
    fetchNotifications();
    const savedSettings = localStorage.getItem("notificationSettings");
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }
  }, []);

  const fetchNotifications = () => {
    const mockNotifications = [
      { id: 1, type: "approval", title: "Activity Pending Approval", message: "John Doe submitted a new activity for approval", time: "2 min ago", read: false },
      { id: 2, type: "team", title: "Team Goal Milestone", message: "Your team achieved 75% of Q1 Sales Target", time: "1 hour ago", read: false },
      { id: 3, type: "alert", title: "High Rate Rejection", message: "Activity rejection rate is above 10% this week", time: "3 hours ago", read: false },
      { id: 4, type: "update", title: "Team Member Leave", message: "Jane Smith requested leave for March 24-25", time: "5 hours ago", read: true },
      { id: 5, type: "approval", title: "Activity Approved", message: "Mike Johnson's activity was successfully approved", time: "1 day ago", read: true },
    ];
    setNotifications(mockNotifications);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleSaveSettings = () => {
    localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings));
    alert("Notification settings saved!");
    setShowSettings(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "approval":
        return "✅";
      case "team":
        return "👥";
      case "alert":
        return "⚠️";
      case "update":
        return "📢";
      default:
        return "🔔";
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case "approval":
        return "bg-blue-50 border-l-4 border-blue-500";
      case "team":
        return "bg-green-50 border-l-4 border-green-500";
      case "alert":
        return "bg-red-50 border-l-4 border-red-500";
      case "update":
        return "bg-purple-50 border-l-4 border-purple-500";
      default:
        return "bg-gray-50 border-l-4 border-gray-500";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          {unreadCount > 0 && <p className="text-sm text-gray-600">{unreadCount} unread</p>}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Mark All as Read
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm flex items-center gap-2"
          >
            <span>⚙️</span> Settings
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="font-medium text-gray-700">Email Notifications</label>
              <input
                type="checkbox"
                checked={notificationSettings.email}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, email: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="font-medium text-gray-700">Push Notifications</label>
              <input
                type="checkbox"
                checked={notificationSettings.push}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, push: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="font-medium text-gray-700">Activity Approvals</label>
              <input
                type="checkbox"
                checked={notificationSettings.activityApprovals}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, activityApprovals: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="font-medium text-gray-700">Team Updates</label>
              <input
                type="checkbox"
                checked={notificationSettings.teamUpdates}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, teamUpdates: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="font-medium text-gray-700">System Alerts</label>
              <input
                type="checkbox"
                checked={notificationSettings.systemAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, systemAlerts: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveSettings}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center text-gray-600">
            <p className="text-lg">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-sm ${getNotificationBgColor(notification.type)} ${
                notification.read ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3 flex-1">
                  <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-3">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
