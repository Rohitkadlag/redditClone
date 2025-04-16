// server/config/socket.js
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Import socket handlers
const setupCommentHandlers = require("../socket/handlers/commentHandlers");
const setupNotificationHandlers = require("../socket/handlers/notificationHandlers");

const setupSocketIO = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*", // Change this to your frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: Token not provided"));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Connection event
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user._id}`);

    // Join user to their personal room for notifications
    socket.join(`user:${socket.user._id}`);

    // Setup socket event handlers
    setupCommentHandlers(io, socket);
    setupNotificationHandlers(io, socket);

    // Handle user joining a post/thread room
    socket.on("joinPost", (postId) => {
      socket.join(`post:${postId}`);
      console.log(`${socket.user.username} joined post:${postId}`);
    });

    // Handle user leaving a post/thread room
    socket.on("leavePost", (postId) => {
      socket.leave(`post:${postId}`);
      console.log(`${socket.user.username} left post:${postId}`);
    });

    // Handle user joining a subreddit room
    socket.on("joinSubreddit", (subredditId) => {
      socket.join(`subreddit:${subredditId}`);
      console.log(`${socket.user.username} joined subreddit:${subredditId}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user._id}`);
    });
  });

  return io;
};

module.exports = setupSocketIO;
