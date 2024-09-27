const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticateToken = require("../middleware/jwt"); // Ensure the path is correct

// POST route to handle login (doesn't require authentication)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    // Respond with the token and username
    res.json({ message: "Login successful", token, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Example of a protected route that requires authentication
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with user profile data
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
