// server/scripts/createAdmittyManager.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmittyManager = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("MongoDB connected...");

    // Admin user details - customize these as needed
    const admittyManager = {
      username: "admittymanager",
      email: "admin@admitty.com",
      password: "admin123", // Change this to a secure password
      role: "admitty_manager",
      bio: "Admitty Manager Account",
    };

    // Check if admitty manager already exists
    const existingUser = await User.findOne({
      $or: [
        { email: admittyManager.email },
        { username: admittyManager.username },
      ],
    });

    if (existingUser) {
      console.log("Admitty Manager already exists");

      // Update role if needed
      if (existingUser.role !== "admitty_manager") {
        existingUser.role = "admitty_manager";
        await existingUser.save();
        console.log("Updated user to Admitty Manager role");
      }
    } else {
      // Create the admitty manager
      const user = await User.create(admittyManager);
      console.log(`Admitty Manager created: ${user.username} (${user.email})`);
    }

    // Disconnect from database
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Error creating Admitty Manager:", error);
    process.exit(1);
  }
};

// Run the function
createAdmittyManager();
