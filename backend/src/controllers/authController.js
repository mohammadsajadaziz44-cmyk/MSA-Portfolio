const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ success: false, message: "Email or password is incorrect." });
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }

  const token = jwt.sign(
    { id: admin._id.toString(), email: admin.email, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
  return res.json({
    success: true,
    message: "Login successful",
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email }
  });
}

module.exports = { login };
