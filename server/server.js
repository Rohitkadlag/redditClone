// // server/server.js
// const express = require("express");
// const http = require("http");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const errorHandler = require("./middleware/errorHandler");
// const connectDB = require("./config/db");
// const setupSocketIO = require("./config/socket");

// const discussionRoutes = require("./routes/discussionRoutes");

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// // Initialize Express app
// const app = express();
// const server = http.createServer(app);

// // Set up Socket.IO with the server
// const io = setupSocketIO(server);

// // Expose io to routes
// app.set("io", io);

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(cors());
// app.use(helmet());
// app.use(morgan("dev"));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/posts", require("./routes/postRoutes"));
// app.use("/api/comments", require("./routes/commentRoutes"));
// app.use("/api/subreddits", require("./routes/subredditRoutes"));
// // server/server.js (add this line in the Routes section)
// app.use("/api/discussions", require("./routes/discussionRoutes"));

// // Health check route
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });

// // Error handler
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });

// server/server.js (updated)
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const setupSocketIO = require("./config/socket");

const path = require("path");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Set up Socket.IO with the server
const io = setupSocketIO(server);

// Expose io to routes
app.set("io", io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/subreddits", require("./routes/subredditRoutes"));
app.use("/api/discussions", require("./routes/discussionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
