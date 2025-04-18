// server/scripts/createAdminUser.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const readline = require("readline");
const path = require("path");

// Load environment variables
// This loads from the .env file in the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Ensure we have a MongoDB URI
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/admitty-forum";

if (!MONGO_URI) {
  console.error("Error: MongoDB URI is not defined. Check your .env file.");
  process.exit(1);
}

console.log("Using MongoDB URI:", MONGO_URI);

// Import User model
const User = require("../models/User");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log(
        `Admin user already exists: ${existingAdmin.username} (${existingAdmin.email})`
      );
      console.log("You can use this admin for seeding communities.");
      mongoose.connection.close();
      rl.close();
      return;
    }

    // If no admin exists, create one
    console.log("No admin user found. Creating a new admin user...");

    // Prompt for admin details
    rl.question("Enter admin username: ", (username) => {
      rl.question("Enter admin email: ", (email) => {
        rl.question("Enter admin password: ", async (password) => {
          try {
            // Create admin user
            const admin = new User({
              username,
              email,
              password,
              role: "admin",
              isAdmin: true,
            });

            await admin.save();

            console.log(`\nAdmin user created successfully:`);
            console.log(`- Username: ${username}`);
            console.log(`- Email: ${email}`);
            console.log(`- Role: admin`);
            console.log(`- ID: ${admin._id}`);
            console.log("\nYou can now run the university seeding script.");

            mongoose.connection.close();
            rl.close();
          } catch (err) {
            console.error("Error creating admin user:", err.message);
            mongoose.connection.close();
            rl.close();
            process.exit(1);
          }
        });
      });
    });
  } catch (err) {
    console.error("Error checking for admin user:", err);
    mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  rl.close();
  process.exit(1);
});
