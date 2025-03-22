const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_super_secret_key"; // Move this to an environment variable

const app = express();
app.use(express.json());

const users = []; // Store users (temporary storage, use a database in production)

// Signup Route (Register User)
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    users.push({ username, password });

    res.json({ message: "You are signed up" });
    console.log(users);
});

// Signin Route (Login and Issue JWT Token)
app.post("/signin", (req, res) => {
    const { username, password } = req.body;

    const foundUser = users.find((user) => user.username === username && user.password === password);

    if (foundUser) {
        // Generate JWT Token with Expiry
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
        res.json({ token });
    } else {
        res.status(403).json({ message: "Invalid username or password" });
    }
});

// Protected Route (Verify JWT Token)
app.get("/me", (req, res) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "Token required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const foundUser = users.find((user) => user.username === decoded.username);

        if (foundUser) {
            res.json({ username: foundUser.username });
        } else {
            res.status(401).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
