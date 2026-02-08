const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/auth");

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }
  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists." });
    }
  }
});

// Sign in by name and email query
router.get("/login", async (req, res) => {
  const { name, email } = req.query;

  // Handle missing name and email
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const user = await User.findOne({
      name: new RegExp(`^${escapeRegex(name)}$`, "i"),
      email: new RegExp(`^${escapeRegex(email)}$`, "i"),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    
    // Set JWT as HTTP-only cookie. Use SameSite=None for cross-site XHR cookies.
    res.cookie('authToken', token, {
      httpOnly: true,
      // Cookies with SameSite=None must also be Secure
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user information
// New secure endpoint - get current user
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Logout endpoint - clear the authentication cookie
router.post("/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None'
  });
  res.json({ message: "Logged out successfully" });
});
module.exports = router;
