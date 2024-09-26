const jwt = require("jsonwebtoken");

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token data (like user ID) to request
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = authenticateToken;
