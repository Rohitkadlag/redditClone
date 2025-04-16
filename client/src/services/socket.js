import { io } from "socket.io-client";
import { store } from "../store";
import { addNotification } from "../features/notifications/notificationsSlice";

let socket;

export const initializeSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("Cannot initialize socket: No authentication token");
    return null;
  }

  if (socket) socket.disconnect();

  socket = io("http://localhost:5000", {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  // Handle notifications
  socket.on("notification", (notification) => {
    store.dispatch(addNotification(notification));
  });

  // Add other global socket event handlers here

  return socket;
};

export const joinPost = (postId) => {
  if (!socket || !socket.connected) return;
  socket.emit("joinPost", postId);
};

export const leavePost = (postId) => {
  if (!socket || !socket.connected) return;
  socket.emit("leavePost", postId);
};

export const joinSubreddit = (subredditId) => {
  if (!socket || !socket.connected) return;
  socket.emit("joinSubreddit", subredditId);
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;
