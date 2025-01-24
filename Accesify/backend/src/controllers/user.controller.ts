import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../utils/db";
import { validateUserInput } from "../utils/validator";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../middlewares/validateToken";

const client = new OAuth2Client(process.env.CLIENT_ID);

interface UserInput {
  user_name: string;
  email: string;
  password?: string;
  profile_image?: string;
}

interface ValidationResult {
  error?: {
    details: Array<{ message: string }>;
  };
  value?: UserInput;
}

interface TokenPayload {
  name?: string;
  email?: string;
  picture?: string;
}

// Secret keys for signing tokens
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";

export const googleAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { credential } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID, // Use the same client ID used in the frontend
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid token payload");
    }

    // Extract user data
    const { name, email, picture } = payload;

    if (!name || !email) {
      throw new Error("Incomplete user data from Google.");
    }

    // Check if the user already exists in the database
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // Generate a placeholder password for Google-authenticated users
    const placeholderPassword = "google_placeholder_password"; // You can use a random string or a default value
    const hashedPassword = await bcrypt.hash(placeholderPassword, 10); // Hash the placeholder password

    // Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (user_name, email, profile_image, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, picture, hashedPassword] // Include the hashed placeholder password
    );

    // Generate access token (short-lived, e.g., 15 minutes)
    const accessToken = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Generate refresh token (long-lived, e.g., 7 days)
    const refreshToken = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Set access token as an HTTP-only cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token as an HTTP-only cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success response with user data
    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Error during Google authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const signup = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { user_name, email, password, profile_image }: UserInput = req.body;

  try {
    // Validate required fields
    if (!user_name || !email || !password) {
      res.status(400).json({
        message: "All fields must be entered!",
      });
      return;
    }

    // Check if the email already exists in the database
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // Validate user input using Joi
    const { error, value }: ValidationResult = validateUserInput({
      user_name,
      email,
      password,
    });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      res
        .status(400)
        .json({ message: "Validation error", errors: errorMessages });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (user_name, email, password, profile_image) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_name, email, hashedPassword, profile_image || null] // Use null if profile_image is not provided
    );

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const validuser = (req: CustomRequest, res: Response) => {
  const authUser = req.user;
  res.status(200).json({
    success: true,
    message: "Authorized",
    authUser: authUser,
  });
};
