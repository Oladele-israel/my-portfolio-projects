import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pool from "./utils/db.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully!" });
});

// Google OAuth2 Client
const client = new OAuth2Client({
  clientId: process.env.CLIENT_ID,
});

// Route to handle Google ID token from the frontend
app.post("/auth/google/token", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Missing Google ID token" });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Extract user details from the payload
    const { name, email, picture } = payload;

    // Check if the user already exists in the database
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length === 0) {
      // Insert new user into the database
      await pool.query(
        "INSERT INTO users (user_name, email, password, profile_image) VALUES ($1, $2, $3, $4)",
        [name, email, "placeholder_password", picture]
      );
    }

    // Generate a custom access token
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Store tokens in HTTP-only cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" in production, "lax" in development
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Return success response
    res.status(200).json({
      message: "User authenticated successfully",
      user: { name, email, picture },
    });
  } catch (error) {
    console.error("Error during Google ID token verification:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

// Route to fetch user profile
app.get("/auth/user", async (req, res) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the custom access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const { email } = decoded;

    // Fetch user details from the database
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: user.rows[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Failed to fetch user profile");
  }
});

// Logout route
app.post("/auth/logout", (req, res) => {
  res.clearCookie("access_token");
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log("Connected to the database");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
});
