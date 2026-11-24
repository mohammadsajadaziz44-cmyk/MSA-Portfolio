require("dotenv").config();

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

async function seedAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first."
      );
    }
    if (ADMIN_PASSWORD.length < 12)
      throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
    await connectDB();
    const email = ADMIN_EMAIL.toLowerCase().trim();
    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.findOneAndUpdate(
      { email },
      { name: ADMIN_NAME, email, password },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log(`Admin account is ready: ${email}`);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}
seedAdmin();
