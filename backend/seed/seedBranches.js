const mongoose = require("mongoose");
const dotenv = require("dotenv");
const branches = require("../seed/sampleBranches");
const Branch = require("../models/Branch");

dotenv.config();

const seedBranches = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Branch.deleteMany();
    console.log("🗑️ Cleared old branches");

    await Branch.insertMany(branches);
    console.log("🌱 Inserted new branches");

    process.exit();
  } catch (err) {
    console.error("❌ Error while seeding:", err);
    process.exit(1);
  }
};

seedBranches();
