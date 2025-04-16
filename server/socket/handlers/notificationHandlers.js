// server/socket/handlers/notificationHandlers.js
const User = require("../../models/User");

const setupNotificationHandlers = (io, socket) => {
  // Get unread notifications count
  socket.on("getUnreadCount", async () => {
    try {
      const user = await User.findById(socket.user._id);

      if (!user) {
        return socket.emit("error", { message: "User not found" });
      }

      // Count unread notifications
      const unreadCount = user.notifications.filter(
        (notification) => !notification.read
      ).length;

      // Send count to user
      socket.emit("unreadCount", { count: unreadCount });
    } catch (error) {
      console.error("Error getting unread notifications count:", error);
      socket.emit("error", { message: "Error getting notifications count" });
    }
  });

  // Get user notifications
  socket.on("getNotifications", async () => {
    try {
      const user = await User.findById(socket.user._id);

      if (!user) {
        return socket.emit("error", { message: "User not found" });
      }

      // Get notifications sorted by most recent first
      const notifications = user.notifications.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      // Send notifications to user
      socket.emit("notifications", { notifications });
    } catch (error) {
      console.error("Error getting notifications:", error);
      socket.emit("error", { message: "Error getting notifications" });
    }
  });

  // Mark notification as read
  socket.on("markNotificationRead", async (data) => {
    try {
      const { notificationId } = data;

      const user = await User.findById(socket.user._id);

      if (!user) {
        return socket.emit("error", { message: "User not found" });
      }

      // Find and update notification
      const notification = user.notifications.id(notificationId);

      if (!notification) {
        return socket.emit("error", { message: "Notification not found" });
      }

      notification.read = true;
      await user.save();

      // Send updated unread count
      const unreadCount = user.notifications.filter((n) => !n.read).length;
      socket.emit("unreadCount", { count: unreadCount });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      socket.emit("error", { message: "Error marking notification as read" });
    }
  });

  // Mark all notifications as read
  socket.on("markAllNotificationsRead", async () => {
    try {
      const user = await User.findById(socket.user._id);

      if (!user) {
        return socket.emit("error", { message: "User not found" });
      }

      // Mark all as read
      user.notifications.forEach((notification) => {
        notification.read = true;
      });

      await user.save();

      // Send updated notifications and count
      socket.emit("unreadCount", { count: 0 });
      socket.emit("notificationsUpdated");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      socket.emit("error", {
        message: "Error marking all notifications as read",
      });
    }
  });

  // Delete notification
  socket.on("deleteNotification", async (data) => {
    try {
      const { notificationId } = data;

      const user = await User.findById(socket.user._id);

      if (!user) {
        return socket.emit("error", { message: "User not found" });
      }

      // Find and remove notification
      user.notifications.pull(notificationId);
      await user.save();

      // Send updated unread count
      const unreadCount = user.notifications.filter((n) => !n.read).length;
      socket.emit("unreadCount", { count: unreadCount });
      socket.emit("notificationDeleted", { notificationId });
    } catch (error) {
      console.error("Error deleting notification:", error);
      socket.emit("error", { message: "Error deleting notification" });
    }
  });
};

module.exports = setupNotificationHandlers;
