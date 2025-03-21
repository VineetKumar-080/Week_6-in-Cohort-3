require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";

// Dummy User (Usually, you'd use a database)
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// Login Route - Generate JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Create JWT Token
  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ token });
});

// Protected Route - Requires JWT
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to the Dashboard!", user: req.user });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });

    req.user = decoded; // Attach user info to request
    next();
  });
}

app.listen(3000, () => console.log("Server running on port 3000"));
