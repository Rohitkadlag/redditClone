// server/scripts/seedUniversities.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
// This loads from the .env file in the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Ensure we have a MongoDB URI
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MongoDB URI is not defined. Check your .env file.");
  process.exit(1);
}

// Log a masked version of the URI for debugging (hide credentials)
const maskedUri = MONGO_URI.replace(
  /(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/,
  "$1***:***@"
);
console.log("Using MongoDB URI:", maskedUri);

// Import Subreddit model
const Subreddit = require("../models/Subreddit");
const User = require("../models/User");

// Connect to MongoDB - strip quotes if present
const cleanUri = MONGO_URI.replace(/^['"]|['"]$/g, "");
mongoose.connect(cleanUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    // Read universities.json file
    const filePath = path.join(__dirname, "universities.json");
    const data = fs.readFileSync(filePath, "utf8");
    const universities = JSON.parse(data);

    console.log(`Found ${universities.length} universities to process`);

    // Find admin user to set as creator
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      console.error("No admin user found. Please create an admin user first.");
      process.exit(1);
    }

    console.log(
      `Using admin user: ${admin.username} (${admin._id}) as community creator`
    );

    // Keep track of progress
    let created = 0;
    let skipped = 0;
    let errors = 0;

    // Process universities in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < universities.length; i += batchSize) {
      const batch = universities.slice(i, i + batchSize);

      // Use Promise.all to process batch concurrently
      const promises = batch.map(async (university) => {
        try {
          const name = university.university_name
            .replace(/[^a-zA-Z0-9_]/g, "_")
            .toLowerCase();

          // Skip if name is too short
          if (name.length < 3) {
            console.log(
              `Skipping ${university.university_name} - name too short`
            );
            skipped++;
            return;
          }

          // Check if community already exists
          const exists = await Subreddit.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
          });

          if (exists) {
            console.log(`Community r/${name} already exists, skipping`);
            skipped++;
            return;
          }

          // Create new community
          const subreddit = new Subreddit({
            name: name.substring(0, 21), // Max length is 21 characters
            description: `Official community for ${university.university_name}`,
            creator: admin._id,
            moderators: [admin._id],
          });

          await subreddit.save();

          // Update subscriber count
          await subreddit.updateSubscriberCount();

          // Add subreddit to admin's followed subreddits
          await User.findByIdAndUpdate(admin._id, {
            $addToSet: { followedSubreddits: subreddit._id },
          });

          console.log(`Created community: r/${name}`);
          created++;
        } catch (err) {
          console.error(
            `Error creating community for ${university.university_name}: ${err.message}`
          );
          errors++;
        }
      });

      await Promise.all(promises);
      console.log(
        `Processed batch ${i}-${i + batch.length} of ${universities.length}`
      );
    }

    console.log("\nSeed completed!");
    console.log(`Created: ${created} communities`);
    console.log(`Skipped: ${skipped} communities`);
    console.log(`Errors: ${errors} communities`);

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error seeding universities:", err);
    mongoose.connection.close();
    process.exit(1);
  }
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
