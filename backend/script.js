// backend/script.js

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import os from "os";          // Node.js built-in module for hostname, platform, uptime
import osu from "os-utils";   // For CPU usage
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ================== MySQL Connection ==================
let db;
async function connectDB() {
  while (true) {
    try {
      db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      console.log("✅ Connected to MySQL");
      break;
    } catch (err) {
      console.log("❌ MySQL not ready, retrying in 3s...");
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}
await connectDB();

// ================== Token Middleware ==================
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// ================== Auth APIs ==================

// Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "All fields required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error or user exists" });
    console.error(err);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
    console.error(err);
  }
});

// Metrics API
app.get("/metrics/latest", authenticateToken, async (req, res) => {
  osu.cpuUsage((cpuPercent) => {
    res.json({
      cpuUsage: (cpuPercent * 100).toFixed(2) + "%",
      ramUsage:
        (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2) +
        "%",
      diskUsage: "N/A (demo)",          // You can integrate diskusage module later
      uptime: os.uptime() + "s",
      hostname: os.hostname(),
      platform: os.platform(),
      ip: req.socket.remoteAddress,
      processes: process.uptime().toFixed(2) + "s",
      loggedInUser: req.user.username,
    });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
